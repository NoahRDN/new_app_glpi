package edu.itu.newappglpi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.itu.newappglpi.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    List<UserEntity> findByIsDeletedFalse();
}
