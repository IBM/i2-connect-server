import { Module } from '@nestjs/common';
import { ConnectorManifestService } from './manifest.service';

@Module({
    imports: [
    ],
    controllers: [
    ],
    providers: [
        ConnectorManifestService
    ],
    exports: [
        ConnectorManifestService
    ]
})
export class ConnectorManifestModule {}
