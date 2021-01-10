package com.cookie.rentall.services;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.stream.Stream;

@Service
public class StorageServiceImpl implements StorageService {
    @Override
    public void init() {

    }

    @Override
    public void store(MultipartFile file, String storedName) {
        try(FileOutputStream fileOutputStream = new FileOutputStream(new File("images/" + storedName))) {
            fileOutputStream.write(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Stream<Path> loadAll() {
        return null;
    }

    @Override
    public Path load(String filename) {
        return null;
    }

    @Override
    public Resource loadAsResource(String filename) {
        return new FileSystemResource(new File("images/" + filename));
    }

    @Override
    public void deleteAll() {

    }
}
