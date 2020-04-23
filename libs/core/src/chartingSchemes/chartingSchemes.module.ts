import { Module } from '@nestjs/common';
import { ConnectorChartingSchemesService } from './chartingSchemes.service';

@Module({
    imports: [
    ],
    controllers: [
    ],
    providers: [
        ConnectorChartingSchemesService
    ],
    exports: [
        ConnectorChartingSchemesService
    ]
})
export class ConnectorChartingSchemesModule {}