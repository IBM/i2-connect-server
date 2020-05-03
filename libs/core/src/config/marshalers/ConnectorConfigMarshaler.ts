
import {
    IConnectorConfigDto, IServiceDto, IFormDefinitionDto,
    IFormSectionDto, IFormConditionDto, IStringValidationDto,  
    IPossibleValueDto, IDefaultValuesDto, ISeedConstraintsDto, ISeedConstraintsItemTypeDto,
    IClientConfigDto, ISeedConstraintsTypesDto, ICharLimitDto
} from "../dto/ConnectorConfigDto";

export interface IConnectorConfig {
    schemaUrl?: string;
    chartingSchemesUrl?: string;
    defaultValues: IDefaultValues;
    services: IService[];    
    clientConfigs?: IClientConfig[];
}

export interface IDefaultValues {
    timeZoneId: string;
    entityTypeId?: string;
    linkTypeId?: string;
    linkDirection?: LinkDirectionEnum;
    resultIdsPersistent?: boolean;
}

export interface IService {
    id: string;
    name: string;
    description?: string;
    acquireUrl: string;
    validateUrl?: string;
    clientConfigType: ClientConfigTypeEnum;
    clientConfigId?: string;
    resultItemTypeIds?: string[];
    seedConstraints?: ISeedConstraints;
    resultIdsPersistent?: boolean;
}

export interface ISeedConstraints {
    connectorIds?: string[];
    seedTypes?: ISeedConstraintsTypes;
    min?: number;
    max?: number;
}

export interface ISeedConstraintsTypes {
    allowedTypes?: SeedContraintsAllowedTypeEnum;
    itemTypes?: ISeedConstraintsItemType[];
}

export interface ISeedConstraintsItemType {
    id?: string;
    min?: number;
    max?: number;
}

export interface IClientConfig {
    id: string;
    config: IFormDefinition;
    type?: ClientConfigTypeEnum;
}

export interface IFormDefinition {
    /**
     * The form sections
     */
    sections: IFormSection[];
}

export interface IFormSection {
    /**
     * The title of the section.
     */
    title?: string;

    /**
     * The conditions to show in the section
     */
    conditions: IFormCondition[];
}

export interface IFormCondition {
    /**
     * The condition id, must be unique across the entire form, this be passed 
     * back in the payload along with the value
     */
    id: string;

    /**
     * The display label for the condition
     */
    label: string;

    /**
     * Description of the condition, e.g. for tooltips
     */
    description?: string;

    /**
     * The logical type for the editor control.
     */
    logicalType: FormConditionLogicalTypeEnum;

    /**
     * Set of possible values that the user can choose from 
     * for 'SELECTED_FROM' and 'SUGGESTED_FROM' logical types
     */
    possibleValues?: IPossibleValue[];

    /**
     * Whether this condition is mandatory.
     */
    mandatory?: boolean;

    /**
     * Used for string related fields like 'SINGLE_LINE_STRING'
     */
    maxStringLength?: ICharLimit;

    /**
     * The minimum value, used for numeric fields such as integer
     */
    minValue?: number;

    /**
     * The maximum value, used for numeric fields such as integer
     */
    maxValue?: number;

    /**
     * Any additional string validation for this condition in the form of a regex.
     * Used for string related fields like 'SINGLE_LINE_STRING'
     */
    extraStringValidation?: IStringValidation;

}

export interface IStringValidation {

    /**
     * Regex string
     */
    regex: string;

    /**
     * The message to display when the value does not match the regex
     */
    message: string;

}

export interface IPossibleValue {
    value: string;

    /**
     * The user displayed value for a 'selected from', if undefined the value will be used
     */
    displayName?: string;
}

export interface ICharLimit {
    size: number;
    units?: | 'utf16codeunits' | 'utf8bytes';
}

export enum LinkDirectionEnum {
    "NONE",
    "BOTH",
    "WITH",
    "AGAINST"
}

export enum ClientConfigTypeEnum {
    "NONE",
    "FORM",
    "CUSTOM"
}

export enum SeedContraintsAllowedTypeEnum {
    "ENTITY",
    "LINK"
}

export enum FormConditionLogicalTypeEnum {
    "DECIMAL",
    "DOUBLE",
    "INTEGER",
    "SINGLE_LINE_STRING",
    "MULTI_LINE_STRING",
    "SUGGESTED_FROM",
    "SELECTED_FROM",
    "BOOLEAN",
    "GEOSPATIAL",
    "DATE",
    "TIME",
    "DATE_AND_TIME",
}


export class ConnectorConfigMarshaler {

