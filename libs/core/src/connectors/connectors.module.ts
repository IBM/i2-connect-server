import { Module, DynamicModule, Global } from '@nestjs/common';
import { BaseConnectorService } from './base.connector.service';
import { IConnectorProvidersFactory } from './interfaces/IBaseConnectorProvidersFactory';
import { ConnectorConfigModule } from '../config/config.module';
import { ConnectorSchemaModule } from '../schema/schema.module';
import { ConnectorChartingSchemesModule } from '../chartingSchemes/chartingSchemes.module';
import { ConnectorTypeMapModule } from '../typemap/typemap.module';
import { ConnectorTransformModule } from '../transforms/transform.module';
import { ConnectorEnvironmentModule } from '../settings/connector/connector.env.module';

@Global()
@Module({})
export class ConnectorsModule {

    public static async registerAsync(providersFactory: IConnectorProvidersFactory): Promise<DynamicModule> {

        const connectorProviders = providersFactory.createConnectorProviders();

        return {
            module: ConnectorsModule,
            imports: [
                ConnectorEnvironmentModule,
                ConnectorConfigModule,
                ConnectorSchemaModule,
                ConnectorChartingSchemesModule,
                ConnectorTypeMapModule,
                ConnectorTransformModule
            ],
            providers: [
                BaseConnectorService,
                ...connectorProviders
            ],
            exports: [
                ...connectorProviders
            ],
        };
    }

}
