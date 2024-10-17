using System.Collections;
using Confluent.Kafka;
using Confluent.SchemaRegistry;
using Confluent.SchemaRegistry.Serdes;
using io.idstudios.flink.models;
using log4net;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebOrdersController : ControllerBase
    {
        private readonly ILogger _log;
        private readonly IConfiguration _config;

        public WebOrdersController(ILogger<WebOrdersController> log,
            IConfiguration configuration) {
            _log = log;
            _config = configuration;
        }


        [HttpPost]
        public async Task<ActionResult<WebOrder>> PostWebOrder(WebOrder weborder)
        {
            _log.LogWarning("We have a new web order! [" + weborder.web_order_id + "]");
            try {
                using (var schemaRegistry = new CachedSchemaRegistryClient(new SchemaRegistryConfig { Url = this._config.GetValue<String>("KafkaSchemaRegistryUrl") }))
                using (var producer = new ProducerBuilder<string, WebOrder>(new ProducerConfig { BootstrapServers = this._config.GetValue<String>("KafkaBootstrapServers")  })
                        .SetValueSerializer(new AvroSerializer<WebOrder>(schemaRegistry))
                        .Build())
                {
                    await producer.ProduceAsync("weborders",
                        new Message<string, WebOrder>
                        {
                            Key = weborder.customer_name,
                            Value = weborder
                        });

                    producer.Flush(TimeSpan.FromSeconds(30));
                }

            } catch(Exception ex) {
                _log.LogError("Unable to submit web order: " + ex.Message, ex);
            }
            return Ok();
        }
    }
}