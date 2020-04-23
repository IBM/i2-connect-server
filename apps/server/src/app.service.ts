import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

    constructor() {}

    getRunning(): string {
        return `
            <html>
                <head></head>
                <body>
                    <h2>Server is running.</h2>
                </body>
            </html>
        `;
    }
}
