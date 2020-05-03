import { IConnectorConfigDto } from "../../dto/ConnectorConfigDto";

export const validConfig: IConnectorConfigDto = {
    "defaultValues": {
        "timeZoneId": "Europe/London",
        "entityTypeId": "i2.person",
        "linkTypeId": "i2.associate",
        "linkDirection": "NONE"
    },
    "schemaUrl": "/schema",
    "chartingSchemesUrl": "/chartingSchemes",
    "services": [
        {
            "id": "exampleSearch",
            "name": "Example Search",
            "description": "An example search.",
            "acquireUrl": "/exampleSearch/acquire",
            "validateUrl": "/exampleSearch/validate",
            "clientConfigType": "FORM",
            "clientConfigId": "exampleForm",
            "resultItemTypeIds": [
                "i2.person",
                "i2.associate"
            ],
            "seedConstraints": {
                "seedTypes": {
                    "allowedTypes": "ENTITY",
                    "itemTypes": [
                        {
                            "id": "i2.person",
                            "min": 1,
                            "max": 1
                        }
                    ]
                }
            }
        },
        {
            "id": "exampleSeededSearch4",
            "name": "Example Seeded Search 4 ('modify links')",
            "description": "An example that modifies the direction of any link supplied as a seed to be 'AGAINST'",
            "acquireUrl": "/exampleSeededSearch4/acquire",
            "clientConfigType": "NONE",
            "seedConstraints": {
                "seedTypes": {
                    "allowedTypes": "LINK"
                },
            }
        }
    ],
    "clientConfigs": [
        {
            "id": "exampleForm",
            "config": {
                "sections": [
                    {
                        "title": "section title",
                        "conditions": [
                            {
                                id: "cond1",
                                label: "Condition 1",
                                description: "Condition description.",
                                mandatory: true,
                                logicalType: "SELECTED_FROM",
                                possibleValues: [
                                    { displayName: "value 1", value: "v1" }
                                ]               
                            },
                            {
                                id: "cond2",
                                label: "Condition 2",
                                description: "Condition description.",
                                mandatory: false,
                                logicalType: "INTEGER",
                                minValue: 0,
                                maxValue: 10                 
                            },
                            {
                                id: "cond3",
                                label: "Condition 3",
                                description: "Condition description.",
                                mandatory: false,
                                logicalType: "SINGLE_LINE_STRING",
                                maxStringLength: {
                                    size: 10,
                                    units: "utf8bytes"
                                },
                                extraStringValidation: {
                                    message: "enter a valid email",
                                    regex: "regex_expression",
                                }                   
                            },
                            {
                                id: "cond4",
                                label: "Condition 4",
                                logicalType: "MULTI_LINE_STRING"                 
                            },
                            {
                                id: "cond5",
                                label: "Condition 5",
                                logicalType: "SUGGESTED_FROM"                 
                            },
                            {
                                id: "cond6",
                                label: "Condition 6",
                                logicalType: "DATE"                 
                            },
                            {
                                id: "cond7",
                                label: "Condition 7",
                                logicalType: "TIME"                 
                            },
                            {
                                id: "cond8",
                                label: "Condition 8",
                                logicalType: "DATE_AND_TIME"                 
                            },
                            {
                                id: "cond9",
                                label: "Condition 9",
                                logicalType: "BOOLEAN"                 
                            },
                            {
                                id: "cond10",
                                label: "Condition 10",
                                logicalType: "DOUBLE"                 
                            },
                            {
                                id: "cond11",
                                label: "Condition 11",
                                logicalType: "GEOSPATIAL"                 
                            }
                        ]
                    }
                ]
            }
        },
    ]
}