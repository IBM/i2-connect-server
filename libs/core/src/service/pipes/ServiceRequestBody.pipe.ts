
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { IDaodRequestDto } from '../dto/IDaodRequestDto';
import { IDaodRequest, DaodRequestMarshaler } from '../marshalers/DaodRequestMarshaler';

@Injectable()
export class ServiceRequestBodyPipe implements PipeTransform<IDaodRequestDto, IDaodRequest> {

    transform(dto: IDaodRequestDto, metadata: ArgumentMetadata): IDaodRequest {
        return DaodRequestMarshaler.marshalFromDto(dto);
    }

}