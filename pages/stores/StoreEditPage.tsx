import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import ModalScreen from '../../components/ModalScreen';

import Constants from 'expo-constants';

import { AclForm } from '../../components/forms';

import AddFriendForm from '../../screens/AddFriendForm';


let tempFormData = 
{
  fields: [

    {
      component: 'TextField',
      data: {
        label: 'id',
        name: 'id',
        value: null,
        placeholder: 'Store name..'
      },
      options: {
        mode: 'flat',
        hide: true
      }
    },
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
        label: 'Category',
        name: 'Category',
        placeholder: 'Shopping',
        items: [
          {
            key: 1,
            value: 'Shopping'
          },
          {
            key: 2,
            value: 'Services'
          },
          {
            key: 3,
            value: 'Health'
          },
        ]
      },
      options: {
        hide: false
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
interface IStoreEditPageProps {
  onUpdate: () => void;
}

/*
1. Location Field: Custom UI to have a switch pull back location data and store it in a text field
2. Switch and replace field: Custom UI & logic to update formState of a particular field, requires formState to change
3. Form to handle updates of formfield content changes on field change, always emit updates to parent form, parent will update state accordingly
3.1. However if we a passing down logic to child fields this always causes havor
*/

const StoreEditPage: React.FunctionComponent<IStoreEditPageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');

  const [formState, setFormState] = useState(null);
  const route = useRoute();
 
  useEffect(() => {
    for(var i = 0; i < tempFormData.fields.length; i++)
    {
      const field = tempFormData.fields[i];
      const fieldName = field.data.name.toLowerCase();
      const value = route.params[fieldName];
      
      if (value !== 'undefined') {
        tempFormData.fields[i].data.value = route.params[fieldName]; 
      }
    }
    setFormState(tempFormData);
  });

  const updateStore = useCallback((data) => {
    if(data.location != null && data.location.coords != null) {
      data.lat = data.location.coords.latitude;
      data.lng = data.location.coords.longitude;
    }
    if(data.tags != null) {
      const tags = data.tags.join(',');
      data.tags = tags[tags.length - 1] == ',' ? tags.substring(0, tags.length - 1) : tags;
    }
    props.onUpdate(data);
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
      submit={(data) => updateStore(data)}
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
export default StoreEditPage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 0,
    bottom: 36,
  },
})