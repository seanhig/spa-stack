package io.idstudios.springapp.dao.erpdb;

import org.springframework.data.jpa.repository.JpaRepository;

import io.idstudios.springapp.model.erpdb.Product;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface ProductRepository extends JpaRepository<Product, Integer> {

}