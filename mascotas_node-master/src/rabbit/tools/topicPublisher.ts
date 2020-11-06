"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import * as env from "../../server/environment";
import { RabbitProcessor, IRabbitMessage } from "./common";

export class RabbitTopicPublisher {
    conf = env.getConfig(process.env);
    processors = new Map<string, RabbitProcessor>();
    channel: amqp.Channel;

    constructor(private exchange: string) {
    }

    addProcessor(type: string, processor: RabbitProcessor) {
        this.processors.set(type, processor);
    }

    /**
     * Escucha eventos específicos de cart.
     *
     * article-exist : Es un evento que lo envía Catalog indicando que un articulo existe y es valido para el cart.
     */


    public async send(message: IRabbitMessage): Promise<IRabbitMessage> {
        try {
            const channel = await this.getChannel();
            const exchange = await channel.assertExchange(this.exchange, "topic", { durable: false });

            if (channel.publish(exchange.exchange, message.type, new Buffer(JSON.stringify(message.message)))) {
                console.log("RabbitMQ Publish Question " + message.type);
                return Promise.resolve(message);
            } else {
                return Promise.reject(new Error("No se pudo encolar el mensaje"));
            }

        } catch (err) {
            return new Promise<IRabbitMessage>((resolve, reject) => {
                console.log("RabbitMQ Questions " + err);
                return Promise.reject(err);
            });
        }
    }

    private async getChannel(): Promise<amqp.Channel> {
        if (!this.channel) {
            try {
                const conn = await amqp.connect(this.conf.rabbitUrl);
                this.channel = await conn.createChannel();
                console.log("RabbitMQ " + this.exchange + " conectado");
                this.channel.on("close", function () {
                    console.error("RabbitMQ " + this.exchange + " Conexión cerrada");
                    this.channel = undefined;
                });
            } catch (onReject) {
                console.error("RabbitMQ " + this.exchange + " " + onReject.message);
                this.channel = undefined;
                return Promise.reject(onReject);
            }
        }
        if (this.channel) {
            return Promise.resolve(this.channel);
        } else {
            return Promise.reject(new Error("No channel available"));
        }
    }
}

