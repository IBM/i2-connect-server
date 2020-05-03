import { Test, TestingModule } from '@nestjs/testing';
import { ExampleConnectorController } from './example-connector.controller';
import { ExampleConnectorService } from './example-connector.service';
import { IConnectorProvidersFactory, IBaseConnectorService, BaseConnectorService, ConnectorsModule } from '@app/core/connectors';
import { CONNECTOR_ID, SERVICE_NAMES } from './constants';
import { IConnectorConfigDto, FormConditionLogicalTypeEnum } from '@app/core/config';
import { ITypeMap } from '@app/core/typemap';
import { Provider } from '@nestjs/common';
import { ConnectorsSettingsModule } from '@app/core/settings';
import { IDaodRequest, IServiceRequestQuery, IServiceRequestParams, IServiceRequestMethodTypeEnum } from '@app/core/service';
import { PeopleSearchService, IPerson } from './people/people-search.service';

// mock data
const connectorName = "name";
const connectorSchema: string = "<xml></xml>";
const connectorChartingSchemes: string = "<xml></xml>";
const connectorTransform = "";

const connectorConfig: IConnectorConfigDto = {
    defaultValues: {
        timeZoneId: "EST"
    },
    services: []
};

const connectorTypeMap: ITypeMap = {
    entityMappings: [],
    linkMappings: []
};

const personData = [
    {
        "id": "21bbe625-c8da-4461-a8a0-f7c89aa85889",
        "forename": "John",
        "surname": "Smith",
        "dob": "1971-04-29",
        "ssn": "00453474",
        "issuedDateAndTime": "1976-10-23T13:30:00.409",
        "friends": [
            "e9937725-1f60-4bc3-ab71-cc8f990625ed",
            "a287dfe1-378c-49fd-9cd8-bd841a1c5d76",
            "f0d3d60d-4046-47a6-bc8c-1ea459312871",
            "92b47612-6cd4-47fa-a34d-d50a5acf301c"
        ]
    }
];

const personTransform = `
    {
        "id": id,
        "typeId": "i2.person",
        "properties": {
            "i2.firstName": forename,
            "i2.lastName": surname,
            "i2.dob": dob,
            "i2.ssn": ssn,
            "i2.age": $floor(($millis() - $toMillis(dob)) / 31557600000),
            "i2.ssnIssuedOn": {
                "localDateAndTime": issuedDateAndTime,
                "timeZoneId": "Europe/London",
                "isDST": false
            }
        }
    }
`;

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
                ExampleConnectorService,
                PeopleSearchService
            ],
        }).compile();

        controller = app.get<ExampleConnectorController>(ExampleConnectorController);

        // TODO: change here to mock the source data for testing in a better way
        const service = app.get<PeopleSearchService>(PeopleSearchService);
        service.personData = personData;
        service.personTransform = personTransform;
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

    describe('example search', () => {
        it('should return a person', async () => {
            const daodRequest: IDaodRequest = {
                "payload": {
                    "conditions": [
                        {
                            "id": "term",
                            "logicalType": FormConditionLogicalTypeEnum.SINGLE_LINE_STRING,
                            "value": "john"
                        }
                    ]
                }
            };
            const requestQuery: IServiceRequestQuery = {};
            const requestParams: IServiceRequestParams = {
                serviceName: SERVICE_NAMES[SERVICE_NAMES.exampleSearch],
                methodType: IServiceRequestMethodTypeEnum.ACQUIRE
            };
            const rquestHeaders = {};
            const serviceRequest = controller.createConnectorServiceRequest(
                daodRequest,
                requestQuery,
                requestParams,
                rquestHeaders
            )
            const result = await controller.executeAquireRequest(serviceRequest);
            expect(result).not.toBeUndefined();
            expect(result).toHaveProperty('entities');
            expect(result).toHaveProperty(['entities', 0, 'id'], personData[0].id);
        });
    });

});

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