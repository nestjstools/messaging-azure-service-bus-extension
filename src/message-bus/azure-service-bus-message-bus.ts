import { RoutingMessage } from '@nestjstools/messaging';
import { IMessageBus } from '@nestjstools/messaging';
import { Injectable } from '@nestjs/common';
import { AzureServiceBusChannel } from '../channel/azure-service-bus.channel';
import { ServiceBusMessage } from '@azure/service-bus';
import { ROUTING_KEY_ATTRIBUTE_NAME } from '../const';

@Injectable()
export class AzureServiceBusMessageBus implements IMessageBus {
  constructor(
    private readonly channel: AzureServiceBusChannel,
  ) {
  }

  async dispatch(message: RoutingMessage): Promise<object | void> {
    if (this.channel.config.autoCreate && this.channel.adminClient) {
      await this.channel.adminClient.createQueue(this.channel.config.queue);
    }

    const serviceBusMessage: ServiceBusMessage = {
      body: message.message,
      applicationProperties: {
        [ROUTING_KEY_ATTRIBUTE_NAME]: message.messageRoutingKey,
      }
    };

    const sender = this.channel.client.createSender(this.channel.config.queue);

    try {
      await sender.sendMessages(serviceBusMessage);
    } finally {
      await sender.close();
    }
  }
}
