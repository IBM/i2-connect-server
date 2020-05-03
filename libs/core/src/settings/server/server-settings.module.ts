import { Module, Global } from '@nestjs/common';
import { ServerSettingsService } from './server-settings.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: ServerSettingsService.getValidator()
        }),
    ],
    providers: [
        ServerSettingsService
    ],
    exports: [
        ServerSettingsService
    ],
})
export class ServerSettingsModule {}
