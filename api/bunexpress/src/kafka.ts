import { Kafka, type Producer } from "kafkajs";
import {
  SchemaRegistry,
  readAVSCAsync,
} from "@kafkajs/confluent-schema-registry";
import type { initialize } from "passport";

const logger = require('pino')()

export type WebOrder = {
  web_order_id: string;
  order_date: number;
  customer_name: string;
  destination: string;
  product_id: number;
  quantity: number;
};

export interface IKafkaService {
    initialize() : Promise<void>,
    submitWebOrder(webOrder: WebOrder) : Promise<WebOrder>;
}

class KafkaInitError extends Error {
    constructor() {
        super()
        this.message = "kafka service is not initialized!";
        this.name = "KafkaInitError"
    }
}

class KafkaConfigError extends Error {
    constructor(msg : string) {
        super()
        this.message = msg;
        this.name = "KafkaConfigError"
    }
}

class KafkaService implements IKafkaService {
    private kafka: Kafka | undefined;
    private registry: SchemaRegistry | undefined;
    private producer: Producer | undefined;
    private topic: string  = "weborders";

    constructor() {
    }

    private async registerSchema() {
        try {
            if(!this.registry) throw new KafkaInitError();
            const schema = await readAVSCAsync("src/model/avro/weborder.avsc");
            const { id } = await this.registry.register(schema);
            return id;
        } catch (e) {
        logger.error("[kafka] error registering weborder schema", e);
        throw e;
        }
    }

    private async produceToKafka(registryId: number, message: WebOrder) {
        if(!this.producer || !this.registry) throw new KafkaInitError();

        await this.producer.connect();

        // compose the message: the key is a string
        // the value will be encoded using the avro schema
        const outgoingMessage = {
          key: message.customer_name,
          value: await this.registry.encode(registryId, message),
        };
      
        // send the message to the previously created topic
        await this.producer.send({
          topic: this.topic,
          messages: [outgoingMessage],
        });
      
        // disconnect the producer
        await this.producer.disconnect();
    }

    private async createTopic() {
        if(!this.kafka) throw new KafkaInitError();

        try {
            const topicExists = (await this.kafka.admin().listTopics()).includes(this.topic);
            if (!topicExists) {
              await this.kafka.admin().createTopics({
                topics: [
                  {
                    topic: this.topic,
                    numPartitions: 1,
                    replicationFactor: 1,
                  },
                ],
              });
            }
          } catch (error) {
            logger.error("[kafka] error creating Kafka topic!", error);
          }
    }

    async initialize() : Promise<void> {

        // this should fail fast on startup
        if(!process.env.KAFKABOOTSTRAPSERVERS || 
            process.env.KAFKABOOTSTRAPSERVERS == "") throw new KafkaConfigError("Env KAFKABOOTSTRAPSERVERS must be specified");
        if(!process.env.KAFKASCHEMAREGISTRYURL || 
            process.env.KAFKASCHEMAREGISTRYURL == "") throw new KafkaConfigError("Env KAFKASCHEMAREGISTRYURL must be specified");
        if(process.env.WEBORDERS_KAFKA_TOPIC) {
            this.topic = process.env.WEBORDERS_KAFKA_TOPIC;
        }

        if(!this.kafka) {
            this.kafka = new Kafka({
                clientId: 'spa-stack',
                brokers: [process.env.KAFKABOOTSTRAPSERVERS!] 
              });
            logger.info(`[kafka] Bootstrap Servers: ${process.env.KAFKABOOTSTRAPSERVERS!}`);
        }
        if(!this.registry) {
            this.registry =  new SchemaRegistry({
                host: process.env.KAFKASCHEMAREGISTRYURL!,
              });
              logger.info(`[kafka] Schema Registry: ${process.env.KAFKASCHEMAREGISTRYURL!}`);
            }        
        if(!this.producer) {
            this.producer = this.kafka.producer();
            await this.producer.connect();
            logger.info(`[kafka] Connected!`);
        }
    }

    async submitWebOrder(webOrder: WebOrder) : Promise<WebOrder> {
        await this.initialize();
        await this.createTopic();
        try {
          const registryId = await this.registerSchema();
          
          if (registryId) {
            registryId && (await this.produceToKafka(registryId, webOrder));
            logger.info(`[kafka] Produced message to Kafka: ${JSON.stringify(webOrder)}`);
          }
        } catch (error) {
          logger.error('[kafka] There was an error producing the Kafka WebOrder', error);
          throw error;
        }          
        return webOrder;        
    }
}

export const kafkaService : IKafkaService = new KafkaService();