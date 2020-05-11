

import { IConnectorConfigDto, ConnectorConfigMarshaler, DefaultValuesMarshaler, LinkDirectionEnum, IDefaultValuesDto, ServiceMarshaler, IServiceDto, SeedConstraintsMarshaler, ClientConfigTypeEnum, SeedConstraintsTypesMarshaler } from "..";
import { validConfig } from "./__mocks__/ConnectorConfigValid.mock";
import { SeedConstraintsItemsTypeMarshaler, ClientConfigMarshaler, FormDefintionMarshaler, FormSectionMarshaler, FormConditionMarshaler, FormConditionLogicalTypeEnum, PossibleValueMarshaler, StringValidationMarshaler, CharLimitMarshaler, SeedContraintsAllowedTypeEnum } from "./ConnectorConfigMarshaler";
import { IClientConfigDto, IFormDefinitionDto, IFormSectionDto, IFormConditionDto, IStringValidationDto, IPossibleValueDto, ICharLimitDto } from "../dto/ConnectorConfigDto";

function cloneValidConfig(): IConnectorConfigDto {
    return JSON.parse(JSON.stringify(validConfig)); // clone
}

describe("Core/Config/Marshalers/ConnnectorConfigMarshaler - basic tests", () => {

    describe("ConnectorConfigMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig;
            const connectorConfig = ConnectorConfigMarshaler.marshalFromDto(dto);
            expect(connectorConfig.schemaUrl).toEqual(dto.schemaUrl);
            expect(connectorConfig.chartingSchemesUrl).toEqual(dto.chartingSchemesUrl);
        });

        test("Marshal from DTO should succeed - no optional values", () => {
            const dto = cloneValidConfig();
            dto.schemaUrl = undefined;
            dto.chartingSchemesUrl = undefined;
            dto.clientConfigs = undefined;
            const connectorConfig = ConnectorConfigMarshaler.marshalFromDto(dto);
            expect (connectorConfig).toBeDefined();
        });

        test("Marshal from DTO should fail - no services", () => {
            const dto = cloneValidConfig();
            dto.services = null;
            runFailureDataTest(dto, /No services/);
        });        

        test("Marshal from DTO should fail - no default values", () => {
            const dto = cloneValidConfig();
            dto.defaultValues = null;
            const errorMsgToExpect = /No default values/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        function runFailureDataTest(dto: IConnectorConfigDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                ConnectorConfigMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }

        test("Marshal from Object should succeed - valid Object", () => {
            const originalDto = validConfig;
            const config = ConnectorConfigMarshaler.marshalFromDto(originalDto);
            const dto = ConnectorConfigMarshaler.marshalToDto(config);
            expect(dto.schemaUrl).toEqual(config.schemaUrl);
            expect(dto.chartingSchemesUrl).toEqual(config.chartingSchemesUrl);
        });

    });

    describe("DefaultValuesMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.defaultValues;
            const defaultValues = DefaultValuesMarshaler.marshalFromDto(dto);
            expect(defaultValues.entityTypeId).toEqual(dto.entityTypeId);
            expect(defaultValues.linkTypeId).toEqual(dto.linkTypeId);
            expect(defaultValues.linkDirection).toEqual(LinkDirectionEnum[dto.linkDirection]);
            expect(defaultValues.timeZoneId).toEqual(dto.timeZoneId);
        });

        test("Marshal from DTO should fail - no default value, timeZoneId", () => {
            const dto = cloneValidConfig().defaultValues;
            dto.timeZoneId = null;
            const errorMsgToExpect = /no default value for property timeZoneId/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        function runFailureDataTest(dto: IDefaultValuesDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                DefaultValuesMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {
            const originalDto = validConfig.defaultValues;
            const defaultValues = DefaultValuesMarshaler.marshalFromDto(originalDto);
            const dto = DefaultValuesMarshaler.marshalToDto(defaultValues);
            expect(dto.entityTypeId).toEqual(defaultValues.entityTypeId);
            expect(dto.linkTypeId).toEqual(defaultValues.linkTypeId);
            expect(dto.linkDirection).toEqual(LinkDirectionEnum[defaultValues.linkDirection]);
            expect(dto.timeZoneId).toEqual(defaultValues.timeZoneId);
        });

    });

    describe("ServiceMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.services[0];
            const service = ServiceMarshaler.marshalFromDto(dto);
            expect(service.id).toEqual(dto.id);
            expect(service.name).toEqual(dto.name);
            expect(service.description).toEqual(dto.description);
            expect(service.acquireUrl).toEqual(dto.acquireUrl);
            expect(service.validateUrl).toEqual(dto.validateUrl);
            expect(service.clientConfigType).toEqual(ClientConfigTypeEnum[dto.clientConfigType]);
            expect(service.clientConfigId).toEqual(dto.clientConfigId);
            expect(service.resultItemTypeIds).toEqual(dto.resultItemTypeIds);
            expect(service.resultIdsPersistent).toEqual(dto.resultIdsPersistent);
        });

        test("Marshal from DTO should succeed - no optional values", () => {
            const dto = cloneValidConfig().services[0];
            dto.description = undefined;
            dto.validateUrl = undefined;
            dto.clientConfigId = undefined;
            dto.resultItemTypeIds = undefined;
            dto.seedConstraints = undefined;
            dto.resultIdsPersistent = undefined;
            const connectorConfig = ServiceMarshaler.marshalFromDto(dto);
            expect (connectorConfig).toBeDefined();
        });

        test("Marshal from DTO should fail - service is null", () => {
            const dto = null;
            const errorMsgToExpect = /can't be empty or null/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        test("Marshal from DTO should fail - service, no id", () => {
            const dto = cloneValidConfig().services[0];
            dto.id = null;
            const errorMsgToExpect = /Id or name properties are missing/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        test("Marshal from DTO should fail - service, no name", () => {
            const dto = cloneValidConfig().services[0];
            dto.name = null;
            const errorMsgToExpect = /Id or name properties are missing/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        test("Marshal from DTO should fail - service, no acquire url", () => {
            const dto = cloneValidConfig().services[0];
            dto.acquireUrl = null;
            const errorMsgToExpect = /AcquireUrl property is missing/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        test("Marshal from DTO should fail - service, no client config type", () => {
            const dto = cloneValidConfig().services[0];
            dto.clientConfigType = null;
            const errorMsgToExpect = /ClientConfigType property is missing/;
            runFailureDataTest(dto, errorMsgToExpect);
        });

        function runFailureDataTest(dto: IServiceDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                ServiceMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {
            const originalDto = validConfig.services[0];
            const service = ServiceMarshaler.marshalFromDto(originalDto);
            const dto = ServiceMarshaler.marshalToDto(service);
            expect(dto.id).toEqual(service.id);
            expect(dto.name).toEqual(service.name);
            expect(dto.description).toEqual(service.description);
            expect(dto.acquireUrl).toEqual(service.acquireUrl);
            expect(dto.validateUrl).toEqual(service.validateUrl);
            expect(dto.clientConfigType).toEqual(ClientConfigTypeEnum[service.clientConfigType]);
            expect(dto.clientConfigId).toEqual(service.clientConfigId);
            expect(dto.resultItemTypeIds).toEqual(service.resultItemTypeIds);
            expect(dto.resultIdsPersistent).toEqual(service.resultIdsPersistent);
        });

    });

    describe("SeedsConstraintMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {   
            const dto = validConfig.services[0].seedConstraints;
            const seedConstraints = SeedConstraintsMarshaler.marshalFromDto(dto);
            expect(seedConstraints.connectorIds).toEqual(dto.connectorIds);
            expect(seedConstraints.min).toEqual(dto.min);
            expect(seedConstraints.max).toEqual(dto.max);
        });

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.services[0].seedConstraints;
            const seedConstraints = SeedConstraintsMarshaler.marshalFromDto(originalDto);
            const dto = SeedConstraintsMarshaler.marshalToDto(seedConstraints);
            expect(dto.connectorIds).toEqual(seedConstraints.connectorIds);
            expect(dto.min).toEqual(seedConstraints.min);
            expect(dto.max).toEqual(seedConstraints.max);
        });

    });

    describe("SeedConstraintsTypesMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {   
            const dto = validConfig.services[0].seedConstraints.seedTypes;
            const seedConstraintTypes = SeedConstraintsTypesMarshaler.marshalFromDto(dto);
            expect(seedConstraintTypes.allowedTypes).toEqual(SeedContraintsAllowedTypeEnum[dto.allowedTypes]);
        });

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.services[0].seedConstraints.seedTypes;
            const seedConstraintTypes = SeedConstraintsTypesMarshaler.marshalFromDto(originalDto);
            const dto = SeedConstraintsTypesMarshaler.marshalToDto(seedConstraintTypes);
            expect(dto.allowedTypes).toEqual(SeedContraintsAllowedTypeEnum[seedConstraintTypes.allowedTypes]);
        });

    });

    describe("SeedConstraintsTypesMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {   
            const dto = validConfig.services[0].seedConstraints.seedTypes.itemTypes[0];
            const seedConstraintItemTypes = SeedConstraintsItemsTypeMarshaler.marshalFromDto(dto);
            expect(seedConstraintItemTypes.id).toEqual(dto.id);
            expect(seedConstraintItemTypes.min).toEqual(dto.min);
            expect(seedConstraintItemTypes.max).toEqual(dto.max);
        });

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.services[0].seedConstraints.seedTypes.itemTypes[0];
            const seedConstraintItemTypes = SeedConstraintsItemsTypeMarshaler.marshalFromDto(originalDto);
            const dto = SeedConstraintsItemsTypeMarshaler.marshalToDto(seedConstraintItemTypes);
            expect(dto.id).toEqual(seedConstraintItemTypes.id);
            expect(dto.min).toEqual(seedConstraintItemTypes.min);
            expect(dto.max).toEqual(seedConstraintItemTypes.max);
        });

    });

    describe("ClientConfigMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.clientConfigs[0];
            const clientConfig = ClientConfigMarshaler.marshalFromDto(dto);
            expect(clientConfig.id).toEqual(dto.id);
            expect(clientConfig.type).toEqual(ClientConfigTypeEnum[dto.type]);
        });

        test("Marshal from DTO should succeed - no optional values", () => {
            const dto = cloneValidConfig().clientConfigs[0];
            dto.type = undefined;
            const clientConfig = ClientConfigMarshaler.marshalFromDto(dto);
            expect (clientConfig).toBeDefined();
        });

        test("Marshal from DTO should fail - no id", () => {
            const dto = cloneValidConfig().clientConfigs[0];
            dto.id = null;
            runFailureDataTest(dto, /Id property missing/);
        });

        test("Marshal from DTO should fail - no config section", () => {
            const dto = cloneValidConfig().clientConfigs[0];
            dto.config = null;
            runFailureDataTest(dto, /Config section is missing/);
        });

        function runFailureDataTest(dto: IClientConfigDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                ClientConfigMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0];
            const clientConfig = ClientConfigMarshaler.marshalFromDto(originalDto);
            const dto = ClientConfigMarshaler.marshalToDto(clientConfig);
            expect(dto.id).toEqual(clientConfig.id);
            expect(dto.type).toEqual(ClientConfigTypeEnum[clientConfig.type]);
        });

    });

    describe("FormDefintionMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.clientConfigs[0].config;
            const formDefinition = FormDefintionMarshaler.marshalFromDto(dto);
            expect(formDefinition.sections).not.toBeUndefined;
        });

        test("Marshal from DTO should fail - no sections", () => {
            const dto = cloneValidConfig().clientConfigs[0].config;
            dto.sections = null;
            runFailureDataTest(dto, /No sections defined/);
        });

        function runFailureDataTest(dto: IFormDefinitionDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                FormDefintionMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0].config;
            const formDefinition = FormDefintionMarshaler.marshalFromDto(originalDto);
            const dto = FormDefintionMarshaler.marshalToDto(formDefinition);
            expect(formDefinition.sections).not.toBeUndefined;
        });

    });

    describe("FormSectionMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.clientConfigs[0].config.sections[0];
            const section = FormSectionMarshaler.marshalFromDto(dto);
            expect(section.title).toEqual(dto.title);
        });

        test("Marshal from DTO should succeed - no optional values", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0];
            dto.title = undefined;
            const connectorConfig = FormSectionMarshaler.marshalFromDto(dto);
            expect (connectorConfig).toBeDefined();
        });

        test("Marshal from DTO should fail - no conditions", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0];
            dto.conditions = null;
            runFailureDataTest(dto, /No conditions defined/);
        });

        function runFailureDataTest(dto: IFormSectionDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                FormSectionMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0].config.sections[0];
            const section = FormSectionMarshaler.marshalFromDto(originalDto);
            const dto = FormSectionMarshaler.marshalToDto(section);
            expect(dto.title).toEqual(section.title);
        });

    });

    describe("FormConditionMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.clientConfigs[0].config.sections[0].conditions[0];
            const condition = FormConditionMarshaler.marshalFromDto(dto);
            expect(condition.id).toEqual(dto.id);
            expect(condition.label).toEqual(dto.label);
            expect(condition.logicalType).toEqual(FormConditionLogicalTypeEnum[dto.logicalType]);
            expect(condition.description).toEqual(dto.description);
            expect(condition.mandatory).toEqual(dto.mandatory);
            expect(condition.minValue).toEqual(dto.minValue);
            expect(condition.maxValue).toEqual(dto.maxValue);
        });

        test("Marshal from DTO should succeed - no optional values", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0];
            dto.description = undefined;
            dto.mandatory = undefined;
            dto.extraStringValidation = undefined;
            dto.maxStringLength = undefined;
            dto.minValue = undefined;
            dto.maxValue = undefined;
            const connectorConfig = FormConditionMarshaler.marshalFromDto(dto);
            expect (connectorConfig).toBeDefined();
        });

        test("Marshal from DTO should fail - no id", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0];
            dto.id = null;
            runFailureDataTest(dto, /Id property missing/);
        });

        test("Marshal from DTO should fail - no label", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0];
            dto.label = null;
            runFailureDataTest(dto, /Label property missing/);
        });

        test("Marshal from DTO should fail - no logical type", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0];
            dto.logicalType = null;
            runFailureDataTest(dto, /Logical type property missing/);
        });

        test("Marshal from DTO should fail - invalid logical type", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0];
            dto.logicalType = "UNKNOWN";
            runFailureDataTest(dto, /Logical type property is invalid/);
        });

        test("Marshal from DTO should fail - no possible values", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0];
            dto.possibleValues = null;
            runFailureDataTest(dto, /Possible values missing/);
        });

        function runFailureDataTest(dto: IFormConditionDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                FormConditionMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0].config.sections[0].conditions[0];
            const condition = FormConditionMarshaler.marshalFromDto(originalDto);
            const dto = FormConditionMarshaler.marshalToDto(condition);
            expect(dto.id).toEqual(condition.id);
            expect(dto.label).toEqual(condition.label);
            expect(dto.logicalType).toEqual(FormConditionLogicalTypeEnum[condition.logicalType]);
            expect(dto.description).toEqual(condition.description);
            expect(dto.mandatory).toEqual(condition.mandatory);
            expect(dto.minValue).toEqual(condition.minValue);
            expect(dto.maxValue).toEqual(condition.maxValue);
        });

        test("Marshal from Object should succeed - valid Object with invalid type", () => {   
            const originalDto = validConfig.clientConfigs[0].config.sections[0].conditions[0];
            const condition = FormConditionMarshaler.marshalFromDto(originalDto);
            condition.logicalType = -10;
            const dto = FormConditionMarshaler.marshalToDto(condition);
            expect(dto).toBeDefined();
        });

    });

    describe("StringValidationMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {   
            const dto = validConfig.clientConfigs[0].config.sections[0].conditions[2].extraStringValidation;
            const stringValidation = StringValidationMarshaler.marshalFromDto(dto);
            expect(stringValidation.message).toEqual(dto.message);
            expect(stringValidation.regex).toEqual(dto.regex);
        });

        test("Marshal from DTO should fail - missing regex", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[2].extraStringValidation;
            dto.regex = undefined;
            runFailureDataTest(dto, /Regex property missing/);
        });

        test("Marshal from DTO should fail - missing message", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[2].extraStringValidation;
            dto.message = undefined;
            runFailureDataTest(dto, /Message property missing/);
        });

        function runFailureDataTest(dto: IStringValidationDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                StringValidationMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }  

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0].config.sections[0].conditions[2].extraStringValidation;
            const stringValidation = StringValidationMarshaler.marshalFromDto(originalDto);
            const dto = StringValidationMarshaler.marshalToDto(stringValidation);
            expect(dto.message).toEqual(stringValidation.message);
            expect(dto.regex).toEqual(stringValidation.regex);
        });

    });

    describe("PossibleValueMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {
            const dto = validConfig.clientConfigs[0].config.sections[0].conditions[0].possibleValues[0];
            const possibleValue = PossibleValueMarshaler.marshalFromDto(dto);
            expect(possibleValue.displayName).toEqual(dto.displayName);
            expect(possibleValue.value).toEqual(dto.value);
        });

        test("Marshal from DTO should succeed - no optional values", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0].possibleValues[0];
            dto.displayName = undefined;
            const connectorConfig = PossibleValueMarshaler.marshalFromDto(dto);
            expect (connectorConfig).toBeDefined();
        });

        test("Marshal from DTO should fail - no value", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[0].possibleValues[0];
            dto.value = null;
            runFailureDataTest(dto, /Value property missing/);
        });

        function runFailureDataTest(dto: IPossibleValueDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                PossibleValueMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0].config.sections[0].conditions[0].possibleValues[0];
            const possibleValue = PossibleValueMarshaler.marshalFromDto(originalDto);
            const dto = PossibleValueMarshaler.marshalToDto(possibleValue);
            expect(dto.displayName).toEqual(possibleValue.displayName);
            expect(dto.value).toEqual(possibleValue.value);
        });

    });

    describe("CharLimitMarshaler", () => {

        test("Marshal from DTO should succeed - valid DTO", () => {   
            const dto = validConfig.clientConfigs[0].config.sections[0].conditions[2].maxStringLength;
            const charLimit = CharLimitMarshaler.marshalFromDto(dto);
            expect(charLimit.size).toEqual(dto.size);
            expect(charLimit.units).toEqual(dto.units);
        });

        test("Marshal from DTO should fail - missing regex", () => {
            const dto = cloneValidConfig().clientConfigs[0].config.sections[0].conditions[2].maxStringLength;
            dto.size = undefined;
            runFailureDataTest(dto, /Size property missing/);
        });

        function runFailureDataTest(dto: ICharLimitDto, expectedMessage: RegExp) {
            expect.hasAssertions();
            try {  
                CharLimitMarshaler.marshalFromDto(dto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err.message).toMatch(expectedMessage);
            }
        }   

        test("Marshal from Object should succeed - valid Object", () => {   
            const originalDto = validConfig.clientConfigs[0].config.sections[0].conditions[2].maxStringLength;
            const charLimit = CharLimitMarshaler.marshalFromDto(originalDto);
            const dto = CharLimitMarshaler.marshalToDto(charLimit);
            expect(dto.size).toEqual(charLimit.size);
            expect(dto.units).toEqual(charLimit.units);
        });

    });

});
