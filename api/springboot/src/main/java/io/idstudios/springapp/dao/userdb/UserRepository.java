package io.idstudios.springapp.dao.userdb;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.idstudios.springapp.model.userdb.User;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}