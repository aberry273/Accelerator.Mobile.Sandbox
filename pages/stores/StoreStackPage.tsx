import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import base from '../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStores, createStore, deleteStore } from '../../services/store-service';
import { StoreItem } from '../../models';
import ContextualActionBar from '../../components/ContextualActionBar';
import ModalScreen from '../../components/ModalScreen'; 


const Stack = createNativeStackNavigator(); 
const StoreStack = createNativeStackNavigator(); 

import StoreListingPage from './StoreListingPage';
import StoreAddPage from './StoreAddPage';
import StoreBrowsePage from './StoreBrowsePage';
import ScanFilePage from './../ScanFilePage';

const testFunction = () => {
  console.log('testFunciton');
}

function Root() {
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

  const addStore = useCallback((store) => {
    console.log(store);
    createStore(store, (result) => { 
      console.log('addStore response');
     
      loadStores();
    })

  }, []);

  const copyStore = useCallback(async (store) => {
    try {
      addStore(store, (result) => {
        loadStores(); 
      })
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  const removeStore = useCallback(async (store) => {
    try {
      loadStores();
      const id = store.id;
      const ids = stores.map(x => x.id);
      deleteStore(id, (result) => {
        const index = ids.indexOf(id);
        if(index > -1)
          stores.splice(index, 1);
        setStores(stores.slice(0));
      })
    } catch (error) {
      console.error(error);
    }
  }, []);


  const browseStoreState = {
    onDelete: removeStore,
    onCopy: copyStore,
    store: selectedStore
  }
  const addStoreState = {
    onCreate: addStore
  }
  const listingStoreState = {
    items: stores,
    onSelect: selectStore
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
      <StoreStack.Screen name="ScanFile" options={{
        headerTitle: 'Scan File'
      }}>
        {props => <ScanFilePage {...browseStoreState} />}
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