import { ChannelConfig } from '@nestjstools/messaging';

export class AzureServiceBusChannelConfig extends ChannelConfig {
  public readonly queue: string;
  public readonly fullyQualifiedNamespace: string;
  public readonly autoCreate?: boolean;

  constructor({
                name,
                queue,
                fullyQualifiedNamespace,
                autoCreate,
                enableConsumer,
                avoidErrorsForNotExistedHandlers,
                middlewares,
                normalizer,
              }: AzureServiceBusChannelConfig) {
    super(name, avoidErrorsForNotExistedHandlers, middlewares, enableConsumer, normalizer)
    this.queue = queue;
    this.fullyQualifiedNamespace = fullyQualifiedNamespace;
    this.autoCreate = autoCreate ?? true;
  }
}
