import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class WebProviderService {

    constructor(private httpService: HttpService) {}

    async makeGetRequest(url: string): Promise<any> {

        const webResponse = await this.httpService.get(url).toPromise();
        switch (webResponse.status) {
            case 200:
                return webResponse.data;
            case 404:
                return null;
            default:
                throw Error(webResponse.statusText);
        }
    }

    async makePostRequest(url: string, data?: any): Promise<any> {

        const webResponse = await this.httpService.post(url, data).toPromise();
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