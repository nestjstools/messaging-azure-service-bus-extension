import { Channel } from '@nestjstools/messaging';
import { AzureServiceBusChannelConfig } from './azure-service-bus-channel.config';
import { ServiceBusAdministrationClient, ServiceBusClient } from '@azure/service-bus';

export class AzureServiceBusChannel extends Channel<AzureServiceBusChannelConfig> {
  public readonly client: ServiceBusClient;
  public readonly adminClient?: ServiceBusAdministrationClient = undefined;

  constructor(config: AzureServiceBusChannelConfig) {
    super(config);
    this.client = new ServiceBusClient(config.fullyQualifiedNamespace);

    if (config.autoCreate) {
      this.adminClient = new ServiceBusAdministrationClient(config.fullyQualifiedNamespace);
    }
  }
}
