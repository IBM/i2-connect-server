import { IDaodValidationResponseDto } from "../dto/IDaodValidationResponseDto";

export interface IDaodValidationResponse {

    /**
     * An error message that might be displayed to users
     */
    errorMessage?: string;

}

export class DaodValidationResponseMarshaler {

    public static marshalToDto(validationResponse: IDaodValidationResponse): IDaodValidationResponseDto {
        if (!validationResponse) {
            throw new Error("Validation response can't be empty or null.");
        }
        return {
            errorMessage: validationResponse.errorMessage
        };
    }

}
