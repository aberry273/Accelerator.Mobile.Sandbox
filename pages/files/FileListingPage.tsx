import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {View, ScrollView} from 'react-native';
import {FAB, Portal, Provider, Title, Modal, Button, List, Avatar} from 'react-native-paper';
import { deleteFileTable } from '../../services/file-db-service';
import { getFilePath } from '../../services/fs-service';
import base from '../../styles/base';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../../components/ContextualActionBar';
import { FileItem } from '../../models';
import ModalScreen from '../../components/ModalScreen';

import FileAddPage from './FileAddPage';
import FileListingPage from './FileListingPage';

interface IFileListingProps {
  items: FileItem[],
  onSelect: () => void;
}

const FileListing: React.FunctionComponent<IFileListingProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [files, setFiles] = useState<FileItem[]>([]);
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


  const selectFile = useCallback(async (file) => {
    console.log('selectFile');
    props.onSelect(file);
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
          Saved files
        </List.Subheader>
          {props.items.map((file) => (
            <List.Item
              key={file.id}
              title={file.name}
              description={`Added: ${new Date(file.created).toLocaleString('en-AU')}`}
              left={ props => <Avatar.Image size={48} source={ { uri: getFilePath(file.id) } } /> }
              style={{width: '100%'}}
              onPress={() => selectFile(file)}
              onLongPress={() => openHeader(file.name)}
            />
          ))}
          </List.Section>
 
      </ScrollView>
      <Button {...props} icon="delete" mode="text" onPress={() => deleteFileTable() }>Delete Table</Button>
      <Portal>
        <FAB
          icon="plus"
          style={localStyles.fab}
          visible={isScreenFocused}
          onPress={() => navigation.navigate('AddFile')}
        />
      </Portal>
    </View>
  );
};
export default FileListing;


const localStyles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    height: '100%'
  },
  fab: {
    position: 'absolute',
    margin: 0,
    right: 10,
    bottom:90,
  },
})