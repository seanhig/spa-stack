import express from 'express';
import { Kafka } from "kafkajs";
import {
  SchemaRegistry,
  readAVSCAsync,
} from "@kafkajs/confluent-schema-registry";
import logger from '../util/logger'


const TOPIC = "weborders";

declare type WebOrder = {
  web_order_id: string;
  order_date: number;
  customer_name: string;
  destination: string;
  product_id: number;
  quantity: number;
};


var router = express.Router();

// WebOrder

router.post('/', async function(req, res, next) {

  const webOrder: WebOrder = { 
    web_order_id: req.body.web_order_id,
    order_date: Date.now(),
    customer_name: req.body.customer_name,
    destination: req.body.destination,
    product_id: parseInt(req.body.product_id),
    quantity: parseInt(req.body.quantity)
  }

  const kafka = new Kafka({
    clientId: 'spa-stack',
    brokers: [process.env.KAFKABOOTSTRAPSERVERS] 
  });

  const registry = new SchemaRegistry({
    host: process.env.KAFKASCHEMAREGISTRYURL,
  });
  
  // create a producer which will be used for producing messages
  const producer = kafka.producer();
  
  const registerSchema = async () => {
    try {
      const schema = await readAVSCAsync("src/model/avro/weborder.avsc");
      const { id } = await registry.register(schema);
      return id;
    } catch (e) {
      logger.error("error registering Kafka schema", e);
      throw e;
    }
  };

  const produceToKafka = async (registryId: number, message: WebOrder) => {
    await producer.connect();
  
    // compose the message: the key is a string
    // the value will be encoded using the avro schema
    const outgoingMessage = {
      key: message.customer_name,
      value: await registry.encode(registryId, message),
    };
  
    // send the message to the previously created topic
    await producer.send({
      topic: TOPIC,
      messages: [outgoingMessage],
    });
  
    // disconnect the producer
    await producer.disconnect();
  };
  

  const createTopic = async () => {
    try {
      const topicExists = (await kafka.admin().listTopics()).includes(TOPIC);
      if (!topicExists) {
        await kafka.admin().createTopics({
          topics: [
            {
              topic: TOPIC,
              numPartitions: 1,
              replicationFactor: 1,
            },
          ],
        });
      }
    } catch (error) {
      logger.error("error creating Kafka topic!", error);
    }
  };

  await createTopic();
  try {
    const registryId = await registerSchema();
    
    if (registryId) {
      registryId && (await produceToKafka(registryId, webOrder));
      logger.info(`Produced message to Kafka: ${JSON.stringify(webOrder)}`);
      res.send(webOrder);
    }
  } catch (error) {
    logger.error('There was an error producing the Kafka WebOrder', error);
    throw error;
  }

});

export default router;