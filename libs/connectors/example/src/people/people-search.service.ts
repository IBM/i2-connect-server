import { IDaodResults, IDaodEntity } from "@app/core/service";
import { UtilJsonata } from "@app/core/util";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { IBaseConnectorService, Connector } from "@app/core/connectors";
import { CONNECTOR_ID, SETTING_NAME_PERSONDATAFILE, TRANSFORM_NAME_PERSON } from "../constants";
    
export interface IPerson {
    id: string;
    forename: string;
    surname: string;
    dob: string;
    ssn: string;
    issuedDateAndTime: string;
    friends: string[];
}

@Injectable()
export class PeopleSearchService implements OnModuleInit {
    
    personData: IPerson[];
    personTransform: string;

    constructor(@Connector(CONNECTOR_ID) private baseConnectorService: IBaseConnectorService) {

    }

    async onModuleInit() {    
        try {
            const dataSettingsResult = await this.baseConnectorService.getSettingValueAsync(SETTING_NAME_PERSONDATAFILE);
            const personData = JSON.parse(dataSettingsResult.data);
            this.personData = personData.people as IPerson[];
            this.personTransform = this.baseConnectorService.getTransform(TRANSFORM_NAME_PERSON);
        } catch (err) {
            throw Error(`Problem initializing PersonUtils: ${err.message}`);
        }
    }

    /**
     * Generates results that contains a data set of people
     * @param personFilter - The predicate to filter the data set
     * @returns {IDaodResults} - A set of daod results (entities/links)
     */
    public acquirePeople(personFilter: any): IDaodResults {
        return {
            entities: this.lookupPeople(personFilter).map((person: IPerson) => {
                return this.transformPerson(person)
            }),
            links: []
        };
    }

    /**
     * Queries the people data set
     * @param personFilter - The predicate to filter the data set
     * @returns {IPerson[]} - The people that pass the filter
     */
    public lookupPeople(personFilter: any): IPerson[] {
        return this.personData.filter(personFilter);
    }
    
    /**
     * Marshals a person from the data set into a Person entity
     * @param {IPerson} person - The person from the data set
     */
    public transformPerson(person: IPerson): IDaodEntity {
        return UtilJsonata.transform(person, this.personTransform) as IDaodEntity;
    }

    /**
     * Determines whether a substring occurs within a supplied string, using a case-insensitive comparison
     * @param {string} source - The string to search for a substring within
     * @param {string} searchValue - The substring to search for within the source string
     */
    public caseInsensitiveContains(source: string, searchValue: string): boolean {
        return source.toLowerCase().includes(searchValue.toLowerCase());
    }

}