import * as React from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';

const SelectField = (props) => {
  const [label, setLabel] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const openMenu = () => setModalVisible(true);

  const closeMenu = () => setModalVisible(false);

  return (
      <>
        <Menu
          visible={modalVisible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}>{modalVisible}</Button>}>
          <Menu.Item onPress={() => { setModalVisible('Item 1') }} title="Item 1" />
          <Menu.Item onPress={() => { setModalVisible('Item 2') }} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => { setModalVisible('Item 3') }} title="Item 3" />
        </Menu>
      </>
  );
};

export default SelectField;