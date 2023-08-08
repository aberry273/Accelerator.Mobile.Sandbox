import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {Text, StyleSheet, View, Modal, TextInput, Button} from 'react-native';
import {FAB, Portal, Title, List} from 'react-native-paper';
import base from '../styles/base';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../components/ContextualActionBar';

import AddFriendForm from './AddFriendForm';

interface IModalFriendFormProps {}

const ModalFriendForm: React.FunctionComponent<IModalFriendFormProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <View style={base.container}>
      <Button title="Add" onPress={toggleModal} />
      <Modal
        isVisible={isModalVisible}>
        <View>
          <AddFriendForm />
          <View>
            <Button title="Hide modal" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalFriendForm;