package io.idstudios.springapp.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.idstudios.springapp.dao.erpdb.ProductRepository;
import io.idstudios.springapp.model.erpdb.Product;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository _productRepository;

    // Aggregate root
    // tag::get-aggregate-root[]
    @GetMapping("/product")
    List<Product> all() {
        return _productRepository.findAll();
    }

}
