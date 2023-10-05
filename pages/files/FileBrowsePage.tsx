import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, ImageBackground} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List, Card, Avatar, Chip, Divider} from 'react-native-paper';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import FastImage from 'react-native-fast-image';
import AclModalImage from '../../components/modals/AclModalImage';
//import Share from 'react-native-share';

import FilesService from '../../services/FilesService';
import StoresService from '../../services/StoresService';

 
import { FileItem } from '../../models';
import CardActions from 'react-native-paper/lib/typescript/src/components/Card/CardActions';

interface IFileBrowsePageProps {
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
  file: FileItem,
  id: string,
  name: string
}

const FileBrowsePage: React.FunctionComponent<IFileBrowsePageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation(); 
  const [storeName, setStoreName] = useState(''); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const route = useRoute();
 
  const initializeState = async () => {
    if(selectedItem != null) return;
      //Set name so not empty
      setNavigation(' ');
      if(props.id == null) return;
      const result = await FilesService.Instance().Get(props.id);
      setSelectedItem(result);
      //get store name
      const store = await StoresService.Instance().Get(result.storeId);
      const storeName = store != null ? store.name : '';
      setStoreName(storeName);

      setNavigation(result.name);
  }

  // On mount
  useEffect(() => {
    //Async wrapper
    (async () => {
      await initializeState();
    })();
    //unmount function
    return () => {
      console.log('FileBrowsePage.Unmount');
    };
  }, [props]);

  // On navigation.goBack()
  useEffect(() => {
    (async () => {
      // Reset page state
      setSelectedItem(null);
      await initializeState();
    })();
    //reload
  }, [isScreenFocused]);
  
  const goBack = useCallback(() => {
    navigation.goBack('Files');
  });

  const removeFile = useCallback(() => {
    props.onDelete(props.id);
    navigation.goBack('Files');
  }, [props.id]);

  const copyFile = useCallback(() => {
    props.onCopy(props.id);
    navigation.goBack('Files');
  }, [props.id]);
 
  const editFile = useCallback(() => {
    props.onEdit(props.id);
    //navigation.goBack('Files');
  }, [props.id]);

  const setNavigation = useCallback((title) => {
    navigation.setOptions({
      header: (props: any) => (
        <ContextualActionBar
          {...props}
          title={title}
          onClose={goBack}
          onDelete={removeFile}
          onCopy={copyFile}
          onEdit={editFile}
        />
    ),
    });
  }, [])

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleModalShow = useCallback(() => {
    setShowModal(!showModal);
  }, []);

 
  const zoomImageProps = {
    uri: ''
  }; 

  const shareOptions = {
    appId: 1234,
    title: 'Share via email',
    message: 'some message',
    url: 'some share url',
    social: Share.Social.EMAIL,
    whatsAppNumber: "9199999999",  // country code + phone number
    filename: 'test' , // only for base64 file in Android
  };

  const menuItems = []
  /*[
    {
      label: 'Share by email',
      icon: 'home',
      onPress: async () => { 
        console.log('share');
        //const { uri: props.uri } = await FileSystem.downloadAsync(remoteUri, FileSystem.documentDirectory + 'name.ext');
        Share.shareSingle(shareOptions)
        .then((res) => { console.log(res) })
        .catch((err) => { err && console.log(err); });
        
       }
    }
  ];
  */

   // <DocumentScannerCard />

  return (
    <View style={base.left}>
      
      { selectedItem != null && 
        <Card onPress={handleModalShow}>
          <Card.Title title={selectedItem.name} subtitle="Card Subtitle"  />
          <Card.Content>
          { storeName != 'zze' && 
            <View>
              <Text variant="bodyMedium">Store</Text>
              <Chip>{storeName}</Chip>
            </View>
          }

            <Text variant="bodyMedium">Category</Text>
              <Chip>{selectedItem.category}</Chip>

              <Text variant="bodyMedium">Tags:</Text> 
              <View style={[styles.chipContainer]}>
              {
                selectedItem.tags.split(',')?.map((chip, i) => (
                  <Chip key={i +":"+ chip} style={[styles.chip]}>{chip}</Chip>
                ))
              } 
              </View>           
            <Divider />
            <Text variant="titleLarge">{selectedItem.description}</Text>
          </Card.Content> 
          <Card.Cover source={{ uri: FilesService.Instance().GetCachedImage(selectedItem.id) }} />
          <FastImage
            source={{uri: FilesService.Instance().GetCachedImage(selectedItem.id) }}
            resizeMode={
              FastImage.resizeMode.contain
            }
          />
        </Card>
       
      }
      
      { selectedItem != null &&
         <AclModalImage {...{
          uri: FilesService.Instance().GetCachedImage(selectedItem.id),
          show: showModal,
          close: handleModalClose,
          items: menuItems
        }}></AclModalImage>
      }
      {
        showModal == false &&
        <FAB
          icon="camera"
          style={localStyles.fab}
          visible={isScreenFocused}
          onPress={() => navigation.navigate('ScanFile')}
        />
      }
    </View>
  );
};
export default FileBrowsePage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 12,
    bottom: 90,
  },
})
const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '000',
    
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  chipContainer: {
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  }, 
  chip: {
    marginRight: 4,
    marginBottom: 4
  },
  padding: {
    marginLeft: 12,
    marginRight: 12,
  },
  show: {
    display: "flex"
  },
  hide: {
    display: "none"
  },
})