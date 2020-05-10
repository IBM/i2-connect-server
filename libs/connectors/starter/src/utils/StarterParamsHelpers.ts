import { BadRequestException } from "@nestjs/common";
import { IConnectorServiceRequest } from "@app/core/service";
import { DAOD_ORIGIN_IDENTIFIER } from "../constants";

export class Service1Params {
    paramFromForm: string;
    paramFromSeed: string;
}

export class StarterConditionsHelper {

    static service1GetParams(serviceRequest: IConnectorServiceRequest): Service1Params {
        try {
            // get form value
            const formValue = serviceRequest.getConditionValue<string>('condition1', true);
            // get seed based on type
            const entitySeeds = serviceRequest.getEntitySeeds(['i2.entity'], 1, true);
            // get origin ids from the seed (to get seeds that originally came from this connector)
            const ids = serviceRequest.getIdsFromDaodSources(entitySeeds[0].sourceIds, DAOD_ORIGIN_IDENTIFIER, true);
            return {
                paramFromForm: formValue,
                paramFromSeed: ids[0] // will only use the first id (will ignore other ids for merged items)
            }
        } catch (err) {
            throw new BadRequestException(null, err.message);
        }
    }
    
}