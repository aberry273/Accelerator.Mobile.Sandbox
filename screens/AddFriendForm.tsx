import {useIsFocused} from '@react-navigation/native';
import React, {useState, useCallback, useEffect } from 'react';
import {Text, StyleSheet, View, Modal, TextInput, Button} from 'react-native';
import {FAB, Portal, Title, List} from 'react-native-paper';
import base from '../styles/base';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../components/ContextualActionBar';

interface IAddFriendFormProps {}

const AddFriendForm: React.FunctionComponent<IAddFriendFormProps> = (props) => {
  const isScreenFocused = useIsFocused();
  const navigation = useNavigation();
  const [value, setValue] = useState(0);
  return (
    <View>
      <Text> Add Friend </Text>
      <View>
        <TextInput placeholder="Enter Email" />
        <TextInput
          secureTextEntry={true}
          placeholder="Enter Password"
        />
      </View>
    </View>
  );
};

export default AddFriendForm;