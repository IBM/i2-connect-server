import { Module, HttpModule } from '@nestjs/common';
import { WebProviderService } from './web-provider.service';

@Module({
    imports: [
        HttpModule
    ],
    providers: [
        WebProviderService
    ],
    exports: [
        WebProviderService
    ],
})
export class WebProviderModule {}
