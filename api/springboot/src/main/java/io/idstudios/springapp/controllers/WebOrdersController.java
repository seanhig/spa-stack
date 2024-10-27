package io.idstudios.springapp.controllers;

import java.time.Instant;
import java.util.concurrent.CompletableFuture;

import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.idstudios.flink.models.WebOrder;
import io.idstudios.springapp.config.AppProperties;
import io.idstudios.springapp.model.payload.WebOrderDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class WebOrdersController {
    
    private final KafkaTemplate<String, WebOrder> kafkaTemplate;
    private final AppProperties appConfig;

    @PostMapping("/weborders")
    public ResponseEntity<WebOrderDTO> submitWebOrder(@RequestBody WebOrderDTO newWebOrder) {

        log.info("We have a new web order: " + newWebOrder.getWeb_order_id());

        WebOrder kafkaOrder = WebOrder.newBuilder()
                .setWebOrderId(newWebOrder.getWeb_order_id())
                .setProductId(newWebOrder.getProduct_id())
                .setCustomerName(newWebOrder.getCustomer_name())
                .setOrderDate(Instant.now().toEpochMilli())
                .setDestination(newWebOrder.getDestination())
                .setQuantity(newWebOrder.getQuantity())
                .build();

        newWebOrder.setOrder_date(kafkaOrder.getOrderDate());
        
        ProducerRecord<String, WebOrder> producerRecord = new ProducerRecord<>(
                appConfig.getKafkaTopic(), kafkaOrder.getCustomerName(), kafkaOrder);
        CompletableFuture<SendResult<String, WebOrder>> completableFuture = kafkaTemplate.send(producerRecord);
        log.debug("Sending kafka message on topic: {}", appConfig.getKafkaTopic());

        completableFuture.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Kafka message successfully sent on topic {} and value {}",
                    appConfig.getKafkaTopic(), result.getProducerRecord().value().toString());
            } else {
                log.error("An error occurred while sending kafka message for event with value {}", producerRecord);
            }
        });

        return ResponseEntity.ok(newWebOrder);
    }
}