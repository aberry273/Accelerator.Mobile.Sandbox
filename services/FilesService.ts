import DatabaseService from './database/DatabaseService'
import FileSystemCacheService from './FileSystemCacheService'
import { FileItem } from '../models';

const fileSystemFolder = "scansave_files";
const tableName = "filesDatabase";
const dbName = 'files_data.db';

// use data mapping for schema to enable ordering of properties when inserting rows
const schema = [
    { key: 'id', type: 'TEXT', nullable: false },
    { key: 'file', type: 'TEXT', nullable: false },
    { key: 'created', type: 'TEXT', nullable: false },
    { key: 'storeId', type: 'TEXT', nullable: false },
    { key: 'name', type: 'TEXT', nullable: false },
    { key: 'description', type: 'TEXT', nullable: true },
    { key: 'tags', type: 'TEXT', nullable: true },
    { key: 'category', type: 'TEXT', nullable: true }
]
const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(
    ${schema.map(x => `${x.key} ${x.type} ${(x.nullable ? '' : 'NOT NULL')}`).join(',')}
);`;

const _filesDataService = new DatabaseService(dbName, tableName, createTableQuery)
const _fileSystemCache = new FileSystemCacheService(fileSystemFolder);

export default class FilesService<FileItem> {

    static _instance = null;
    _items = [];
    
    /**
     * @returns {FilesService}
     */
    static Instance() {
        if (FilesService._instance == null) {
            FilesService._instance = new FilesService();
        }

        return this._instance;
    }

    async GetAll() {
        return await _filesDataService.GetAll();
    }

    async Get(id: string) {
        return await _filesDataService.Get(id);
    }

    GetCachedImage(id: string) {
        return _fileSystemCache.GetFilePath(id);
    }

    MapItemSchemaProperties(item: FileItem) {
        let obj = {};
        schema.map(prop => { obj[prop.key] = item[prop.key]; });
        return obj;
    }
    
    async Create(item: any) {
        const obj = this.MapItemSchemaProperties(item);
        return await _filesDataService.Create(obj);
    }

    async CreateWithFile(item: any, tempFile: string) {
        await _fileSystemCache.AddFiletoCache(tempFile, item.id);
        const obj = this.MapItemSchemaProperties(item);
        return await this.Create(obj);
    }

    async Copy(id: string) {
        const oldId = id;
        const newId = _filesDataService.GenerateGuid();
        const item = await this.Get(id); 
        item.id = newId; 
        
        const cachedFile = this.GetCachedImage(oldId); 
        await _fileSystemCache.AddFiletoCache(cachedFile, newId);
        
        return await this.Create(item);
    }

    async CreateMany(items: []) {
        let objs = [];
        items.map(item => { 
            const obj = this.MapItemSchemaProperties(item);
            objs.push(obj);
        });
        return await _filesDataService.CreateMany(items);
    }

    async Delete(id: string) {
        await _filesDataService.Delete(id);
        await _fileSystemCache.DeleteFile(id);
    }

    async Search(query: object) {
        return await _filesDataService.Search(query);
    }

    async Update(item: FileItem) {
        const obj = this.MapItemSchemaProperties(item);
        return await _filesDataService.Update(obj);
    }

    async DeleteTable() {
        return await _filesDataService.DeleteTable();
    }

    // Images
    async AddImageToCache(filePath: string, id: string) {
        await _fileSystemCache.AddFiletoCache(filePath, id)
    }
}