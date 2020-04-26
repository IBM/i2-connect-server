import { Module, DynamicModule, Logger, Global } from '@nestjs/common';
import { LoaderServiceFactory } from './loader.factory';
import { ConnectorsModule } from '../connectors/connectors.module';
import { IConnectorProvidersFactory } from '../connectors/interfaces/IBaseConnectorProvidersFactory';
import { IConnectorModulesFactory } from './loader.service';
import { ENV_CONNECTORS_HOME, DEFAULT_CONNECTORS_HOME } from '../constants';


@Global()
@Module({})
export class LoadersModule {

    public static async registerAsync(connectorsHome?: string): Promise<DynamicModule> {

        if (!connectorsHome) {
            // if no connectors home provide then use env variable (ideally would
            // be using the settings module here - but no way to inject it!)
            connectorsHome = process.env[ENV_CONNECTORS_HOME];
        }

        // TODO: allthough this works, would prefer to inject the loader service
        // but NestJs does not seem to have a way of using dependency injection into a static module method
        // This would be required, as this service has to read directory contents
        // and then create a multiple number of providers which doesn't seem to be possible via the
        // regular useFactory pattern.
        const loaderService = await LoaderServiceFactory.createLoaderServiceAsync(connectorsHome);

        const connectorModules = await (loaderService as IConnectorModulesFactory).createConnectorModules();
        return {
            module: LoadersModule,
            imports: [
                // TODO: would be good to only load providers for modules which have successully loaded
                ConnectorsModule.registerAsync(loaderService as IConnectorProvidersFactory),
                ...connectorModules
            ],
        };
    }

}
