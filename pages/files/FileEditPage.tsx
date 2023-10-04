import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import { getSingleFile, copyFileToCache, getFilePath } from '../../services/fs-service'; 
import base from '../../styles/base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import FilesService from '../../services/FilesService';
import StoresService from '../../services/StoresService';

import Constants from 'expo-constants';

const StoreStack = createNativeStackNavigator(); 

import { AclForm } from '../../components/forms';

import AddFriendForm from '../../screens/AddFriendForm';
import ScanFilePage from './../ScanFilePage';

interface IFileEditPageProps {
  onCreate: () => void;
  id: string,
  stores: []
}

const tempFormData = 
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
        name: 'name',
        value: null,
        placeholder: 'File name..'
      },
      options: {
        mode: 'flat'
      }
    },
    {
      component: 'TextField',
      data: {
        label: 'Description',
        name: 'description',
        value: null,
        placeholder: 'Description'
      },
      options: {
        multiline: true,
        mode: 'flat'
      }
    },
    {
      component: 'SelectField',
      data: {
        label: 'Category',
        name: 'category',
        placeholder: 'Shopping',
        items: [
          {
            key: 'Shopping',
            value: 'Shopping'
          },
          {
            key: 'Services',
            value: 'Services'
          },
          {
            key: 'Health',
            value: 'Health'
          },
        ]
      },
      options: {
        hide: false
      }
    },
    {
      component: 'SelectField',
      data: {
        label: 'Store',
        name: 'storeId',
        placeholder: 'Stores',
        itemNameKey: 'name'
      },
      options: {
        hide: false
      }
    },
    {
      component: 'ChipField',
      data: {
        label: 'Add tags',
        name: 'tags',
        placeholder: 'insurance'
      },
      options: {
        hide: false
      }
    },
    {
      component: 'ImageField',
      data: {
        label: 'Image',
        name: 'file',
        placeholder: 'File',
        itemNameKey: 'file'
      },
      options: {
        hide: false
      }
    },
  ]
};

/*
1. Location Field: Custom UI to have a switch pull back location data and store it in a text field
2. Switch and replace field: Custom UI & logic to update formState of a particular field, requires formState to change
3. Form to handle updates of formfield content changes on field change, always emit updates to parent form, parent will update state accordingly
3.1. However if we a passing down logic to child fields this always causes havor
*/

const FileEditPage: React.FunctionComponent<IFileEditPageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [showParentHeader, setShowParentHeader] = useState(false);

  const [formState, setFormState] = useState(null);
  const route = useRoute();

  // On mount
  useEffect(() => {
    //Async wrapper
    (async () => {
      if(props.id == null) return;
      const result = await FilesService.Instance().Get(props.id);
      console.log(result);
      updateFormFields(result);
    })();

    //unmount function
    return () => {};
  }, [props]);

  // Redirect to parent page
  const saveFile = useCallback((file) => {
    navigation.navigate('Files');
  }, []);

  const scanFileState = {
    onSave: saveFile
  }
 
  const updateFormFields = useCallback((item) => {
    //Set item data
    if(item != null) {
      for(var i = 0; i < tempFormData.fields.length; i++)
      {
        const field = tempFormData.fields[i];
        const fieldName = field.data.name;
        const value = item[fieldName];
        if (value !== 'undefined') {
          tempFormData.fields[i].data.value = item[fieldName]; 
        }
        // Set stores KV
        if(fieldName == 'storeId') {
          tempFormData.fields[i].data.items = props.stores; 
        }
      }
    }
    setFormState(tempFormData);
  }, [props])

  const updateFile = useCallback((data) => {
    if (data.tags != null && data.tags !== "") {
      const tags = data.tags.join(',');
      //Remove final ',' if appended at the end
      data.tags = tags.endsWith(',') ? tags.substring(0, tags.length - 1) : tags;
    }
    props.onUpdate(data);
    //navigation.navigate('BrowseFile', data);
//    navigation.goBack(data);
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
    <StoreStack.Navigator initialRouteName="EditDetails"
    screenOptions={{
      headerShown: false
    }}>
      <StoreStack.Screen name="EditDetails" options={{
        headerShown: false,
        headerTitle: 'Edit file'
      }}>
        {props =>  
          <AclForm 
            submit={(data) => updateFile(data)}
            data={formState}
            options={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-center',
              margin: 8
            }}
          />
        }
      </StoreStack.Screen>
      <StoreStack.Screen name="ScanFile" options={{
        headerTitle: 'Scan file'
      }}>
        {props => <ScanFilePage {...scanFileState} />}
      </StoreStack.Screen> 
    </StoreStack.Navigator>
  );
};
export default FileEditPage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 0,
    bottom: 36,
  },
})