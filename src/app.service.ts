import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

    constructor() {}

    getRunning(): string {
        return `The i2 Connector server is running.`;
    }
}
