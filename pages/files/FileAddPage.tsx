import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper'; 
import base from '../../styles/base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar'; 

import Constants from 'expo-constants';

const StoreStack = createNativeStackNavigator(); 

import { AclForm } from '../../components/forms';

import AddFriendForm from '../../screens/AddFriendForm';
import ScanFilePage from './../ScanFilePage';

interface IFileAddPageProps {
  onCreate: () => void;
  stores: []
}

const tempFormData = 
{
  fields: [
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
    }
  ]
};

/*
1. Location Field: Custom UI to have a switch pull back location data and store it in a text field
2. Switch and replace field: Custom UI & logic to update formState of a particular field, requires formState to change
3. Form to handle updates of formfield content changes on field change, always emit updates to parent form, parent will update state accordingly
3.1. However if we a passing down logic to child fields this always causes havor
*/

const FileAddPage: React.FunctionComponent<IFileAddPageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [showParentHeader, setShowParentHeader] = useState(false);

  const [tempFile, setTempFile] = useState('');
  const [formState, setFormState] = useState(null);

  // Scan file
  const saveFile = useCallback((file) => {
    //console.log('set img to file');
    console.log('setFile');
    console.log(file);
    setTempFile(file);
    console.log('now set as');
    console.log(tempFile);
    //console.log(file);
    //setShowParentHeader(!showParentHeader);
    navigation.navigate('FileDetails');
  }, []);

  const scanFileState = {
    onSave: saveFile
  }

  // Form
 
  useEffect(() => {
    tempFormData.fields[2].data.items = 
      (props.stores != null)
      ? props.stores.map(x => { return { name: x.name, value: x.id } }) 
      : [];
    setFormState(tempFormData);
  });

  const addFileModel = useCallback(async (data) => {
    console.log('storeAddPage.addFile()');
    
    data.file = tempFile;
   
    console.log('addFile');
    console.log('scannedImage when adding file');
    console.log(tempFile);
    
    if(data.tags != null) {
      const tags = data.tags.join(',');
      //Remove final ',' if appended at the end
      data.tags = tags.endsWith(',') ? tags.substring(0, tags.length - 1) : tags;
    }
    //create new service & move to file-item-service
 
    //MIGRATE THIS TO THE NEW SERVICE
    data.tempFile = tempFile;
    //await copyFileToCache(tempFile, id);

    //Updating the file doesn't work in dev as the application GUID changes - This doesn't work
    //data.file = getFilePath(id);
    
    props.onCreate(data);
    navigation.goBack();
  }, [tempFile]);
  
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
    <StoreStack.Navigator initialRouteName="ScanFile"
    screenOptions={{
      headerShown: false
    }}>
      <StoreStack.Screen name="ScanFile" options={{
        headerTitle: 'Scan file'
      }}>
        {props => <ScanFilePage {...scanFileState} />}
      </StoreStack.Screen> 
      <StoreStack.Screen name="FileDetails" options={{
        headerShown: false,
        headerTitle: 'Edit file'
      }}>
        {props =>  
          <AclForm 
            submit={(data) => addFileModel(data)}
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
    </StoreStack.Navigator>
  );
};
export default FileAddPage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 0,
    bottom: 36,
  },
})