import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List, Card, Avatar, Chip, Divider} from 'react-native-paper';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import { getSingleFile, getFilePath } from '../../services/fs-service';
import MapsCard from '../../components/MapsCard';
import ModalScreen from '../../components/ModalScreen';
import DocumentScannerCard from '../../components/DocumentScannerCard';
import { getFiles, searchFiles, createFile, deleteFile } from '../../services/file-db-service';
import ImageGrid from '../../components/grids/ImageGrid';

import AddFriendForm from '../../screens/AddFriendForm';
import { FileItem, StoreItem } from '../../models';

interface IStoreBrowsePageProps {
  onDelete: () => void;
  onCopy: () => void;
  store: StoreItem,
  title: string
}

const StoreBrowsePage: React.FunctionComponent<IStoreBrowsePageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fabIsOpen, setFabIsOpen] = useState(false);
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [tags, setSelectedTags] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemLat, setSelectedItemLat] = useState('');
  const [testText, setTestText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  useEffect(() => {
    setStore();
  }, [props]); 
  
  const goBack = useCallback(async () => { 
    navigation.goBack('Stores');
  });

  const setNavigation = useCallback((title) => {
    navigation.setOptions({
      header: (props: any) => (
        <ContextualActionBar
          {...props}
          title={title}
          onClose={goBack}
          onDelete={removeStore}
          onCopy={copyStore}
        />
    ),
    });
  }, [])


  const loadFiles = useCallback(async () => {
    try {
      console.log('stackpage loadFiles()')
      //const db = getDBConnection();
      const query = {
        storeId: selectedItem.id
      }
      searchFiles(query, (result) => { 
        console.log('searchFiles');
        if(result.length) {

          const gridFiles = result.map(x => {
            x.uri = getFilePath(x.id);
            return x;
          });

          setFiles(gridFiles);
        } else {
          console.log('No files found');
        }
      })
    } catch (error) {
      console.error(error);
    }
  }, []);
 
  const setStore = useCallback(() => {
    if(props.store != null) {
      setSelectedItem(props.store);
      //setNavigation(props.store.name);
      setNavigation(props.store.name);
 
      loadFiles();
 
    }
  }, []); 
  
  const removeStore = useCallback(async () => {
      props.onDelete(props.store);
      navigation.goBack('Stores');
  }, []);

  const copyStore = useCallback(async () => {
      props.onCopy(props.store);
      navigation.goBack('Stores');
  }, []);

   // <DocumentScannerCard />
  return (
    <View style={base.left}>
      
      { selectedItem != null && 
        <Card>
          <Card.Content> 
          <View style={[styles.mapContainer]}>
            <MapsCard latitude={selectedItem.lat} longitude={selectedItem.lng}  />
          </View>
            <View style={[styles.container]}>
              <Text variant="bodyMedium">Category:</Text> 
              <Chip >{selectedItem.category}</Chip>
              <Divider />
            </View>
            <View style={[styles.container]}>
              <Text variant="bodyMedium">Tags:</Text> 
                {
                  selectedItem.tags.split(',')?.map((chip, i) => (
                    <Chip key={i +":"+ chip} style={[styles.chip]}>{chip}</Chip>
                  ))
                } 
            </View>
          </Card.Content> 
              
          <Card.Title title="" subtitle={selectedItem.description}  />
            
          <ImageGrid {...{
              items: files
            }}></ImageGrid>
        </Card>
      }
      <Portal>
        <FAB
          icon="camera"
          style={localStyles.fab}
          visible={isScreenFocused}
          onPress={() => navigation.navigate('ScanFile')}
        />
      </Portal>
    </View>
  );
};
export default StoreBrowsePage;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 12,
    bottom: 90,
  },
})
const styles = StyleSheet.create({
  mapContainer: {
    display: "flex",
    margin: 0,
    padding: 0,
    width: "100%",
    height: 175,
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