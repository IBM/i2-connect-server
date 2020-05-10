import { Module, HttpModule } from '@nestjs/common';
import { StarterConnectorService } from './starter-connector.service';
import { StarterConnectorController } from './starter-connector.controller';
import { StarterApiService } from './api/starter-api.service';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        StarterConnectorService,
        StarterApiService
    ],
    controllers: [
        StarterConnectorController
    ]
})
export class StarterConnectorModule {}
