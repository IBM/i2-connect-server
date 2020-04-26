import { IReloadCacheResponseDto } from "../dto/IReloadCacheResponseDto";

export class IReloadCacheResponse {

    /**
     * Message returned upon successful reload action
     */
    message: string;

}

export class ReloadCacheMarshaler {

    public static marshalToDto(response: IReloadCacheResponse): IReloadCacheResponseDto {
        return {
            message: response.message
        };
    }

}
