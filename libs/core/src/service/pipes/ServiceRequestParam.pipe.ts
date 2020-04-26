
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ServiceRequestParamsMarshaler, IServiceRequestParams } from '../marshalers/ServiceRequestParamsMarshaler';
import { IServiceRequestParamsDto } from '../dto/IServiceRequestParamsDto';

@Injectable()
export class ServiceRequestParamPipe implements PipeTransform<IServiceRequestParamsDto, IServiceRequestParams> {

    transform(dto: IServiceRequestParamsDto, metadata: ArgumentMetadata): IServiceRequestParams {
        return ServiceRequestParamsMarshaler.marshalFromDto(dto);
    }

}