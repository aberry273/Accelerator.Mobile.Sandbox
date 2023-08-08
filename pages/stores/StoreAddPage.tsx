import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import { createStore, getStores } from '../../services/store-service';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import ModalScreen from '../../components/ModalScreen';

import Constants from 'expo-constants';

import { AclForm } from '../../components/forms';

import AddFriendForm from '../../screens/AddFriendForm';

interface IStoreAddPageProps {
  onCreate: () => void;
}

const tempFormData = 
{
  fields: [
    {
      component: 'TextField',
      data: {
        label: 'Name',
        name: 'Name',
        value: null,
        placeholder: 'Store name..'
      },
      options: {
        mode: 'flat'
      }
    },
    {
      component: 'TextField',
      data: {
        label: 'Description',
        name: 'Description',
        value: null,
        placeholder: 'Description'
      },
      options: {
        multiline: true,
        mode: 'flat'
      }
    },
    {
      component: 'LocationToggleField',
      data: {
        label: 'Add location',
        name: 'Location',
        value: null
      },
      options: {
        mode: 'flat',
        style: 'padding: 8px'
      },
    },
    /*
    {
      component: 'SwitchField',
      data: {
        label: 'Link my location',
        name: 'LinkLocation',
        value: false
      },
      options: {
        mode: 'flat',
        style: 'padding: 8px'
      },
      change: async (field, data) => {
        console.log('change() of SwitchField '+data)
      }
    },*/
    {
      component: 'SelectField',
      data: {
        label: 'Select',
        name: 'Type',
        placeholder: 'Bike store..'
      },
      options: {
        hide: true
      }
    },
    {
      component: 'ChipField',
      data: {
        label: 'Add tags',
        name: 'Tags',
        placeholder: 'insurance'
      },
      options: {
        hide: false
      }
    }
  ]
};

/*
1. Location Field: Custom UI to have a switch pull back location data and store it in a text field
2. Switch and replace field: Custom UI & logic to update formState of a particular field, requires formState to change
3. Form to handle updates of formfield content changes on field change, always emit updates to parent form, parent will update state accordingly
3.1. However if we a passing down logic to child fields this always causes havor
*/

const StoreAddPage: React.FunctionComponent<IStoreAddPageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');

  const [formState, setFormState] = useState(null);
 
  useEffect(() => {
    setFormState(tempFormData);
  });

  const addStore = useCallback((data) => {
    console.log('storeAddPage.addStore()');
    if(data.location != null && data.location.coords != null) {
      data.lat = data.location.coords.latitude;
      data.lng = data.location.coords.longitude;
    }
    if(data.tags != null) {
      const tags = data.tags.join(',');
      data.tags = tags.substring(0, tags.length - 1);;
    }
    console.log(JSON.parse(JSON.stringify(data)));
    props.onCreate(data);
    navigation.goBack();
  }, []);
  
  const closeHeader = useCallback(() => {
    setCabIsOpen(false);
    setSelectedItemName('');
  }, []); 
  
  useEffect(() => {
    if (cabIsOpen) {
      navigation.setOptions({
        // have to use props: any since that's the type signature
        // from react-navigation...
        header: (props: any) => (<ContextualActionBar
            {...props}
            title={selectedItemName}
            close={closeHeader}
          />),
      });
    } else {
      navigation.setOptions({header: undefined});
    }
  }, [cabIsOpen]);

  return ( 
    <AclForm 
      submit={(data) => addStore(data)}
      data={formState}
      options={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-center',
        margin: 8
      }}
      />
       
  );
};
export default StoreAddPage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 0,
    bottom: 36,
  },
})