import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import base from '../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFiles, createFile, deleteFile } from '../../services/file-db-service';
import { copyFileToCache, getFilePath } from '../../services/fs-service';
import { FileItem, StoreItem } from '../../models';
import ContextualActionBar from '../../components/ContextualActionBar';
import ModalScreen from '../../components/ModalScreen'; 

import { getStores } from '../../services/store-db-service';

const Stack = createNativeStackNavigator(); 
const StoreStack = createNativeStackNavigator(); 

import FileListingPage from './FileListingPage';
import FileAddPage from './FileAddPage';
import FileEditPage from './FileEditPage';
import FileBrowsePage from './FileBrowsePage';
import ScanFilePage from './../ScanFilePage';

const testFunction = () => {
  console.log('testFunciton');
}

function Root() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem>(null);
  const [scannedImage, setScannedImage] = useState<string>('');
  const navigation = useNavigation();

  
  const editFile = useCallback(async (file) => {
    setSelectedFile(file);
    navigation.navigate('EditFile');
  }, [])

  const selectFile = useCallback(async (file) => {
    setSelectedFile(file);
    navigation.navigate('BrowseFile');
  }, [])
  
  const loadFiles = useCallback(async () => {
    try {
      console.log('stackpage loadFiles()')
      //const db = getDBConnection();
      getFiles((result) => { 
        if(result.length) {
          setFiles(result);
          console.log(files.length);
        } else {
          console.log('No stores found');
        }
      })
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  //Stores

  const loadStores = useCallback(async () => {
    try {
      console.log('FileStackPage loadStores()')
      //const db = getDBConnection();
      getStores((result) => { 
        if(result.length) {
          setStores(result);
          console.log(stores.length);
        } else {
          console.log('No stores found');
        }
      })
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    loadStores();
  }, [loadStores]);
  //Add file

  const addFile = useCallback((file) => {
  
    createFile(file, async (result) => { 
      console.log('addFile response');
      
      loadFiles();
    })

  }, []);

  const updateFileItem = useCallback(async (file) => {
    try {
      /*
      updateFile(file, (result) => { 
        loadFiles();
      });
      */
    } catch (error) {
      console.error(error);
    }
  }, []);
  const copyFileItem = useCallback(async (file) => {
    try {
      createFile(file, (result) => { 
        loadFiles();
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  const removeFile = useCallback(async (file) => {
    try {
      loadFiles();
      const id = file.id;
      //file.map is undefined
      const ids = files.map(x => x.id);
      deleteFile(id, (result) => {
        const index = ids.indexOf(id);
        if(index > -1)
          files.splice(index, 1);
        setFiles(files.slice(0));
      })
    } catch (error) {
      console.error(error);
    }
  }, []);


  const saveScannedFile = useCallback((file) => {
    console.log('saveScannedFile');
    setScannedImage(file);
  }, []);

  const browseFileState = {
    onDelete: removeFile,
    onCopy: copyFileItem,
    onEdit: editFile,
    file: selectedFile
  }
  const scanFileState = {
    onSave: saveScannedFile
  }
  const addFileState = {
    onCreate: addFile,
    stores: stores
  }
  const listingFileState = {
    items: files,
    onSelect: selectFile
  }
  //component={StoreBrowsePage} /
  return (
    <StoreStack.Navigator initialRouteName="FileListing"
    screenOptions={{
      headerShown: true,
      headerMode: 'screen',
      headerTintColor: 'black',
      headerStyle: { backgroundColor: 'white' },
    }}>
      <StoreStack.Screen name="FileListing" options={{
        headerTitle: 'Files'
      }}>
        {props => <FileListingPage {...listingFileState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="AddFile" options={{
        headerTitle: 'Add files'
      }}>
        {props => <FileAddPage {...addFileState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="BrowseFile" options={{
        headerTitle: 'Browse file'
      }}>
        {props => <FileBrowsePage {...browseFileState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="ScanFile" options={{
        headerTitle: 'Scan file'
      }}>
        {props => <ScanFilePage {...scanFileState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="EditFile" options={{
        headerTitle: 'Edit file'
      }}>
        {props => <FileEditPage {...scanFileState} />}
      </StoreStack.Screen>
    </StoreStack.Navigator>
  );
}

interface IStoreStackPageProps {}
const StoreStackPage: React.FunctionComponent<IStoreStackPageProps> = (props) => {
  const navigation = useNavigation();

  useEffect(() => {
    //navigation.navigate('Listing');
  }, []);

  return (
    <>
        <StoreStack.Navigator initialRouteName="Listing"
            screenOptions={{ headerShown: false }}>
            <StoreStack.Screen
              name="Root"
              component={Root}
              options={{
                title: 'Manage stores',
              }}
            />
        </StoreStack.Navigator>
    </>
  );
};
export default StoreStackPage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 0,
    bottom: 36,
  },
})