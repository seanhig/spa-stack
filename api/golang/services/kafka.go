package services

import (
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/confluentinc/confluent-kafka-go/v2/schemaregistry"
	"github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde"
	"github.com/confluentinc/confluent-kafka-go/v2/schemaregistry/serde/avrov2"
)

type WebOrder struct {
	WebOrderId   string    `json:"web_order_id" avro:"web_order_id"`
	OrderDate    time.Time `json:"order_date" avro:"order_date"`
	CustomerName string    `json:"customer_name" avro:"customer_name"`
	Destination  string    `json:"destination" avro:"destination"`
	ProductId    int       `json:"product_id" avro:"product_id"`
	Quantity     int       `json:"quantity" avro:"quantity"`
}

func SendMessage(webOrder WebOrder) (*WebOrder, error) {

	bootstrapServers := os.Getenv("KAFKABOOTSTRAPSERVERS")
	schemaUrl := os.Getenv("KAFKASCHEMAREGISTRYURL")
	topic := "weborders"

	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": bootstrapServers})

	if err != nil {
		slog.Info(fmt.Sprintf("Failed to create producer: %s", err))
		return nil, err
	}

	slog.Info(fmt.Sprintf("Created Producer %v", p))

	client, err := schemaregistry.NewClient(schemaregistry.NewConfig(schemaUrl))

	if err != nil {
		slog.Info(fmt.Sprintf("Failed to create schema registry client: %s\n", err))
		return nil, err
	}

	ser, err := avrov2.NewSerializer(client, serde.ValueSerde, avrov2.NewSerializerConfig())

	if err != nil {
		slog.Info(fmt.Sprintf("Failed to create serializer: %s", err))
		return nil, err
	}

	deliveryChan := make(chan kafka.Event)

	slog.Info(fmt.Sprintf("Sending weborder id: %s", webOrder.WebOrderId))

	payload, err := ser.Serialize(topic, &webOrder)
	if err != nil {
		slog.Info(fmt.Sprintf("Failed to serialize payload: %s", err))
		return nil, err
	}

	err = p.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Key:            []byte(webOrder.CustomerName),
		Value:          payload,
	}, deliveryChan)
	if err != nil {
		slog.Info(fmt.Sprintf("Produce failed: %v", err))
		return nil, err
	}

	e := <-deliveryChan
	m := e.(*kafka.Message)

	if m.TopicPartition.Error != nil {
		slog.Info(fmt.Sprintf("Delivery failed: %v", m.TopicPartition.Error))
	} else {
		slog.Info(fmt.Sprintf("Delivered message to topic %s [%d] at offset %v",
			*m.TopicPartition.Topic, m.TopicPartition.Partition, m.TopicPartition.Offset))
	}

	close(deliveryChan)

	return &webOrder, nil

}
