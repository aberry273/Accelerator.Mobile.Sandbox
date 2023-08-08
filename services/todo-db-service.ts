import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { Platform } from 'react-native';
import { enablePromise, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ToDoItem } from '../models';
import {Database} from "../database/AsyncExpoSQLite";
import * as SQLite from "expo-sqlite";

const tableName = 'todoData';
const dbName = 'todo_data.db';

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

export const getDBConnection = () => {
  return openDatabase(dbName);
};

export const clearTable = (db: SQLite.WebSQLDatabase) => {
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


export const getTableName = (db: SQLite.WebSQLDatabase, fn: SQLite.SQLStatementCallback) => {
    console.log('getTableName.start');
    const checkQuery = `SELECT name FROM sqlite_master WHERE name='${tableName}';`;

    db.transaction((tx) => {
        tx.executeSql(checkQuery, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('getTableName Error: ', error) }
        )
    });
}


export const getColName = (db: SQLite.WebSQLDatabase, fn: SQLite.SQLStatementCallback) => {
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

export const createTable = (db: SQLite.WebSQLDatabase, fn: SQLite.SQLStatementCallback) => {
    console.log('createTable.start');
   
    // create table if not exists
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id TEXT NOT NULL,
        value TEXT NOT NULL
    );`;

    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('createTable Error ', error) }
            )
        });
};

export const getTodoItems = (db: SQLite.WebSQLDatabase, fn: SQLite.SQLStatementCallback) => {
  try {
    console.log('getTodoItems.start');

    const todoItems: ToDoItem[] = [];
    const query = `SELECT * FROM ${tableName};`;
    
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('getTodoItems Error: ', error) }
        )
    });
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveTodoItems = (db: SQLite.WebSQLDatabase, todoItems: ToDoItem[], fn: SQLite.SQLStatementCallback) => {
    console.log('saveTodoItems.start');
    console.log(todoItems);

    const query =
        `INSERT OR REPLACE INTO ${tableName}(id, value) values` +
        todoItems.map(i => `('${i.id}', '${i.value}')`).join(',');
        
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { fn(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { console.log('saveTodoItems Error: ', error) }
        )
    });
};

export const deleteTodoItem = (db: SQLite.WebSQLDatabase, id: string, fn: SQLite.SQLStatementCallback) => {
  const query = `DELETE from ${tableName} where id = '${id}'`;
  db.transaction((tx) => {
    tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { fn(_array) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { console.log('deleteTodoItem Error: ', error) }
    )
});

};

export const deleteTable = (db: SQLite.WebSQLDatabase) => {
  const query = `drop table ${tableName}`;

  db.transaction((tx) => { tx.executeSql(query) } );
};
