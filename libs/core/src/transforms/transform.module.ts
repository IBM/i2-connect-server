import { Module } from '@nestjs/common';
import { ConnectorTransformService } from './transform.service';

@Module({
    imports: [
    ],
    controllers: [
    ],
    providers: [
        ConnectorTransformService
    ],
    exports: [
        ConnectorTransformService
    ]
})
export class ConnectorTransformModule {}