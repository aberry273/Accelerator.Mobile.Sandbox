import { getDBConnection, generateGuid, getRows, getRow, searchRows, executeQuery, createUpdateQuery, createInsertQuery, saveRows, createTable, getTableName, getColName, deleteTable, clearTable, deleteRow } from './CoreSQLite';
import * as SQLite from "expo-sqlite";
import uuid from 'react-native-uuid';
  

export default class DatabaseService {

  _dbName = '';
  _tableName = '';
  _createTableQuery = '';

  constructor(dbName, tableName, createTableQuery) {
    this._dbName = dbName;
    this._tableName = tableName;
    this._createTableQuery = createTableQuery;
  }

  async GetAll() {
      const db = getDBConnection(this._dbName);
      await createTable(db, this._createTableQuery);
      return await getRows(db, this._tableName);
  }

  async Get(id: string) {
    const db = getDBConnection(this._dbName);
    return await getRow(db, this._tableName, id);
  }

  GenerateGuid() {
    return generateGuid()
  }

  SetSystemProperties(item: any) {
    item.id = item.id || generateGuid();
    item.created = new Date().toISOString();
    return item;
  }

  async Create(item: any) {
      const db = getDBConnection(this._dbName);
      await createTable(db, this._createTableQuery);    
      // Ensure ID, Created is correct
      const items = [this.SetSystemProperties(item)];
      const query = createInsertQuery(this._tableName, items);
      return await saveRows(db, query);
  }

  async CreateMany(items: []) {
      const db = getDBConnection(this._dbName);
      await createTable(db, this._createTableQuery);
      // Ensure ID, Created is correct
      const processedItems = items.map(x => this.SetSystemProperties(x));
      const query = createInsertQuery(this._tableName, processedItems);
      return await saveRows(db, query);
  }

  async Delete(id: string) {
      const db = getDBConnection(this._dbName);
      return await deleteRow(db, this._tableName, id);
  }

  async Search(query: object) {
      const db = getDBConnection(this._dbName);
      return await searchRows(db, this._tableName, query);
  }

  async Update(item) {
      const db = getDBConnection(this._dbName);
      const query = createUpdateQuery(this._tableName, item);
      return await executeQuery(db, query);
  }

  async DeleteTable() {
      const db = getDBConnection(this._dbName);
      return await deleteTable(db, this._tableName);
  }
}