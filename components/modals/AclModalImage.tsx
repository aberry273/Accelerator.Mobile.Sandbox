import React, { useState, useEffect, useRef } from 'react';
import { Text, FAB, PaperProvider } from 'react-native-paper';
import { StyleSheet, FlatList, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { AclImagePinchZoom } from '../../components/images';
import { AclMenu } from '../../components/menus';
import { IAclModalImageProps } from '.';

const AclModalImage: React.FunctionComponent<IAclModalImageProps> = (
  props
) => {
  const [imageuri, setImageuri] = useState('');
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);

  const menuState = {
    title: 'Menu',
    items: props.items
  }

  useEffect(() => {
    setImageuri(props.uri);
    setModalVisibleStatus(props.show);
  }, [props]);
  
  return (
    <SafeAreaView style={styles.container}>
      {modalVisibleStatus && 
        <Modal
          transparent={false}
          animationType={'fade'}>
          <PaperProvider>
            <View style={styles.modelStyle}>
              <AclImagePinchZoom {...{
                uri: imageuri
              }} />
                <View style={[styles.menuButtonContainer]}>
                  <FAB
                    variant="primary"
                    mode="flat"
                    icon="close"
                    onPress={() => {
                      props.close()
                    }}
                    />
                </View>
                {
                  (props.items != null && props.items.length > 0) &&
                  <View style={[styles.closeButtonContainer]}>
                    <AclMenu {...menuState} />
                  </View>
                }  
              </View>
            </PaperProvider>
        </Modal>
      }
    </SafeAreaView>
  );
};

export default AclModalImage;


const styles = StyleSheet.create({
  container: {
  
    backgroundColor: '#ffffff',
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: 'black',
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuButtonContainer: {
    top: 50,
    left: 20,
    position: 'absolute',
  },
  closeButtonContainer: {
    top: 50,
    right: 20,
    position: 'absolute',
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },
});