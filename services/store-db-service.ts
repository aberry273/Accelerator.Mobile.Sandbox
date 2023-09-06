import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { Platform } from 'react-native';
import { enablePromise, SQLiteDatabase } from 'react-native-sqlite-storage';
import { StoreItem, ToDoItem } from '../models';
import { getDBConnection, getItems, saveItems, createTable, getTableName, getColName, deleteTable, clearTable, deleteItem } from './core-db-service';
import * as SQLite from "expo-sqlite";
import uuid from 'react-native-uuid';

const tableName = "storesDatabase";
const dbName = 'stores_data.db';

const schemaQuery = `CREATE TABLE IF NOT EXISTS ${tableName}(
  id TEXT NOT NULL,
  created TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT,
  category TEXT,
  lat REAL,
  lng REAL
);`;

const createInsertQuery = (items) => {
  const query =
  `INSERT OR REPLACE INTO ${tableName}(id, created, name, description, category, lat, lng, tags) values` +
    items.map(i => `('${i.id}','${i.created}', '${i.name}', '${i.description}', '${i.category}','${i.lat}', '${i.lng}', '${i.tags}')`).join(',');
  return query;
};

const createStore = (item, fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);
    createTable(db, schemaQuery, (result) => {  });
    
    item.id = uuid.v4();
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

const deleteStore = (storeId, fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);

    deleteItem(db, tableName, storeId, fn);
    
  } catch (error) {
    console.error(error);
  }

};

const getStores = (fn: SQLite.SQLStatementCallback) => {
  try {
    const db = getDBConnection(dbName);
    createTable(db, schemaQuery, (result) => { });

    return getItems(db, tableName, fn);
  } catch (error) {
    console.error(error);
  }
};

const deleteStoreTable = (fn: SQLite.SQLStatementCallback) => {
  try {
    console.log('deleteStoreTable')
    const db = getDBConnection(dbName);
    
    return deleteTable(db, tableName);
  } catch (error) {
    console.error(error);
  }
};

export {
  createStore, getStores, deleteStore, deleteStoreTable
}