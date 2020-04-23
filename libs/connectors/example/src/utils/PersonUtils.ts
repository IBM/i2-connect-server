import { IDaodResults, IDaodEntity } from "@app/core/service";
import { UtilJsonata } from "@app/core/util";
    
export interface IPerson {
    id: string;
    forename: string;
    surname: string;
    dob: string;
    ssn: string;
    issuedDateAndTime: string;
    friends: string[];
}

export class PersonUtils {
    
    constructor(private _personData: IPerson[],
                private _personTransform: string) {
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
        return this._personData.filter(personFilter);
    }
    
    /**
     * Marshals a person from the data set into a Person entity
     * @param {IPerson} person - The person from the data set
     */
    public transformPerson(person: IPerson): IDaodEntity {
        return UtilJsonata.transform(person, this._personTransform) as IDaodEntity;
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