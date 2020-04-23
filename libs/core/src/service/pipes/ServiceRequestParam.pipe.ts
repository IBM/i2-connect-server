
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ServiceRequestParamMarshaler, IServiceRequestParam } from '../marshalers/ServiceRequestParamMarshaler';
import { IServiceRequestParamDto } from '../dto/IServiceRequestParamDto';

@Injectable()
export class ServiceRequestParamPipe implements PipeTransform<IServiceRequestParamDto, IServiceRequestParam> {

    transform(dto: IServiceRequestParamDto, metadata: ArgumentMetadata): IServiceRequestParam {
        return ServiceRequestParamMarshaler.marshalFromDto(dto);
    }

}