package io.idstudios.springapp.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.idstudios.springapp.dao.shipdb.ShipmentRepository;
import io.idstudios.springapp.model.shipdb.Shipment;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ShipmentController {
    private final ShipmentRepository _shipRepository;

    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping("/shipment")
    List<Shipment> all() {
        return _shipRepository.findAll();
    }

}
