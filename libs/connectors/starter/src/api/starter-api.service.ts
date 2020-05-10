import { Injectable, OnModuleInit, Logger, HttpService } from "@nestjs/common";
import { AxiosRequestConfig } from 'axios';
import { Connector, IBaseConnectorService } from "@app/core/connectors";
import { CONNECTOR_ID, SETTING_NAME_BASEURL } from "../constants";


@Injectable()
export class StarterApiService implements OnModuleInit {

    private baseServiceUrl: string;

    constructor(@Connector(CONNECTOR_ID) private baseConnectorService: IBaseConnectorService,
                private httpService: HttpService) {}    
    
    async onModuleInit() {
        try {
            this.baseServiceUrl = await this.baseConnectorService.getSettingValueAsync(SETTING_NAME_BASEURL, true);
        } catch (err) {
            throw Error(`Problem initializing connector: ${err.message}`);
        }
    }

    async runSearchAsync(apiUrl: string, params: any): Promise<any> {
        // call external API and fetch data
        const config: AxiosRequestConfig = {
            params: params
        }
        const url = `${this.baseServiceUrl}${apiUrl}`;
        return await this.makeGetRequestAsync(url, config);
    }
    
    async makeGetRequestAsync(url: string, config?: AxiosRequestConfig): Promise<any> {

        Logger.debug(`Calling external service (GET): ${url} ${JSON.stringify(config.params)}`);
        const webResponse = await this.httpService.get(url, config).toPromise();
        switch (webResponse.status) {
            case 200:
                return webResponse.data;
            default:
                throw Error(webResponse.statusText);
        }
    }


}