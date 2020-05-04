import { Injectable, HttpService, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class WebProviderService {

    constructor(private httpService: HttpService) {}

    async makeGetRequestAsync(url: string, config?: AxiosRequestConfig): Promise<any> {

        Logger.debug(`Calling external service (GET): ${url} ${JSON.stringify(config)}`);
        const webResponse = await this.httpService.get(url, config).toPromise();
        switch (webResponse.status) {
            case 200:
                return webResponse.data;
            case 404:
                return null;
            default:
                throw Error(webResponse.statusText);
        }
    }

    async makePostRequestAsync(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {

        Logger.debug(`Calling external service (POST): ${url} ${JSON.stringify(config)}`);
        const webResponse = await this.httpService.post(url, data, config).toPromise();
        switch (webResponse.status) {
            case 200:
                return webResponse.data;
            case 404:
                return null;
            default:
                throw Error(webResponse.statusText);
        }
    }

}