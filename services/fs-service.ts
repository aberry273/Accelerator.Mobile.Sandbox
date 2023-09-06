import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { enablePromise, SQLiteDatabase } from 'react-native-sqlite-storage';
import { FileItem, ToDoItem } from '../models';
import { getDBConnection, getItems, saveItems, createTable, getTableName, getColName, deleteTable, clearTable, deleteItem } from './core-db-service';
import * as SQLite from "expo-sqlite";
import uuid from 'react-native-uuid';

import * as FileSystem from 'expo-file-system';

const rootDir = FileSystem.cacheDirectory + 'scansave_files/';
const localFileUri = (fileId: string) => rootDir + `${fileId}.jpg`;
//const serverFileUrl = (fileId: string) => `https://media1.giphy.com/media/${fileId}/200.gif`;
const tempFileUrl = (filePath: string) => filePath;

//const gifFileUri = (gifId: string) => gifDir + `gif_${gifId}_200.gif`;
//const gifUrl = (gifId: string) => `https://media1.giphy.com/media/${gifId}/200.gif`;

// Checks if gif directory exists. If not, creates it
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(rootDir);
  if (!dirInfo.exists) {
    console.log("Directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(rootDir, { intermediates: true });
  }
}

// Downloads all gifs specified as array of IDs
export async function addMultipleFiles(fileIds: string[]) {
  try {
    await ensureDirExists();

    console.log('Downloading', fileIds.length, 'files...');

    await Promise.all(fileIds.map(id => FileSystem.downloadAsync(tempFileUrl(id), localFileUri(id))));
  } catch (e) {
    console.error("Couldn't download files:", e);
  }
}

// Downloads all gifs specified as array of IDs
export async function copyFileToCache(tempPath: string, id: string) {
  try {
    await ensureDirExists();

    console.log('Downloading', tempPath, ' to: ', localFileUri(id));

    await FileSystem.copyAsync({ "from": tempPath, "to": localFileUri(id) } );
  } catch (e) {
    console.error("Couldn't cop file:", e);
  }
}


// Downloads all gifs specified as array of IDs
export function getFilePath(id: string) {
  try {
    return localFileUri(id)
  } catch (e) {
    console.error("Couldn't cop file:", e);
  }
}


// Returns URI to our local gif file
// If our gif doesn't exist locally, it downloads it
export async function getSingleFile(fileId: string) {
  await ensureDirExists();

  const fileUri = tempFileUrl(fileId);
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    console.log("File isn't cached locally. Downloading...");
    await FileSystem.downloadAsync(tempFileUrl(fileId), fileUri);
  }

  return fileUri;
}

// Exports shareable URI - it can be shared outside your app
export async function getFileContentUri(fileId: string) {
  return FileSystem.getContentUriAsync(await getSingleFile(fileId));
}

// Deletes whole giphy directory with all its content
export async function deleteAllFiles() {
  console.log('Deleting all files...');
  await FileSystem.deleteAsync(rootDir);
}
 