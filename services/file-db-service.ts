import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { enablePromise, SQLiteDatabase } from 'react-native-sqlite-storage';
import { FileItem, ToDoItem } from '../models';
import { getDBConnection, getItems, searchItems, saveItems, createTable, getTableName, getColName, deleteTable, clearTable, deleteItem } from './core-db-service';
import * as SQLite from "expo-sqlite";
import uuid from 'react-native-uuid';


const tableName = "filesDatabase";
const dbName = 'files_data.db';

const schemaQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(
  id TEXT NOT NULL,
  file TEXT NOT NULL,
  created TEXT NOT NULL,
  storeId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT,
  category TEXT
);`;

const createInsertQuery = (items) => {
  const query =
  `INSERT OR REPLACE INTO ${tableName}(id, created, file, name, description, category, storeId, tags) values` +
    items.map(i => `('${i.id}','${i.created}', '${i.file}', '${i.name}', '${i.description}', '${i.category}','${i.storeId}', '${i.tags}')`).join(',');
  return query;
};

const generateGuid = () => {
  return uuid.v4();
}

const createFile = (item, fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);
    createTable(db, schemaQuery, (result) => {  });
    
    item.id = item.id || uuid.v4();
    item.created = new Date().toISOString();

    /*
    const newItem = {
      id: uuid.v4(),
      created: new Date().toISOString(),
      name: item.name,
      lat: item.lat,
      lng: item.lng,
      tags: item.tags,
    };
    */
    const items = [item];
    const query = createInsertQuery(items);
    saveItems(db, query, fn);
  } catch (error) {
    console.error(error);
  }
};

const deleteFile = (fileId, fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);

    deleteItem(db, tableName, fileId, fn);
    
  } catch (error) {
    console.error(error);
  }

};

const searchFiles = (query: object, fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);
    createTable(db, schemaQuery, (result) => { });
    
    const query = createWhereQuery();

    return getItemsWhere(db, tableName, fn);
  } catch (error) {
    console.error(error);
  }
};
const getFiles = (fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);
    createTable(db, schemaQuery, (result) => { });

    return getItems(db, tableName, fn);
  } catch (error) {
    console.error(error);
  }
};

const deleteFileTable = (fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);
    
    return deleteTable(db, tableName);
  } catch (error) {
    console.error(error);
  }
};

export {
  createFile, getFiles, searchFiles, deleteFile, deleteFileTable, generateGuid
}