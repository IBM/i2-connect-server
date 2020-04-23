import { Module, Global } from '@nestjs/common';
import { ServerEnvironmentService } from './server.env.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: ServerEnvironmentService.getValidator()
        }),
    ],
    providers: [
        ServerEnvironmentService
    ],
    exports: [
        ServerEnvironmentService
    ],
})
export class ServerEnvironmentModule {}
