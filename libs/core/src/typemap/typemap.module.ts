import { Module } from '@nestjs/common';
import { ConnectorTypeMapService } from './typemap.service';

@Module({
    imports: [
    ],
    controllers: [
    ],
    providers: [
        ConnectorTypeMapService
    ],
    exports: [
        ConnectorTypeMapService
    ],
})
export class ConnectorTypeMapModule {}