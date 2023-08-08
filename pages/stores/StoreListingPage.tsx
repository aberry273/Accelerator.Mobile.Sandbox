import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View, ScrollView} from 'react-native';
import {FAB, Portal, Provider, Title, Modal, Button, List} from 'react-native-paper';
import { deleteStoreTable } from '../../services/store-service';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import { StoreItem } from '../../models';
import ModalScreen from '../../components/ModalScreen';

import StoreAddPage from './StoreAddPage';
import StoreListingPage from './StoreListingPage';

interface IStoreListingProps {
  items: StoreItem[],
  onSelect: () => void;
}

const StoreListing: React.FunctionComponent<IStoreListingProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [fabIsOpen, setFabIsOpen] = useState(false);
  const [cabIsOpen, setCabIsOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [testText, setTestText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);


  const toggleModal = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, []);
  
  const closeHeader = useCallback(() => {
    setCabIsOpen(false);
    setSelectedItemName('');
  }, []);

  const openHeader = useCallback((str: string) => {
    setSelectedItemName(str);
    setCabIsOpen(!cabIsOpen);
  }, [cabIsOpen]);


  const selectStore = useCallback(async (store) => {
    console.log('selectStore');
    props.onSelect(store);
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

  //description='Mar 18 | 3:31 PM'
  return (
    <View style={base.left}>
      
      <ScrollView>
        <List.Section>
        <List.Subheader>
          Saved stores
        </List.Subheader>
          {props.items.map((store) => (
            <List.Item
              key={store.id}
              title={store.name}
              description={`Added: ${new Date(store.created).toLocaleString('en-AU')}`}
              style={{width: '100%'}}
              onPress={() => selectStore(store)}
              onLongPress={() => openHeader(store.name)}
            />
          ))}
          </List.Section>
      </ScrollView>
 
      <Button {...props} icon="delete" mode="text" onPress={() => deleteStoreTable() }>Delete Table</Button>
      <Portal>
        <FAB
          icon="plus"
          style={localStyles.fab}
          visible={isScreenFocused}
          onPress={() => navigation.navigate('AddStore')}
        />
      </Portal>
    </View>
  );
};
export default StoreListing;


const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 10,
    bottom:90,
  },
})