import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import base from '../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StoreItem } from '../../models';
import ContextualActionBar from '../../components/ContextualActionBar';
import ModalScreen from '../../components/ModalScreen'; 
import StoresService from '../../services/StoresService';

const Stack = createNativeStackNavigator(); 
const StoreStack = createNativeStackNavigator(); 
const _storesService = StoresService.Instance();

import StoreListingPage from './StoreListingPage';
import StoreAddPage from './StoreAddPage';
import StoreEditPage from './StoreEditPage';
import StoreBrowsePage from './StoreBrowsePage';
import ScanFilePage from './../ScanFilePage';

const testFunction = () => {
  console.log('testFunciton');
}

function Root() {
  const [queryText, setQueryText] = useState('');
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreItem>(null);
  const navigation = useNavigation();

  
  const selectStore = useCallback(async (store) => {
    setSelectedStore(store);
    navigation.push('BrowseStore');
  }, [])
  
  const loadStores = useCallback(async () => {
    try {
      console.log('stackpage loadStores()')

      //const db = getDBConnection();
      const results = await _storesService.GetAll();
      setStores(results);
  
    } catch (error) {
      console.error(error);
    }
  }, []);

  const filterStores = useCallback(async (queryText) => {
    try {
      console.log('stackpage filterStores()')
      //const db = getDBConnection();
      const results = await _storesService.Search({ name: queryText });
      setStores(results);
      setQueryText(queryText);
    
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const addStore = useCallback(async (store) => {
    await _storesService.Create(store);
    loadStores();
  }, []);

  const editStore = useCallback(async (store) => {
    try {
      await _storesService.Update(store);
      loadStores();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const copyStore = useCallback(async (store) => {
    try {
      await _storesService.Copy(store.id);
      loadStores();
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  const removeStore = useCallback(async (store) => {
    try {

      await _storesService.Delete(store.id);
      loadStores();
    } catch (error) {
      console.error(error);
    }
  }, []);


  const saveFile = useCallback(async (file) => {
    navigation.goBack('Stores');
    //console.log(selectedStore);
  }, []);

  const browseStoreState = {
    onDelete: removeStore,
    onCopy: copyStore,
    //onEdit: updateStore,
    store: selectedStore,
    id: selectedStore != null ? selectedStore.id : null,
  } 
  const addStoreState = {
    onCreate: addStore
  }
  const editStoreState = {
    data: {},
    onUpdate: editStore
  }
  const listingStoreState = {
    items: stores,
    queryText: queryText,
    onSelect: selectStore,
    onSearch: filterStores
  }
  //component={StoreBrowsePage} /
  return (
    <StoreStack.Navigator initialRouteName="Listing"
    screenOptions={{
      headerShown: true,
      headerMode: 'screen',
      headerTintColor: 'black',
      headerStyle: { backgroundColor: 'white' },
    }}>
      <StoreStack.Screen name="Listing" options={{
        headerTitle: 'Stores'
      }}>
        {props => <StoreListingPage {...listingStoreState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="AddStore" options={{
        headerTitle: 'Add store'
      }}>
        {props => <StoreAddPage {...addStoreState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="BrowseStore" options={{
        headerTitle: 'Browse Store'
      }}>
        {props => <StoreBrowsePage {...browseStoreState} />}
      </StoreStack.Screen>
      <StoreStack.Screen name="EditStore" options={{
        headerTitle: 'Edit Store'
      }}>
        {props => <StoreEditPage {...editStoreState} />}
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