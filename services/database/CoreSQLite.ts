import { Platform } from 'react-native';  
import * as SQLite from "expo-sqlite";
import uuid from 'react-native-uuid';

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

export const createUpdateQuery = (tableName: string, item) => {
  const queryProperties = Object.keys(item);
  const propertyUpdates = queryProperties
    .filter(x => x != 'id' && x != 'created' )
    .map(x => `${x}='${item[x]}'`)
    .join(',')
  
  const query =
  `UPDATE ${tableName}
    SET ${propertyUpdates}
    WHERE id = '${item.id}'` 
  return query;
};

export const createInsertQuery = (tableName: string, items) => {

  const queryProperties = Object.keys(items[0]);
  const propertyKeys = queryProperties.join(',');
  const propertyUpdates = items
    .map(i => `(${ queryProperties.map(k => "'"+(i[k]||'')+"'").join(',')})`)
    .join(',')
  return `INSERT OR REPLACE INTO ${tableName}(${propertyKeys}) values` + propertyUpdates;
};

export const generateGuid = () => {
  return uuid.v4();
}


export const getDBConnection = (dbName: string) => {
  return openDatabase(dbName);
};

export const clearTable = (db: SQLite.WebSQLDatabase, tableName: string) => {
  return new Promise((resolve, reject) => {
  
    console.log('clearTable');
    // create table if not exists
    const query = `DELETE FROM ${tableName};`;
  
    db.transaction((tx) => { tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { resolve(_array); },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { reject(error) }
      )
    });
  });
};


export const getTableName = (db: SQLite.WebSQLDatabase, tableName: string) => {
  return new Promise((resolve, reject) => {
     
    const checkQuery = `SELECT name FROM store_data WHERE name='${tableName}';`;

    db.transaction((tx) => {
      tx.executeSql(checkQuery, null,
          // success callback which sends two things Transaction object and ResultSet Object
          (_, { rows: { _array } }) => { resolve(_array) },
          // failure callback which sends two things Transaction object and Error
          (txObj, error) => { reject(error) }
      )
    });
  })
}


export const getColName = (db: SQLite.WebSQLDatabase, tableName: string) => {
  return new Promise((resolve, reject) => {
  
    const query = `PRAGMA table_info('${tableName}')`;

    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            //(_, { rows }) => { console.log('getColName => ');console.log(rows)},
            (_, { rows: { _array } }) => { resolve(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { reject(error) }
        )
    });
  })
}

export const createTable = (db: SQLite.WebSQLDatabase, query: string) => {
  return new Promise((resolve, reject) => {
    // create table if not exists
    
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { resolve(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { reject(error) }
            )
        });
  })
};

export const getRows = (db: SQLite.WebSQLDatabase, tableName: string) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName};`;
    db.transaction((tx) => {
      tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { resolve(_array) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { reject(error) }
      )
    });  
  })
};


export const getRow = (db: SQLite.WebSQLDatabase, tableName: string, id: string) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE id = '${id}' ORDER BY ROWID ASC LIMIT 1;`;
    
    db.transaction((tx) => {
      tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { resolve(_array[0]) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { reject(error) }
      )
    });
  })
};

export const executeQuery = (db: SQLite.WebSQLDatabase, query: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { resolve(_array) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { reject(error) }
        )
    });
  });
};

export const searchRows = (db: SQLite.WebSQLDatabase, tableName: string, whereQueryObject: object) => {
  return new Promise((resolve, reject) => {
    const whereQuery = createWhereQuery(whereQueryObject);
    const query = `SELECT * FROM ${tableName} WHERE ${whereQuery};`;
    db.transaction((tx) => {
        tx.executeSql(query, null,
            // success callback which sends two things Transaction object and ResultSet Object
            (_, { rows: { _array } }) => { resolve(_array) },
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => { reject(error) }
        )
    });
  })
};

export const createWhereQuery = (whereQuery: object) => {
  if(whereQuery == null || Object.keys(whereQuery).length == 0) { return 'id NOTNULL'; }
  const queryProperties = Object.keys(whereQuery);
  const parsed = queryProperties
    .map(key => {
      if(typeof(whereQuery[key]) == 'string')
        return `${key} LIKE '%${whereQuery[key]}%' AND`
      return `${key} = '${whereQuery[key]}' AND`
      }
    )
    .join(' ')
    .slice(0, -4);

  return parsed;
};



export const saveRows = (db: SQLite.WebSQLDatabase, query: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { resolve(_array) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { reject(error) }
      )
    });
  })
};

export const deleteRow = (db: SQLite.WebSQLDatabase, tableName: string, id: string) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE from ${tableName} where id = '${id}'`;
    db.transaction((tx) => {
      tx.executeSql(query, null,
        // success callback which sends two things Transaction object and ResultSet Object
        (_, { rows: { _array } }) => { resolve(_array) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { reject(error) }
      )
    });
  })  
};

export const deleteTable = (db: SQLite.WebSQLDatabase, tableName: string) => {
  const query = `drop table ${tableName}`;

  db.transaction((tx) => { tx.executeSql(query) } );
};
