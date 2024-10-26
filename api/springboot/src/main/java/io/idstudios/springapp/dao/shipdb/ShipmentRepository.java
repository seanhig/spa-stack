package io.idstudios.springapp.dao.shipdb;

import org.springframework.data.jpa.repository.JpaRepository;

import io.idstudios.springapp.model.shipdb.Shipment;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface ShipmentRepository extends JpaRepository<Shipment, Integer> {

}