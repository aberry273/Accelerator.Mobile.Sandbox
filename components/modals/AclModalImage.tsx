import React, { useState, useEffect, useRef } from 'react';
import { Text, FAB } from 'react-native-paper';
import { StyleSheet, FlatList, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';

interface IAclModalImageProps {
  uri: string;
  show: boolean;
  //options: object;
  close: () => void;
}

const AclModalImage: React.FunctionComponent<IAclModalImageProps> = (
  props
) => {
  const [imageuri, setImageuri] = useState('');
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);

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
          <View style={styles.modelStyle}>
            <FastImage
              style={styles.fullImageStyle}
              source={{uri: imageuri}}
              resizeMode={
                FastImage.resizeMode.contain
              }
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonContainer}>
                <FAB
                  icon="close"
                  onPress={() => {
                    props.close()
                  }}
                />
                
            </TouchableOpacity>
          </View>
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
  closeButtonContainer: {
    top: 50,
    right: 20,
    position: 'absolute',
  },
});