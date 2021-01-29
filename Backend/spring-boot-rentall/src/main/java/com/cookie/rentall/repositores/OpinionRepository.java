package com.cookie.rentall.repositores;

import com.cookie.rentall.entity.Opinion;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpinionRepository  extends CrudRepository<Opinion, Long> {
}
