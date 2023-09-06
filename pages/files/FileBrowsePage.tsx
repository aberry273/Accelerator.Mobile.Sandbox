import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, ImageBackground} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List, Card, Avatar, Chip, Divider} from 'react-native-paper';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import { getSingleFile, getFilePath } from '../../services/fs-service';
import FastImage from 'react-native-fast-image';
import MapsCard from '../../components/MapsCard';
import ModalScreen from '../../components/ModalScreen';
import PinchZoomImage from '../../components/images/PinchZoomImage';
import DocumentScannerCard from '../../components/DocumentScannerCard';
import AclModalImage from '../../components/modals/AclModalImage';

import AddFriendForm from '../../screens/AddFriendForm';
import { FileItem } from '../../models';
import CardActions from 'react-native-paper/lib/typescript/src/components/Card/CardActions';

interface IFileBrowsePageProps {
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
  file: FileItem,
  title: string
}

const FileBrowsePage: React.FunctionComponent<IFileBrowsePageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [fabIsOpen, setFabIsOpen] = useState(false);
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [tags, setSelectedTags] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemLat, setSelectedItemLat] = useState('');
  const [testText, setTestText] = useState('');
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
    console.log('onInit');
    setFile();
  }, [props]);
  
  const goBack = useCallback(async () => { 
    navigation.goBack('Files');
  });

  const removeFile = useCallback(async () => {
    console.log('remove');
    props.onDelete(props.file);
    navigation.goBack('Files');
  }, []);

  const copyFile = useCallback(async () => {
    props.onCopy(props.file);
    navigation.goBack('Files');
  }, []);

  const editFile = useCallback(async () => {
    props.onEdit(props.file);
    navigation.goBack('Files');
  }, []);

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

  const setFile = useCallback(() => {
    if(props.file != null) {
      setSelectedItem(props.file);
      //setNavigation(props.store.name);
      setNavigation('Browse File');
    }
  }, []); 

  const zoomImageProps = {
    uri: ''
  }; 
  
   // <DocumentScannerCard />

  return (
    <View style={base.left}>
      
      { selectedItem != null && 
        <Card onPress={handleModalShow}>
          <Card.Title title={selectedItem.name} subtitle="Card Subtitle"  />
          <Card.Content>

            <Text variant="bodyMedium">Category</Text>
              <Chip>{selectedItem.category}</Chip>

              <Text variant="bodyMedium">Tags:</Text> 
            {
              selectedItem.tags.split(',')?.map((chip, i) => (
                <Chip key={i +":"+ chip}>{chip}</Chip>
              ))
            } 
           
            <Divider />
          
            <Text variant="titleLarge">StoreID: {selectedItem.storeId}</Text>
            <Text variant="titleLarge">{selectedItem.description}</Text>
            
          </Card.Content> 
          
          <Card.Cover source={{ uri: getFilePath(selectedItem.id) }} />
          
          <FastImage
            source={{uri: getFilePath(selectedItem.id) }}
            resizeMode={
              FastImage.resizeMode.contain
            }
          />
           
        </Card>
       
      }
      
      { selectedItem != null &&
         <AclModalImage {...{
          uri: getFilePath(selectedItem.id),
          show: showModal,
          close: handleModalClose
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
  container: {
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
  }
})