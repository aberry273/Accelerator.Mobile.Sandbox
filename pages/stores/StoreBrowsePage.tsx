import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List, Card, Avatar, Chip} from 'react-native-paper';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import MapsCard from '../../components/MapsCard';
import { getStores, deleteStore } from '../../services/store-service';
import ModalScreen from '../../components/ModalScreen';
import DocumentScannerCard from '../../components/DocumentScannerCard';

import AddFriendForm from '../../screens/AddFriendForm';
import { StoreItem } from '../../models';

interface IStoreBrowsePageProps {
  onDelete: () => void;
  onCopy: () => void;
  store: StoreItem,
  title: string
}

const StoreBrowsePage: React.FunctionComponent<IStoreBrowsePageProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [fabIsOpen, setFabIsOpen] = useState(false);
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [tags, setSelectedTags] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemLat, setSelectedItemLat] = useState('');
  const [testText, setTestText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  useEffect(() => {
    console.log('onInit');
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

  const setStore = useCallback(() => {
    if(props.store != null) {
      setSelectedItem(props.store);
      //setNavigation(props.store.name);
      setNavigation('Browse Store');
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
          <Card.Title title={selectedItem.name} subtitle="Card Subtitle"  />
          <Card.Content>
            <Text variant="titleLarge">{selectedItem.description}</Text>
            <Text variant="bodyMedium">tags:</Text>
            <View style={[styles.container]}>
          {
            selectedItem.tags.split(',')?.map((chip, i) => (
              <Chip key={i +":"+ chip}>{chip}</Chip>
            ))
          }
          </View>
          <MapsCard latitude={selectedItem.lat} longitude={selectedItem.lng}  />
           
          </Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
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