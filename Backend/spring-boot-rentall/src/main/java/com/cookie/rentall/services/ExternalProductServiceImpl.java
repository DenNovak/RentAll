package com.cookie.rentall.services;

import com.cookie.rentall.dto.ExternalProductListItem;
import com.cookie.rentall.views.ExternalProductView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ExternalProductServiceImpl implements ExternalProductService {
    private static final String PRODUCT_REGEX = "\"@type\": \"Product\"(([\\s\\S](?!\"@type\": \"Product\"))*)\"itemReviewed\":";
    private static final String PRODUCT_URL = "https://www.mediaexpert.pl/dom-i-ogrod/kosiarki-i-podkaszarki/kosiarki-spalinowe";
    private static final String POJEMNOSC_SILNIKA_START = "Pojemność silnika \\[cm3\\]";
    private static final String SILNIK_MARKA = "Silnik marka";
    private static final String SZEROKODC_KOSZENIA = "Szerokość koszenia \\[mm\\]";
    private static final String REGULACJA_WYSOKOSCI_KOSZENIA = "Regulacja wysokości koszenia";
    private static final String POJEMNOSC_KOSZA = "Pojemność kosza \\[l\\]";
    private static final String PRODUCT_NAME = "\"og:title\" content=\"";
    private static final String PRODUCT_PHOTO = "data-zone=\"OFFERBOX_PHOTO\" data-offer-id=(([\\s\\S](?!/div>))*)>";
    private static final String PRODUCT_PHOTO_INTERNAL = "src=\"(([\\s\\S](?!\"></div>))*)\"";

    @Override
    public List<ExternalProductView> getExternalProductList() {
        List<ExternalProductView> resultList = new ArrayList<>();
        for(int i = 0; i < 3; i++) { //todo учитывать количество страниц
            final String uri = PRODUCT_URL + "?page=" + i;
            RestTemplate restTemplate = createRestTemplate();
            HttpEntity<String> entity = createStringHttpEntity();
            ObjectMapper mapper = getObjectMapper();
            String result = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class).toString();
            Pattern pattern = Pattern.compile(PRODUCT_REGEX, Pattern.MULTILINE | Pattern.UNIX_LINES);
            Matcher matcher = pattern.matcher(result);
            StringBuilder sb = new StringBuilder("{");
            while (matcher.find()) {
                sb.append(matcher.group());
                sb.append("\"\"} },");
                String pr = sb.toString().replace("@type", "type");
                try {
                    resultList.add(getExternalProduct(mapper.readValue(pr, ExternalProductListItem.class)));
                    sb = new StringBuilder("{");
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }
        return resultList;
    }

    private ExternalProductView getExternalProduct(ExternalProductListItem item) {
        ExternalProductView result = new ExternalProductView();
        result.setProductID(item.getProductID());
        if (item.getUrl() != null) {
            RestTemplate restTemplate = createRestTemplate();
            HttpEntity<String> entity = createStringHttpEntity();
            String rawProduct = restTemplate.exchange(item.getUrl(), HttpMethod.GET, entity, String.class).toString();
            result.setPojemnoscSilnika(parseFieldValue(rawProduct, POJEMNOSC_SILNIKA_START, "</td>", false));
            result.setMarkaSilnika(parseFieldValue(rawProduct, SILNIK_MARKA, "</td>", false));
            result.setSzerokoscKoszenia(parseFieldValue(rawProduct, SZEROKODC_KOSZENIA, "</td>", false));
            result.setRegulacjaWysokosciKoszenia(parseFieldValue(rawProduct, REGULACJA_WYSOKOSCI_KOSZENIA, "</td>", false));
            result.setPojemnoscKosza(parseFieldValue(rawProduct, POJEMNOSC_KOSZA, "</td>", false));
            if (result.getPojemnoscKosza() == null) result.setPojemnoscKosza("-");
            result.setName(parseFieldValue(rawProduct, PRODUCT_NAME, "\"><meta property=\"og:site_name\"", true));
            String photo = parseFieldValue(rawProduct, PRODUCT_PHOTO, PRODUCT_PHOTO_INTERNAL);
            if (photo != null && photo.length() > 5)
                result.setPhotoLink(photo.substring(5, photo.length() - 1));
        }
        return result;
    }

    private String parseFieldValue(String rawProduct, String start, String end, boolean isProductName) {
        Pattern pattern = Pattern.compile(getFieldRegex(start, end, isProductName));
        Matcher matcher = pattern.matcher(rawProduct);
        if (matcher.find()) {
            return getFieldValue(start, matcher.group(), end, isProductName);
        }
        return null;
    }

    private String parseFieldValue(String rawProduct, String regex, String regex2) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(rawProduct);
        if (matcher.find()) {
            Pattern pattern1 = Pattern.compile(regex2);
            Matcher matcher1 = pattern1.matcher(matcher.group());
            if (matcher1.find()) {
                return matcher1.group();
            }
        }
        return null;
    }

    private String getFieldRegex(String start, String end, boolean isProductName) {
        return start + (isProductName ? "" : "</em></div></td><td class=\"is-value\">") + "(([\\s\\S](?!/tr))*)" + end;
    }

    private String getFieldValue(String start, String fieldString, String end, boolean isProductName) {
        int startIndex = (start + (isProductName ? "" : "</em></div></td><td class=\"is-value\">")).length();
        int endIndex = fieldString.length() - (end.length() + 1);
        return fieldString.substring(startIndex, endIndex).trim();
    }

    private ObjectMapper getObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }

    private HttpEntity<String> createStringHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.TEXT_HTML));
        headers.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");
        return new HttpEntity<>("parameters", headers);
    }

    private RestTemplate createRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        StringHttpMessageConverter converter = new StringHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(MediaType.TEXT_HTML, MediaType.TEXT_XML));
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);
        return restTemplate;
    }
}
