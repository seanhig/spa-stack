package io.idstudios.springapp;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.idstudios.springapp.config.AppProperties;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
@RestController
@EnableConfigurationProperties(AppProperties.class)
public class SpringbootAngularApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootAngularApplication.class, args);
	}

	@Bean
	@Autowired
	public NewTopic topic(AppProperties appConfig) {
		log.info("Kafka Topic: " + appConfig.getKafkaTopic());
		return TopicBuilder.name(appConfig.getKafkaTopic())
				.partitions(3)
				.replicas(1)
				.build();
	}
}
