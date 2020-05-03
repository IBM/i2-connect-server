import { Module } from '@nestjs/common';
import { ConnectorsSettingsService } from './connector-settings.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: ConnectorsSettingsService.getValidator()
        }),
    ],
    providers: [
        ConnectorsSettingsService
    ],
    exports: [
        ConnectorsSettingsService
    ],
})
export class ConnectorsSettingsModule {}
