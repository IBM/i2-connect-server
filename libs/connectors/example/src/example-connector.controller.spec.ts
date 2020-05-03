import { Test, TestingModule } from '@nestjs/testing';
import { ExampleConnectorController } from './example-connector.controller';
import { ExampleConnectorService } from './example-connector.service';
import { IConnectorProvidersFactory, IBaseConnectorService, BaseConnectorService, ConnectorsModule } from '@app/core/connectors';
import { CONNECTOR_ID } from './constants';
import { IConnectorConfigDto } from '@app/core/config';
import { ITypeMap } from '@app/core/typemap';
import { Provider } from '@nestjs/common';
import { ConnectorsSettingsModule } from '@app/core/settings';


describe('ExampleConnectorController', () => {
    
    let controller: ExampleConnectorController;

    beforeAll(async () => {

        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConnectorsSettingsModule,
                ConnectorsModule.registerAsync(new ConnectorFactory())
            ],
            controllers: [
                ExampleConnectorController
            ],
            providers: [
                ExampleConnectorService
            ],
        }).compile();

        controller = app.get<ExampleConnectorController>(ExampleConnectorController);
    });

    describe('get config', () => {
        it('should return a valid connector configuration', async () => {
            const sourceIp = '127.0.0.1';
            const serviceRequestQuery = {

            }
            const result = await controller.getConnectorConfig(sourceIp, serviceRequestQuery);
            expect(result).not.toBeUndefined();
            expect(result).toHaveProperty('services');
            expect(result).toHaveProperty('defaultValues');
        });
    });

});

const connectorName = "name";
const connectorSchema: string = "<xml></xml>"
const connectorChartingSchemes: string = "<xml></xml>"
const connectorTransform = "";

const connectorConfig: IConnectorConfigDto = {
    defaultValues: {
        timeZoneId: "EST"
    },
    services: []
}

const connectorTypeMap: ITypeMap = {
    entityMappings: [],
    linkMappings: []
}

export class ConnectorFactory implements IConnectorProvidersFactory {



    private baseConnectorService: IBaseConnectorService = {
        connectorId: CONNECTOR_ID,
        connectorName: connectorName,
        initializeAsync: manifest => new Promise(resolve => resolve()),
        getConnectorConfigAsDto: (requestQuery) => connectorConfig,
        getConnectorSchemaAsDto: requestQuery => connectorSchema,
        getConnectorChartingSchemesAsDto: requestQuery => connectorChartingSchemes,
        getTypeMap: siteid => connectorTypeMap,
        getTransform: id => connectorTransform,
        getSettingValueAsync: id => new Promise(resolve => resolve()),
        getSettingLogPayloads: () => true,
        reloadCachesAsync: () => new Promise(resolve => resolve())
    }

    public createConnectorProviders(): Provider[] {
        return [
            {
                provide: CONNECTOR_ID,
                useFactory: async (connectorProvider: IBaseConnectorService) => {
                    return this.baseConnectorService;
                },
                inject: [BaseConnectorService],
            }
        ];        
    }    

}