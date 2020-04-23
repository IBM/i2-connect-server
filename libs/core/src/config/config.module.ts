import { Module } from '@nestjs/common';
import { ConnectorConfigService } from './config.service';

@Module({
    imports: [
    ],
    controllers: [
    ],
    providers: [
        ConnectorConfigService
    ],
    exports: [
        ConnectorConfigService
    ]
})
export class ConnectorConfigModule {}