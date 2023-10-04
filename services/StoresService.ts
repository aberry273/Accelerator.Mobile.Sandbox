import DatabaseService from './database/DatabaseService'
import { StoreItem } from '../models';

const tableName = "storesDatabase";
const dbName = 'stores_data.db';

// use data mapping for schema to enable ordering of properties when inserting rows
const schema = [
    { key: 'id', type: 'TEXT', nullable: false },
    { key: 'created', type: 'TEXT', nullable: false },
    { key: 'name', type: 'TEXT', nullable: false },
    { key: 'description', type: 'TEXT', nullable: true },
    { key: 'tags', type: 'TEXT', nullable: true },
    { key: 'category', type: 'TEXT', nullable: true },
    { key: 'lat', type: 'REAL', nullable: true },
    { key: 'lng', type: 'REAL', nullable: true }
]
const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(
    ${schema.map(x => `${x.key} ${x.type} ${(x.nullable ? '' : 'NOT NULL')}`).join(',')}
);`;

const _storesDataService = new DatabaseService(dbName, tableName, createTableQuery)

export default class StoresService<StoreItem> {

    static _instance = null;
    _items = [];
    
    /**
     * @returns {StoresService}
     */
    static Instance() {
        if (StoresService._instance == null) {
            StoresService._instance = new StoresService();
        }

        return this._instance;
    }

    async GetAll() {
        return await _storesDataService.GetAll();
    }

    GetKeyValues(stores: Array<StoreItem>) {
        return stores.map(x => { 
            return {
                key: x.id,
                value: x.name
            }
        })
    }

    async Get(id: string) {
        return await _storesDataService.Get(id);
    }

    MapItemSchemaProperties(item: StoreItem) {
        let obj = {};
        schema.map(prop => { obj[prop.key] = item[prop.key]; });
        return obj;
    }
    
    async Create(item: any) {
        const obj = this.MapItemSchemaProperties(item);
        return await _storesDataService.Create(obj);
    }

    async Copy(id: string) {
        const oldId = id;
        const newId = _storesDataService.GenerateGuid();
        const item = await this.Get(id); 
        item.id = newId; 
        return await this.Create(item);
    }

    async CreateMany(items: []) {
        let objs = [];
        items.map(item => { 
            const obj = this.MapItemSchemaProperties(item);
            objs.push(obj);
        });
        return await _storesDataService.CreateMany(items);
    }

    async Delete(id: string) {
        await _storesDataService.Delete(id);
        //delete files
    }

    async Search(query: object) {
        return await _storesDataService.Search(query);
    }

    async Update(item: StoreItem) {
        const obj = this.MapItemSchemaProperties(item);
        return await _storesDataService.Update(obj);
    }

    async DeleteTable() {
        return await _storesDataService.DeleteTable();
    }
}