import { Module, DynamicModule, Logger, Global } from '@nestjs/common';
import { LoaderServiceFactory } from './loader.factory';
import { CONNECTORS_HOME } from '../constants';
import { ConnectorsModule } from '../connectors/connectors.module';
import { IConnectorProvidersFactory } from '../connectors/interfaces/IBaseConnectorProvidersFactory';
import { IConnectorModulesFactory } from './loader.service';


@Global()
@Module({})
export class LoadersModule {

    public static async registerAsync(): Promise<DynamicModule> {

        // TODO: allthough this works, would prefer to inject the loader service
        // but NestJs does not seem to have a way of injecting into a static module method
        // This would be required, as this service has to read directory contents
        // and then create a multiple number of providers which isn't possible via the
        // regular useFactory pattern.
        const loaderService = await LoaderServiceFactory.createLoaderServiceAsync(CONNECTORS_HOME);

        // const connectorModules = await (loaderService as IConnectorModulesFactory).createConnectorModules();
        return {
            module: LoadersModule,
            imports: [
                ConnectorsModule.registerAsync(loaderService as IConnectorProvidersFactory),
                // ...connectorModules
            ],
        };
    }

}
