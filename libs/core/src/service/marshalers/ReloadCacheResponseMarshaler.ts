import { IReloadCacheResponseDto } from "../dto/IReloadCacheResponseDto";

export class IReloadCacheResponse {

    message: string;

}

export class ReloadCacheMarshaler {

    public static marshalToDto(response: IReloadCacheResponse): IReloadCacheResponseDto {
        return {
            message: response.message
        };
    }

}