    public static marshalFromDto(dto: IConnectorConfigDto): IConnectorConfig {
        if (!dto.defaultValues) {
            throw new Error(`No default values are defined in the connector configuration.`);
        }if (!dto.services) {
            throw new Error(`No services are defined in the connector configuration.`);
        }
        return {
            schemaUrl: dto.schemaUrl,
            chartingSchemesUrl: dto.chartingSchemesUrl,
            defaultValues: DefaultValuesMarshaler.marshalFromDto(dto.defaultValues),
            services: dto.services.map((m) => ServiceMarshaler.marshalFromDto(m)),
            clientConfigs: dto.clientConfigs && dto.clientConfigs.map((m) => ClientConfigMarshaler.marshalFromDto(m)),
        };
    }

    public static marshalToDto(connectorConfig: IConnectorConfig): IConnectorConfigDto {
        return {
            schemaUrl: connectorConfig.schemaUrl,
            chartingSchemesUrl: connectorConfig.chartingSchemesUrl,
            defaultValues: connectorConfig.defaultValues && DefaultValuesMarshaler.marshalToDto(connectorConfig.defaultValues),
            services: connectorConfig.services && connectorConfig.services.map((m) => ServiceMarshaler.marshalToDto(m)),
            clientConfigs: connectorConfig.clientConfigs && connectorConfig.clientConfigs.map((m) => ClientConfigMarshaler.marshalToDto(m)),
        };
    }

}


export class DefaultValuesMarshaler {

    public static marshalFromDto(dto: IDefaultValuesDto): IDefaultValues {
        if (!dto.timeZoneId) {
            throw Error(`Config has no default value for property timeZoneId.`);
        }
        return {
            timeZoneId: dto.timeZoneId,
            entityTypeId: dto.entityTypeId,
            linkTypeId: dto.linkTypeId,
            linkDirection: LinkDirectionEnum[dto.linkDirection],
            resultIdsPersistent: dto.resultIdsPersistent
        };
    }

    public static marshalToDto(defaultValues: IDefaultValues): IDefaultValuesDto {
        return {
            timeZoneId: defaultValues.timeZoneId,
            entityTypeId: defaultValues.entityTypeId,
            linkTypeId: defaultValues.linkTypeId,
            linkDirection: LinkDirectionEnum[defaultValues.linkDirection],
            resultIdsPersistent: defaultValues.resultIdsPersistent
        };
    }

}

export class ServiceMarshaler {

    public static marshalFromDto(dto: IServiceDto): IService {
        if (!dto) {
            throw new Error("Service definition can't be empty or null.");
        }
        if (!dto.id || !dto.name) {
            throw new Error("Id or name properties are missing for a connector service.");
        }
        if (!dto.acquireUrl) {
            throw new Error(`AcquireUrl property is missing for connector service '${dto.id}'.`);
        }
        if (!dto.clientConfigType) {
            throw new Error(`ClientConfigType property is missing for connector service '${dto.id}'.`);
        }
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            acquireUrl: dto.acquireUrl,
            validateUrl: dto.validateUrl,
            clientConfigType: ClientConfigTypeEnum[dto.clientConfigType],
            clientConfigId: dto.clientConfigId,
            resultItemTypeIds: dto.resultItemTypeIds,
            seedConstraints: dto.seedConstraints && SeedConstraintsMarshaler.marshalFromDto(dto.seedConstraints),
            resultIdsPersistent: dto.resultIdsPersistent
        };
    }

    public static marshalToDto(service: IService): IServiceDto {
        return {
            id: service.id,
            name: service.name,
            description: service.description,
            acquireUrl: service.acquireUrl,
            validateUrl: service.validateUrl,
            clientConfigType: ClientConfigTypeEnum[service.clientConfigType],
            clientConfigId: service.clientConfigId,
            resultItemTypeIds: service.resultItemTypeIds,
            seedConstraints: service.seedConstraints && SeedConstraintsMarshaler.marshalToDto(service.seedConstraints),
            resultIdsPersistent: service.resultIdsPersistent
        };
    }

}


export class SeedConstraintsMarshaler {

    public static marshalFromDto(dto: ISeedConstraintsDto): ISeedConstraints {
        return {
            connectorIds: dto.connectorIds,
            seedTypes: dto.seedTypes && SeedConstraintsTypesMarshaler.marshalFromDto(dto.seedTypes),
            min: dto.min,
            max: dto.max
        };
    }

    public static marshalToDto(seedConstraints: ISeedConstraints): ISeedConstraintsDto {
        return {
            connectorIds: seedConstraints.connectorIds,
            seedTypes: seedConstraints.seedTypes && SeedConstraintsTypesMarshaler.marshalToDto(seedConstraints.seedTypes),
            min: seedConstraints.min,
            max: seedConstraints.max
        };
    }

}

