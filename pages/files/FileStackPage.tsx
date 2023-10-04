import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import base from '../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoresService from '../../services/StoresService';
import FilesService from '../../services/FilesService';
import { FileItem, StoreItem } from '../../models';
import ContextualActionBar from '../../components/ContextualActionBar';
import ModalScreen from '../../components/ModalScreen'; 

const Stack = createNativeStackNavigator(); 
const StoreStack = createNativeStackNavigator(); 
const _filesService = FilesService.Instance();
const _storesService = StoresService.Instance();

import FileListingPage from './FileListingPage';
import FileAddPage from './FileAddPage';
import FileEditPage from './FileEditPage';
import FileBrowsePage from './FileBrowsePage';
import ScanFilePage from './../ScanFilePage';

function Root() {
  const [queryText, setQueryText] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [storeKVs, setStoreKVs] = useState<StoreItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem>(null);
  const [scannedImage, setScannedImage] = useState<string>('');
  const navigation = useNavigation();

  const updateFile = useCallback(async (file) => {
    try {
      await _filesService.Update(file);
      loadFiles();

      setSelectedFile(file);
      navigation.goBack();
      //setSelectedFile(file);
      //navigation.navigate('BrowseFile');
    } catch (error) {
      console.error(error);
    }
  }, []);

  const openEditFile = useCallback(async (file) => {
    navigation.push('EditFile', file);
  }, [])

  const selectFile = useCallback(async (file) => {
    setSelectedFile(file);
    navigation.navigate('BrowseFile');
  }, [])
  
  const loadFiles = useCallback(async () => {
    try {
      const filesAsync = await _filesService.GetAll();
      setFiles(filesAsync);
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);


  const filterFiles = useCallback(async (queryText) => {
    try {
      console.log('stackpage filterFiles()')
      //const db = getDBConnection();
      const results = await _filesService.Search({ name: queryText });
      setFiles(results);
      setQueryText(queryText);
    } catch (error) {
      console.error(error);
    }
  }, []);
  //Stores

  const loadStores = useCallback(async () => {
    try {
      console.log('FileStackPage loadStores()')
      //const db = getDBConnection();
      const stores = await _storesService.GetAll();
      const storeKV = StoresService.Instance().GetKeyValues(stores)
      setStoreKVs(storeKV);
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    loadStores();
  }, [loadStores]);
  //Add file

  const addFile = useCallback(async (file) => {
    try {
      await _filesService.CreateWithFile(file, file.tempFile);
      loadFiles();
    } catch (error) {
      console.error(error);
    }
  }, []);
 
  const copyFile = useCallback(async (id) => {
    try {
      await _filesService.Copy(id);
      loadFiles();
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  const removeFile = useCallback(async (id) => {
    try {
      if(id == null) return;
      await _filesService.Delete(id);
      loadFiles();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const browseFileState = {
    onDelete: removeFile,
    onCopy: copyFile,
    onEdit: openEditFile,
    file: selectedFile,
    id: selectedFile != null ? selectedFile.id : null,
    name: selectedFile != null ? selectedFile.name : null
  }
  const editFileState = {
    data: {},
    id: selectedFile != null ? selectedFile.id : null,
    onUpdate: updateFile,
    stores: storeKVs
  }
  const addFileState = {
    onCreate: addFile,
    stores: storeKVs
  }
  const listingFileState = {
    items: files,
    queryText: queryText,
    onSelect: selectFile,
    onSearch: filterFiles
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
      <StoreStack.Screen name="EditFile" options={{
        headerTitle: 'Edit file'
      }}>
        {props => <FileEditPage {...editFileState} />}
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