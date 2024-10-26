package io.idstudios.springapp.controllers;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.GenericPropertyMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.idstudios.springapp.dao.erpdb.OrderRepository;
import io.idstudios.springapp.model.erpdb.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderRepository _orderRepository;
    
    @RequestMapping(value = {"/order"})
    List<Order> all(@RequestParam Optional<String> customerName) {

        if(customerName.isPresent()) {
            log.warn("Using the Matcher for: " + customerName.get());
            ExampleMatcher matcher = ExampleMatcher.matching() 
                .withMatcher("customerName", 
                new GenericPropertyMatcher().contains().ignoreCase()); 

            Order orderExample = new Order();
            orderExample.setCustomerName(customerName.get());
            
            return _orderRepository.findAll(Example.of(orderExample, matcher));
        
        } else {
            log.warn("Getting all the orders");
            return _orderRepository.findAll();
        }
    }
}
