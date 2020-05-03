import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Provider } from '@nestjs/common';
import * as request from 'supertest';

import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';
import { BaseConnectorService, IBaseConnectorService, IConnectorProvidersFactory, ConnectorsModule } from '@app/core/connectors';
import { ConnectorsSettingsModule } from '@app/core/settings';
import { IConnectorConfigDto } from '@app/core/config';
import { ITypeMap } from '@app/core/typemap';

import { CONNECTOR_ID, CONTEXT_ROOT, SERVICE_NAMES } from '../libs/connectors/example/src/constants';
import { ExampleConnectorService } from '../libs/connectors/example/src/example-connector.service';
import { ExampleConnectorController } from '../libs/connectors/example/src/example-connector.controller';
import { DEFAULT_URL_PATH_CONFIG, DEFAULT_URL_PATH_CHARTINGSCHEMES, DEFAULT_URL_PATH_SCHEMA, DEFAULT_URL_PATH_RELOAD, DEFAULT_URL_PATH_ACQUIRE, DEFAULT_URL_PATH_VALIDATE } from '@app/core';

describe('ExampleConnectorController (e2e)', () => {
    let app: INestApplication;

    const testResults: IDaodResults = {
        entities: [],
        links: []
    }

    const validateResult: IDaodValidationResponse = {
    }

    const connectorService = {
        exampleSearchAquire: (serviceRequest: IConnectorServiceRequest) => testResults,
        exampleSearchValidate: (serviceRequest: IConnectorServiceRequest) => validateResult,
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConnectorsSettingsModule,
                ConnectorsModule.registerAsync(new ConnectorFactory())
            ],
            controllers: [
                ExampleConnectorController
            ],
            providers: [
                ExampleConnectorService
            ]
        })
        .overrideProvider(ExampleConnectorService)
        .useValue(connectorService)
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_CONFIG} (GET)`, () => {
        return request(app.getHttpServer())
            .get(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_CONFIG}`)
            .expect(200)
    });

    it(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_SCHEMA} (GET)`, () => {
        return request(app.getHttpServer())
        .get(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_SCHEMA}`)
            .expect(200)
    });

    it(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_CHARTINGSCHEMES} (GET)`, () => {
        return request(app.getHttpServer())
        .get(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_CHARTINGSCHEMES}`)
            .expect(200)
    });    

    it(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_RELOAD} (POST)`, () => {
        return request(app.getHttpServer())
        .post(`/${CONTEXT_ROOT}/${DEFAULT_URL_PATH_RELOAD}`)
            .expect(200)
    });

    const testUrl1 = `/${CONTEXT_ROOT}/${SERVICE_NAMES[SERVICE_NAMES.exampleSearch]}/${DEFAULT_URL_PATH_ACQUIRE}`
    it(`${testUrl1} (POST)`, () => {
        return request(app.getHttpServer())
        .post(testUrl1)
        .send({ payload: {}})
            .expect(200)
    });

    const testUrl2 = `/${CONTEXT_ROOT}/${SERVICE_NAMES[SERVICE_NAMES.exampleSearch]}/${DEFAULT_URL_PATH_VALIDATE}`
    it(`${testUrl2} (POST)`, () => {
        return request(app.getHttpServer())
        .post(testUrl2)
        .send({ payload: {}})
            .expect(200)
    });

    afterAll(async () => {
        await app.close();
    });

});

export class ConnectorFactory implements IConnectorProvidersFactory {

    private baseConnectorService: IBaseConnectorService = {
        connectorId: CONNECTOR_ID,
        connectorName: 'Connector Name',
        initializeAsync: manifest => new Promise(resolve => { resolve() }),
        getConnectorConfigAsDto: requestQuery => { return {} as IConnectorConfigDto },
        getConnectorSchemaAsDto: requestQuery => { return {} as string },
        getConnectorChartingSchemesAsDto: requestQuery => { return {} as string },
        getTypeMap: siteid => { return {} as ITypeMap },
        getTransform: id => { return "" },
        getSettingValueAsync: id => new Promise(resolve => { resolve() }),
        getSettingLogPayloads: () => { return false },
        reloadCachesAsync: () => new Promise(resolve => { resolve() })
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