export class SeedConstraintsTypesMarshaler {

    public static marshalFromDto(dto: ISeedConstraintsTypesDto): ISeedConstraintsTypes {
        return {
            allowedTypes: SeedContraintsAllowedTypeEnum[dto.allowedTypes],
            itemTypes: dto.itemTypes && dto.itemTypes.map((m) => SeedConstraintsItemsTypeMarshaler.marshalFromDto(m)),
        };
    }

    public static marshalToDto(constraintsTypes: ISeedConstraintsTypes): ISeedConstraintsTypesDto {
        return {
            allowedTypes: SeedContraintsAllowedTypeEnum[constraintsTypes.allowedTypes],
            itemTypes: constraintsTypes.itemTypes && constraintsTypes.itemTypes.map((m) => SeedConstraintsItemsTypeMarshaler.marshalToDto(m)),
        };
    }

}

export class SeedConstraintsItemsTypeMarshaler {

    public static marshalFromDto(dto: ISeedConstraintsItemTypeDto): ISeedConstraintsItemType {
        return {
            id: dto.id,
            min: dto.min,
            max: dto.max
        };
    }

    public static marshalToDto(itemType: ISeedConstraintsItemType): ISeedConstraintsItemTypeDto {
        return {
            id: itemType.id,
            min: itemType.min,
            max: itemType.max
        };
    }

}

export class ClientConfigMarshaler {

    public static marshalFromDto(dto: IClientConfigDto): IClientConfig {
        if (!dto.id) {
            throw new Error("Id property missing for a client config.");
        }
        if (!dto.config) {
            throw new Error("Config section is missing for a client config.");
        }
        return {
            id: dto.id,
            config: FormDefintionMarshaler.marshalFromDto(dto.config),
            type: ClientConfigTypeEnum[dto.type]
        };
    }

    public static marshalToDto(clientConfig: IClientConfig): IClientConfigDto {
        return {
            id: clientConfig.id,
            config: FormDefintionMarshaler.marshalToDto(clientConfig.config),
            type: ClientConfigTypeEnum[clientConfig.type]
        };
    }

}

export class FormDefintionMarshaler {

    public static marshalFromDto(dto: IFormDefinitionDto): IFormDefinition {
        if (!dto.sections) {
            throw new Error("No sections defined for a client config form definition.");
        }
        return {
            sections: dto.sections.map((m) => FormSectionMarshaler.marshalFromDto(m)),
        };
    }

    public static marshalToDto(formDefinition: IFormDefinition): IFormDefinitionDto {
        return {
            sections: formDefinition.sections.map((m) => FormSectionMarshaler.marshalToDto(m)),
        };
    }

}

export class FormSectionMarshaler {

    public static marshalFromDto(dto: IFormSectionDto): IFormSection {
        if (!dto.conditions) {
            throw new Error("No conditions defined for a client config form definition section.");
        }
        return {
            title: dto.title,
            conditions: dto.conditions.map((m) => FormConditionMarshaler.marshalFromDto(m))
        };
    }

    public static marshalToDto(formSection: IFormSection): IFormSectionDto {
        return {
            title: formSection.title,
            conditions: formSection.conditions.map((m) => FormConditionMarshaler.marshalToDto(m))
        };
    }

}

export class FormConditionMarshaler {

    public static marshalFromDto(dto: IFormConditionDto): IFormCondition {
        // validate
        if (!dto.id) {
            throw new Error("Id property missing for a search form condition.");
        }
        if (!dto.label) {
            throw new Error("Label property missing for a search form condition.");
        }
        if (!dto.logicalType) {
            throw new Error("Logical type property missing for a search form condition.");
        }
        const formSection: IFormCondition = {
            id: dto.id,
            label: dto.label,
            description: dto.description,
            logicalType: FormConditionLogicalTypeEnum[dto.logicalType],
            mandatory: dto.mandatory
        };
        switch (formSection.logicalType) {
            case FormConditionLogicalTypeEnum.SINGLE_LINE_STRING:
            case FormConditionLogicalTypeEnum.MULTI_LINE_STRING:
                formSection.maxStringLength = dto.maxStringLength &&
                    CharLimitMarshaler.marshalFromDto(dto.maxStringLength);
                formSection.extraStringValidation = dto.extraStringValidation &&
                    StringValidationMarshaler.marshalFromDto(dto.extraStringValidation);
                break;
            case FormConditionLogicalTypeEnum.SELECTED_FROM:
            case FormConditionLogicalTypeEnum.SUGGESTED_FROM:
                if (formSection.logicalType === FormConditionLogicalTypeEnum.SELECTED_FROM &&
                    !dto.possibleValues) {
                        throw new Error("Possible values missing for a 'selected from' search form condition.");
                }
                formSection.possibleValues = dto.possibleValues &&
                    dto.possibleValues.map((m) => PossibleValueMarshaler.marshalFromDto(m));
                break;
            case FormConditionLogicalTypeEnum.DATE:
            case FormConditionLogicalTypeEnum.TIME:
            case FormConditionLogicalTypeEnum.DATE_AND_TIME:
                // nothing specific to check
                break;
            case FormConditionLogicalTypeEnum.BOOLEAN:
                // nothing specific to check
                break;
            case FormConditionLogicalTypeEnum.GEOSPATIAL:
                // nothing specific to check
                break;
            case FormConditionLogicalTypeEnum.DECIMAL:
            case FormConditionLogicalTypeEnum.DOUBLE:
            case FormConditionLogicalTypeEnum.INTEGER:
                formSection.minValue = dto.minValue;
                formSection.maxValue = dto.maxValue;
                break;
            default:
                throw new Error("Logical type property is invalid for a search form condition.");
        }
        return formSection;
    }

