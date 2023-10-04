import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List, Card, Avatar, Chip, Divider} from 'react-native-paper';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import { AclCardsMap } from '../../components/cards';
import { AclGridImage } from '../../components/grids';

import AddFriendForm from '../../screens/AddFriendForm';
import { FileItem, StoreItem } from '../../models';
import StoresService from '../../services/StoresService';
import FilesService from '../../services/FilesService';

interface IStoreBrowsePageProps {
  onDelete: () => void;
  onCopy: () => void;
  onEdit: () => void;
  store: StoreItem,
  id: string,
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
 
  // On mount
  useEffect(() => {
    //Async wrapper
    (async () => {
      await initializeState();
    })();
    //unmount function
    return () => {
      console.log('StoreBrowsePage.Unmount');
    };
  }, [props]);

  const initializeState = async () => {
    if(selectedItem != null) return;
      //Set name so not empty
      setNavigation(' ');
      if(props.id == null) return;
      const result = await StoresService.Instance().Get(props.id);
      setSelectedItem(result);
      setNavigation(result.name);
      ////
      const files = await FilesService.Instance().Search({storeId: props.id}); 
      if(files.length) {
        const gridFiles = files.map(x => {
          x.uri = FilesService.Instance().GetCachedImage(x.id);
          return x;
        });
        setFiles(gridFiles);
      }
  }

  // On navigation.goBack()
  useEffect(() => {
    (async () => {
      // Reset page state
      setSelectedItem(null);
      await initializeState();
    })();
    //reload
  }, [isScreenFocused]);
  
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
          onEdit={editStore}
          onDelete={removeStore}
          onCopy={copyStore}
        />
    ),
    });
  }, [])
  
  const removeStore = useCallback(async () => {
      props.onDelete(props.store);
      navigation.goBack('Stores');
  }, []);

  const copyStore = useCallback(async () => {
      props.onCopy(props.store);
      navigation.goBack('Stores');
  }, []);

  const editStore = useCallback(async () => {
      //props.onEdit(props.store);
      navigation.push('EditStore', props.store);
    }, [selectedItem]);
    
  const menuItems = [
    {
      label: 'Open in files',
      trailingIcon: 'home',
      onPress: async (item) => { 
        console.log('share');
        navigation.navigate('BrowseFile');
       
        }
    }
  ];

  return (
    <View style={base.left}>
      
      { selectedItem != null && 
        <Card elevation={0} style={[styles.cardContainer]}>
          <Card.Content>
            
          { selectedItem.lat != null &&
          <View style={[styles.mapContainer]}>
            <AclCardsMap latitude={selectedItem.lat} longitude={selectedItem.lng}  />
          </View> 
          }
            <View style={[styles.container]}>
              <Text variant="bodyMedium">Category:</Text> 
              <Chip>{selectedItem.category}</Chip>
              <Divider />
            </View>
            <View style={[styles.container]}>
              <Text variant="bodyMedium">Tags:</Text> 
                {
                  selectedItem != null && selectedItem.tags != null && 
                    selectedItem.tags.split(',')?.map((chip, i) => (
                    <Chip key={i +":"+ chip} style={[styles.chip]}>{chip}</Chip>
                  ))
                } 
            </View>
            <View style={[styles.container]}>
              <Text variant="bodyMedium">Description:</Text> 
            </View>
              <Text variant="">{selectedItem.description}</Text> 
          </Card.Content>  
         
          <AclGridImage {...{
            items: files,
            menuItems: menuItems
          }} />
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
  cardContainer: {
    overflow: "scroll",
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