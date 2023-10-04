import React, { useState, useRef, createRef, useEffect } from 'react';
import { Button, Menu, FAB, Divider, PaperProvider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { IAclMenuButtonProps, IAclMenuProps } from './index'
/*
interface IAclMenuButtonProps {
  label: String;
  leadingIcon: String,
  trailingIcon: String,
  onPress: () => void;
}

interface IAclMenuProps {
  title: String;
  items: Array<IAclMenuButtonProps>;
}
*/

const AclMenu: React.FunctionComponent<IAclMenuProps> = (
  props
) => { 
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => { 
    
  }, []);
 
  return (
  
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
            <FAB 
              mode="flat"
              icon="dots-horizontal"
              onPress={openMenu} />
          }>
            {
              props.items != null && props.items.map((btn, i) => (
                <Menu.Item
                  key={i}
                  title={btn.label}
                  onPress={btn.onPress}
                  trailingIcon={btn.trailingIcon}
                  leadingIcon={btn.leadingIcon}
                />
              ))
            }
      </Menu>
  );
};

export default AclMenu;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1, 
    padding: 4,
    flexDirection: "row", 
    alignItems: "center",
  }, 
});