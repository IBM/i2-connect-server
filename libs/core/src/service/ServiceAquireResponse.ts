import { IDaodResults, IDaodEntity, IDaodLink, IDaodItem, DaodResultsMarshaler } from "./marshalers/DaodResultsMarshaler";
import { ITypeMap } from "../typemap/marshalers/TypeMapMarshaler";
import { ConnectorTypeMapService, PropertyMappingIdTypeEnum } from "../typemap/typemap.service";
import { IDaodResultsDto } from './dto/IDaodResultsDto';
import { IServiceRequestQuery } from './marshalers/ServiceRequestQueryMarshaler';

export interface IConnectorServiceAquireResponse {

    readonly mappedResultsDto: IDaodResultsDto;
    
}

export class ConnectorServiceAquireResponse implements IConnectorServiceAquireResponse {

    constructor(private _mappedResultsDto: IDaodResultsDto) {}

    public get mappedResultsDto(): IDaodResultsDto {
        return this._mappedResultsDto;
    }

    public static createConnectorServiceAquireResponse(
        daodResults: IDaodResults, 
        requestQuery: IServiceRequestQuery,
        typeMap: ITypeMap
    ) : IConnectorServiceAquireResponse {
        
        const mappedDaodResults = this.getMappedResults(daodResults, typeMap, requestQuery.strict);
        const mappedDaodResultsDto = DaodResultsMarshaler.marshalToDto(mappedDaodResults);
        return new ConnectorServiceAquireResponse(mappedDaodResultsDto);
    }   

    /*
    addEntity(id: string, typeId: string, properties: any) {
        const entity: IDaodEntity = {
            id,
            typeId,
            properties
        }
        this.addEntity2(entity);
    }

    addEntity2(entity: IDaodEntity) {
        this._results.entities.push(entity);
    }

    addLink(id: string, typeId: string, properties: any, toEndId: string, fromEndId: string, linkDirection?: LinkDirectionEnum) {
        const link: IDaodLink = {
            id,
            typeId,
            properties,
            toEndId,
            fromEndId,
            linkDirection: linkDirection ? linkDirection : LinkDirectionEnum.NONE
        }
        this.addEntity2(link);
    }

    addLink2(link: IDaodLink) {
        this._results.links.push(link);
    }

    */

    private static getMappedResults(results: IDaodResults, typeMap: ITypeMap, strict: boolean): IDaodResults {
        // clone - so don't update the original
        const resultsCopy = JSON.parse(JSON.stringify(results)) as IDaodResults;
        // map the result items
        resultsCopy.entities = this.mapResultsEntities(typeMap, results.entities, strict);
        const entityIds = resultsCopy.entities.map((item: IDaodEntity) => item.id);
        resultsCopy.links = this.mapResultsLinks(typeMap, results.links, strict, entityIds);
        return resultsCopy;
    }

    private static mapResultsEntities(typeMap: ITypeMap, entities: IDaodEntity[], strict: boolean, entityIds?: any[] ): IDaodEntity[] {
        return this.mapResultsItems(typeMap, entities, true, strict) as IDaodEntity[];
    }

    private static mapResultsLinks(typeMap: ITypeMap, links: IDaodLink[], strict: boolean, entityIds?: any[] ): IDaodLink[] {
        return this.mapResultsItems(typeMap, links, false, strict, entityIds) as IDaodLink[];
    }

    private static mapResultsItems(typeMap: ITypeMap, items: IDaodItem[], isEntity: boolean, strict: boolean, entityIds?: any[] ): IDaodItem[] {
        return items.reduce((mappedItems, item) => {
            const typeMapping = ConnectorTypeMapService.getItemTypeMapping(typeMap, item.typeId);
            if (typeMapping && typeMapping.schemaTypeId) {
                if (!isEntity) {
                    //TODO: add link end checking back at some point - need to pass in seeds though.. below code won't work as is
                    //as an end id may exist within the original seeds.  Also need to account for ids not are not simple strings.
                    /*
                    // for links - check both ends exist (i.e. they haven't been removed due to missing mappings)
                    const fromEndId = entityIds.find(id => id === (item as IDaodLink).fromEndId);
                    const toEndId = entityIds.find(id => id === (item as IDaodLink).toEndId);
                    if (!fromEndId || !toEndId) {
                        ConnectorTypeMapService.strictCheckAndLogging(`Invalid link '${item.id}' has end(s) not present in the data.`, strict);
                    }
                    */
                }
                item.typeId = typeMapping.schemaTypeId;
                item.properties = ConnectorTypeMapService.getMappedProperties(item.properties, typeMapping, 
                    PropertyMappingIdTypeEnum.TYPEMAP_PROPERTY_ID, strict);
                mappedItems.push(item);
            } else {
                ConnectorTypeMapService.strictCheckAndLogging(`No schema mapping exists for item type map '${item.typeId}'`, strict);
            }
            return mappedItems;
        }, []);    
    }

    // TODO: refine to cope with ids that may not be simple strings?
    public static removeDuplicates(result: IDaodResults): IDaodResults {
        let seen = {};
        result.entities = result.entities.filter(item => {
            return seen.hasOwnProperty(item.id.toString()) ? false : (seen[item.id.toString()] = true);
        });
        seen = {};
        result.links = result.links.filter(item => {
            return seen.hasOwnProperty(item.id.toString()) ? false : (seen[item.id.toString()] = true);
        });
        return result;
    }

}