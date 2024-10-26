package io.idstudios.springapp.dao.erpdb;

import org.springframework.data.jpa.repository.JpaRepository;

import io.idstudios.springapp.model.erpdb.Order;

// This will be AUTO IMPLEMENTED by Spring into a Bean called orderRepository
// CRUD refers Create, Read, Update, Delete

public interface OrderRepository extends JpaRepository<Order, Integer> {

}