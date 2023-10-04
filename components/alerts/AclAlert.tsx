import React, { useState, useRef, createRef, useEffect } from 'react';
import { Snackbar, Button, Menu, FAB, Divider, PaperProvider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface IAclMenuButtonProps {
  label: String;
  onPress: () => void;
}

interface IAclAlertProps {
  title: String;
  items: Array<IAclMenuButtonProps>;
}

const AclAlert: React.FunctionComponent<IAclAlertProps> = (
  props
) => { 
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => { 
  }, []);
 
  return (
    <View style={styles.container}>
      <Button onPress={onToggleSnackBar}>{visible ? 'Hide' : 'Show'}</Button>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}>
        Hey there! I'm a Snackbar.
      </Snackbar>
    </View>
  );
};

export default AclAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});