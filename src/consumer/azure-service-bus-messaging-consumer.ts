import { AzureServiceBusChannel } from '../channel/azure-service-bus.channel';
import { ConsumerMessage, IMessagingConsumer } from '@nestjstools/messaging';
import { ConsumerMessageDispatcher } from '@nestjstools/messaging';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { MessageConsumer } from '@nestjstools/messaging';
import { ConsumerDispatchedMessageError } from '@nestjstools/messaging';
import { ROUTING_KEY_ATTRIBUTE_NAME } from '../const';
import { MessagingException } from '@nestjstools/messaging/lib/exception/messaging.exception';

@Injectable()
@MessageConsumer(AzureServiceBusChannel)
export class AzureServiceBusMessagingConsumer implements IMessagingConsumer<AzureServiceBusChannel>, OnApplicationShutdown {
  private channel: AzureServiceBusChannel;

  async consume(dispatcher: ConsumerMessageDispatcher, channel: AzureServiceBusChannel): Promise<void> {
    this.channel = channel;
    const receiver = this.channel.client.createReceiver(this.channel.config.queue);

    receiver.subscribe({
      processMessage: async (message) => {
        const routingKey = message.applicationProperties?.[ROUTING_KEY_ATTRIBUTE_NAME];

        if (!routingKey) {
          throw new MessagingException(`Routing header [${ROUTING_KEY_ATTRIBUTE_NAME}] not found in message attribute`);
        }

        await dispatcher.dispatch(
          new ConsumerMessage(message.body, routingKey as string)
        );
      },
      processError: async (args) => {
        console.error(
          `Error occurred with ${args.entityPath} within ${args.fullyQualifiedNamespace}: `,
          args.error
        );
      },
    });

    return Promise.resolve();
  }

  async onError(errored: ConsumerDispatchedMessageError, channel: AzureServiceBusChannel): Promise<void> {
    return Promise.resolve();
  }

  async onApplicationShutdown(signal?: string): Promise<any> {
    if (this.channel) {
      await this.channel.client.close();
    }
  }
}
