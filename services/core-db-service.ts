import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { Platform } from 'react-native';
import { enablePromise, SQLiteDatabase } from 'react-native-sqlite-storage';
import { StoreItem, ToDoItem } from '../models';
import {Database} from "../database/AsyncExpoSQLite";
import * as SQLite from "expo-sqlite";

export const openDatabase = (dbName: string) => {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabase(dbName);
    return db;
}

export const getDBConnection = (dbName: string) => {
  return openDatabase(dbName);
};

export const clearTable = (db: SQLite.WebSQLDatabase, tableName: string) => {
    console.log('clearTable');
    // create table if not exists
    const query = `DELETE FROM ${tableName};`;
  
    db.transaction((tx) => { tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { console.log(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('clearTable Error: ', error) }
        )
    });
};


export const getTableName = (db: SQLite.WebSQLDatabase, tableName: string, fn: SQLite.SQLStatementCallback) => {
    console.log('getTableName.start');
    const checkQuery = `SELECT name FROM store_data WHERE name='${tableName}';`;

    db.transaction((tx) => {
        tx.executeSql(checkQuery, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('getTableName Error: ', error) }
        )
    });
}


export const getColName = (db: SQLite.WebSQLDatabase, tableName: string, fn: SQLite.SQLStatementCallback) => {
    console.log('getColName.start');
    const query = `PRAGMA table_info('${tableName}')`;

    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            //(_, { rows }) => { console.log('getColName => ');console.log(rows)},
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('getColName Error: ', error) }
        )
    });
}

export const createTable = (db: SQLite.WebSQLDatabase, query: string, fn: SQLite.SQLStatementCallback) => {
    // create table if not exists
    
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('createTable Error ', error) }
            )
        });
};

export const getItems = (db: SQLite.WebSQLDatabase, tableName: string, fn: SQLite.SQLStatementCallback) => {
  try {
    const todoItems: ToDoItem[] = [];
    const query = `SELECT * FROM ${tableName};`;
    
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('getItems Error: ', error) }
        )
    });
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items !!!');
  }
};

export const searchItems = (db: SQLite.WebSQLDatabase, tableName: string, whereQueryObject: object, fn: SQLite.SQLStatementCallback) => {
  try {
    const todoItems: ToDoItem[] = [];
    const whereQuery = createWhereQuery(whereQueryObject);
    const query = `SELECT * FROM ${tableName} WHERE ${whereQuery};`;
    
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('getItems Error: ', error) }
        )
    });
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items !!!');
  }
};

export const createWhereQuery = (whereQuery: object) => {
  try {
    const queryProperties = Object.keys(whereQuery);
    const parsed = queryProperties
      .map(key => `${key} = '${whereQuery[key]}' AND`)
      .join(' ')
      .slice(0, -4);

    //WHERE Country = 'Spain' AND CustomerName LIKE 'G%';
    return parsed;
    
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items !!!');
  }
};



export const saveItems = (db: SQLite.WebSQLDatabase, query: string, fn: SQLite.SQLStatementCallback) => {
    console.log('saveItems.start');

    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('saveItems Error: ', error) }
        )
    });
};

export const deleteItem = (db: SQLite.WebSQLDatabase, tableName: string, id: string, fn: SQLite.SQLStatementCallback) => {
  console.log(id);
  console.log(tableName)
  const query = `DELETE from ${tableName} where id = '${id}'`;
  db.transaction((tx) => {
    tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { fn(_array) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { console.log('deleteItem Error: ', error) }
    )
});

};

export const deleteTable = (db: SQLite.WebSQLDatabase, tableName: string) => {
  const query = `drop table ${tableName}`;

  db.transaction((tx) => { tx.executeSql(query) } );
};
