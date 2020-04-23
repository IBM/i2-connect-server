

export interface IConnectorConfigDto {
    schemaUrl?: string;
    chartingSchemesUrl?: string;
    defaultValues: IDefaultValuesDto;
    services: IServiceDto[];    
    clientConfigs?: IClientConfigDto[];
}

export interface IDefaultValuesDto {
    timeZoneId: string;
    entityTypeId?: string;
    linkTypeId?: string;
    linkDirection?: string;
    resultIdsPersistent?: boolean;
}

export interface IServiceDto {
    id: string;
    name: string;
    description?: string;
    acquireUrl: string;
    validateUrl?: string;
    clientConfigType: string;
    clientConfigId?: string;
    resultItemTypeIds?: string[];
    seedConstraints?: ISeedConstraintsDto;
    resultIdsPersistent?: boolean;
}

export interface ISeedConstraintsDto {
    connectorIds?: string[];
    seedTypes?: ISeedConstraintsTypesDto;
    min?: number;
    max?: number;
}

export interface ISeedConstraintsTypesDto {
    allowedTypes?: string;
    itemTypes?: ISeedConstraintsItemTypeDto[];
}

export interface ISeedConstraintsItemTypeDto {
    id?: string;
    min?: number;
    max?: number;
}

export interface IClientConfigDto {
    id: string;
    config: IFormDefinitionDto;
    type?: string;
}

export interface IFormDefinitionDto {

    sections: IFormSectionDto[];
}

export interface IFormSectionDto {
    /**
     * The title of the section.
     */
    title?: string;

    /**
     * The conditions to show in the section
     */
    conditions: IFormConditionDto[];
}

export interface IFormConditionDto {
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
    logicalType: string;

    /**
     * Set of possible values that the user can choose from
     * for 'SELECTED_FROM' and 'SUGGESTED_FROM' logical types
     */
    possibleValues?: IPossibleValueDto[];

    /**
     * Whether this condition is mandatory.
     */
    mandatory?: boolean;

    /**
     * Used for string related fields like 'SINGLE_LINE_STRING'
     */
    maxStringLength?: ICharLimitDto;

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
    extraStringValidation?: IStringValidationDto;

}

export interface IStringValidationDto {

    /**
     * Regex string
     */
    regex: string;

    /**
     * The message to display when the value does not match the regex
     */
    message: string;

}

export interface IPossibleValueDto {
    value: string;

    /**
     * The user displayed value for a 'selected from', if undefined the value will be used
     */
    displayName?: string;
}

export interface ICharLimitDto {
    size: number;
    units?: | 'utf16codeunits' | 'utf8bytes';
}