    public static marshalToDto(formCondition: IFormCondition): IFormConditionDto {
        const dto: IFormConditionDto = {
            id: formCondition.id,
            label: formCondition.label,
            description: formCondition.description,
            logicalType: FormConditionLogicalTypeEnum[formCondition.logicalType],
            mandatory: formCondition.mandatory
        };
        switch (formCondition.logicalType) {
            case FormConditionLogicalTypeEnum.SINGLE_LINE_STRING:
            case FormConditionLogicalTypeEnum.MULTI_LINE_STRING:
                dto.maxStringLength = formCondition.maxStringLength &&
                    CharLimitMarshaler.marshalToDto(formCondition.maxStringLength);
                dto.extraStringValidation = formCondition.extraStringValidation &&
                    StringValidationMarshaler.marshalToDto(formCondition.extraStringValidation);
                break;
            case FormConditionLogicalTypeEnum.SELECTED_FROM:
            case FormConditionLogicalTypeEnum.SUGGESTED_FROM:
                dto.possibleValues = formCondition.possibleValues
                    && formCondition.possibleValues.map((m) => PossibleValueMarshaler.marshalToDto(m));
                break;
            case FormConditionLogicalTypeEnum.DATE:
            case FormConditionLogicalTypeEnum.TIME:
            case FormConditionLogicalTypeEnum.DATE_AND_TIME:
                // nothing specific to check
                break;
            case FormConditionLogicalTypeEnum.BOOLEAN:
                // nothing specific to check
                break;
            case FormConditionLogicalTypeEnum.GEOSPATIAL:
                // nothing specific to check
                break;
            case FormConditionLogicalTypeEnum.DECIMAL:
            case FormConditionLogicalTypeEnum.DOUBLE:
            case FormConditionLogicalTypeEnum.INTEGER:
                dto.minValue = formCondition.minValue;
                dto.maxValue = formCondition.maxValue;
                break;
            default:
                break;
        }
        return dto;
    }
}

export class StringValidationMarshaler {

    public static marshalFromDto(dto: IStringValidationDto): IStringValidation {
        // validate
        if (!dto.regex) {
            throw new Error("Regex property missing for a string validatior within a search form condition.");
        }
        if (!dto.message) {
            throw new Error("Message property missing for a string validatior within a search form condition.");
        }       
        return {
            message: dto.message,
            regex: dto.regex
        };
    }

    public static marshalToDto(stringValidation: IStringValidation): IStringValidationDto {
        return {
            message: stringValidation.message,
            regex: stringValidation.regex
        };
    }

}

export class PossibleValueMarshaler {

    public static marshalFromDto(dto: IPossibleValueDto): IPossibleValue {
        // validate
        if (!dto.value) {
            throw new Error("Value property missing for a possible value within a search form condition.");
        }
        return {
            value: dto.value,
            displayName: dto.displayName
        };
    }

    public static marshalToDto(possibleValue: IPossibleValue): IPossibleValueDto {
        return {
            value: possibleValue.value,
            displayName: possibleValue.displayName
        };
    }

}

export class CharLimitMarshaler {

    public static marshalFromDto(dto: ICharLimitDto): ICharLimit {
        // validate
        if (!dto.size) {
            throw new Error("Size property missing for a maxStringLength definition.");
        }
        return {
            size: dto.size,
            units: dto.units
        };
    }

    public static marshalToDto(possibleValue: ICharLimit): ICharLimitDto {
        return {
            size: possibleValue.size,
            units: possibleValue.units
        };
    }

}