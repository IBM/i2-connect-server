
import { PipeTransform, Injectable, ArgumentMetadata, Logger } from '@nestjs/common';
import { IServiceRequestQueryDto } from '../dto/IServiceRequestQueryDto';
import { IServiceRequestQuery, ServiceRequestQueryMarshaler } from '../marshalers/ServiceRequestQueryMarshaler';

@Injectable()
export class ServiceRequestQueryPipe implements PipeTransform<IServiceRequestQueryDto, IServiceRequestQuery> {

    transform(dto: IServiceRequestQueryDto, metadata: ArgumentMetadata): IServiceRequestQuery {
        return ServiceRequestQueryMarshaler.marshalFromDto(dto);
    }

}