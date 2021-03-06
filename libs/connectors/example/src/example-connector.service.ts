// nest js
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

// core
import { Connector, IBaseConnectorService } from '@app/core/connectors';
import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse, IDaodLink } from '@app/core/service';
import { LinkDirectionEnum } from '@app/core/config';

// connector helpers
import { PeopleSearchService, IPerson } from './people/people-search.service';
import { CONNECTOR_ID} from './constants';


@Injectable()
export class ExampleConnectorService implements OnModuleInit {

    constructor(@Connector(CONNECTOR_ID) private baseConnectorService: IBaseConnectorService,
                private peopleSearchService: PeopleSearchService) {}    
    
    async onModuleInit() {
        Logger.debug('Initializing connector.', this.baseConnectorService.connectorName)
    }

    async exampleSearchAcquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {

        // Retrieve a header value and output to log
        const userAgent = serviceRequest.getHeader('user-agent');
        Logger.log(`Request from user-agent '${userAgent}'.`, this.baseConnectorService.connectorName);

        // Pull out the search term using the identifier defined in the client configuration
        const term = serviceRequest.getConditionValue<string>("term");

        const results = this.peopleSearchService.acquirePeople((person: IPerson) => {
            // Use the search term to filter the data set
            // "term" is a mandatory condition, so it always has a value
            if (term === "*") {
                return true;
            } else {
                return this.peopleSearchService.caseInsensitiveContains(person.forename, term)
                    || this.peopleSearchService.caseInsensitiveContains(person.surname, term);
            }
        });

        return results;
    }

    async exampleSearchValidate(serviceRequest: IConnectorServiceRequest): Promise<IDaodValidationResponse> {
        return {
            errorMessage: undefined
        };
    }

    async exampleSeededSearch1Acquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        // Pull out the option using the identifier defined in the client configuration
        const useYearOfBirth = serviceRequest.getConditionValue<boolean>("useYearOfBirth");

        // Pull out the seed
        const seeds = serviceRequest.mappedPayload.seeds;
        const seed = seeds.entities[0];
        const forename = seed.properties["i2.firstName"];
        const surname = seed.properties["i2.lastName"];
        const dob = seed.properties["i2.dob"];

        // Potential seeds that came from this source
        const externalIds = serviceRequest.getIdsFromDaodSources(seed.sourceIds);

        const results = this.peopleSearchService.acquirePeople((person: IPerson) => {
            // Filter out records that are known to be charted, to prevent duplicates
            if (externalIds.includes(person.id)) {
                return false;
            }

            // Look for people with the same given name, surname, or year of birth
            // But exclude the seed from the response
            return (
                person.forename.localeCompare(forename) === 0 ||
                person.surname.localeCompare(surname) === 0 ||
                // Date of birth is formatted as 'YYYY-MM-DD'
                (useYearOfBirth && dob && person.dob.substring(0, 4) === dob.substring(0, 4))
            );
        });

        return results;
    }

    async exampleSeededSearch2Acquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        const seedEntities = serviceRequest.mappedPayload.seeds.entities;

        const responseEntities = [];
        const responseLinks = [];
        
        seedEntities.forEach(seed => {
            const externalIds = serviceRequest.getIdsFromDaodSources(seed.sourceIds);
        
            // Find all people in the data set for this seed
            // If a chart item contains multiple records, a single seed can have multiple source identifiers
            const seedPeople = this.peopleSearchService.lookupPeople((person: IPerson) => externalIds.includes(person.id));
        
            seedPeople.forEach(seedPerson => {
                // Look up the friends
                const friendIds = new Set(seedPerson.friends);
                const friends = this.peopleSearchService.lookupPeople((friend: IPerson) => friendIds.has(friend.id));
            
                // Add the friends to the response
                friends.map((friend: IPerson) => this.peopleSearchService.transformPerson(friend)).forEach(friend => {
                    // Do not add duplicate entities
                    if (!responseEntities.some(e => e.id === friend.id)) {
                        responseEntities.push(friend);
                    }
                });
            
                // Generate the friendship links
                const friendshipLinks = friends.map(friend => {
                    return {
                        // Construct a unique identifier for the link, given the two end identifiers in the data set
                        id: `${seedPerson.id}-${friend.id}`,
                
                        typeId: "i2.associate",
                
                        // In order to connect the links back to the seed record on the chart,
                        // the incoming seed identifier must be used as one of the ends
                        fromEndId: seed.seedId,
                        toEndId: friend.id,
                
                        linkDirection: LinkDirectionEnum.NONE,
                        properties: {
                            "i2.associationType": "Friend"
                        }
                    };
                });
            
                // Add the links to the result set
                friendshipLinks.forEach(link => {
                    // Do not add duplicate links
                    if (!responseLinks.some(e => e.id === link.id)) {
                        responseLinks.push(link);
                    }
                });
            });
        });
        
        const results = {
            entities: responseEntities,
            links: responseLinks
        };
        
        return results;
    }

    async exampleSeededSearch3Acquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        const seeds = serviceRequest.mappedPayload.seeds;

        // We can assume that all the entities are people, as specified in the config
        const modifiedEntities = seeds.entities.map(seed => {
            return {
                id: seed.seedId,
                typeId: seed.typeId,
                properties: {
                    // Spread the existing values, as we do not want to remove them
                    ...seed.properties,
            
                    // Override or add the middle name property value
                    "i2.middleName": "Returned middle name"
                }
            };
        });
      
        // Return the seeds with the new middle name property value
        const results = { 
            entities: modifiedEntities,
            links: []
        };
        
        return results;
    }

    async exampleSeededSearch4Acquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        const seeds = serviceRequest.mappedPayload.seeds;
        const responseLinks = seeds.links.map(link => {
            return {
                id: link.seedId,
                typeId: link.typeId,
                toEndId: link.toEndId,
                fromEndId: link.fromEndId,
                // Update the link direction
                linkDirection: LinkDirectionEnum.AGAINST
            } as IDaodLink;
        });
      
        const results = {
            entities: [],
            links: responseLinks,
        };
        
        return results;
    }

    async exampleSchemaExtensionAcquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        // Hard-code the data; this example is about the schema and charting scheme fragments
        const tweets = [
            {
                id: "tweet-1",
                user: "user1",
                contents: "My first tweet"
            },
            {
                id: "tweet-2",
                user: "user2",
                contents: "It's hot today"
            }
        ];

        const results = {
            entities: tweets.map(t => {
                return {
                    id: t.id,
                    // Aligns with the additional entity and property types in schema.xml
                    // The server learns about the additions from the "schema" endpoint
                    typeId: "i2.tweet",
                    properties: {
                        "i2.contents": t.contents,
                        "i2.userName": t.user,
                        "i2.length": t.contents.length
                    }
                };
            }),
            links: []
        };
        
        return results;
    }

}