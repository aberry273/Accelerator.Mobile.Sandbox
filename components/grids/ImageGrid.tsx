import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet, FlatList, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import AclModalImage from '../../components/modals/AclModalImage';

interface IImageGridDataProps {
  items: [];
}

interface IAclImageGridProps {
  items: [];
  //options: object;
  //change: () => void;
}

const ImageGrid: React.FunctionComponent<IAclImageGridProps> = (
  props
) => {
  const [imageuri, setImageuri] = useState('');
  const [
    modalVisibleStatus, setModalVisibleStatus
  ] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    /*
    let items = Array.apply(null, Array(120)).map((v, i) => {
      return {
        id: i,
        uri: 'https://unsplash.it/400/400?image=' + (i + 1)
      };
    });
    */
    //setDataSource(items);
    //console.log(items);
  }, []);

  useEffect(() => {
    if(props.items == null) return;
    setDataSource(props.items || []);
  }, [props]);

  const showModalFunction = (visible, imageURL) => {
    //handler to handle the click on image of Grid
    //and close button on modal
    setImageuri(imageURL);
    setModalVisibleStatus(visible);
  };

  const toggleModal = () => {
    setModalVisibleStatus(!modalVisibleStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {modalVisibleStatus ? (
        <AclModalImage {...{
          uri: imageuri,
          show: modalVisibleStatus,
          close: toggleModal
        }}></AclModalImage>
        /*
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={modalVisibleStatus}
          onRequestClose={() => {
            showModalFunction(!modalVisibleStatus, '');
          }}>
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
              style={styles.closeButtonStyle}
              onPress={() => {
                showModalFunction(!modalVisibleStatus, '');
              }}>
              <FastImage
                source={{
                  uri:
                    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/close.png',
                }}
                style={{width: 35, height: 35}}
              />
            </TouchableOpacity>
          </View>
        </Modal>
        */
      ) : (
        <View style={styles.container}>
          <FlatList
            data={dataSource}
            renderItem={({item}) => (
              <View style={styles.imageContainerStyle}>
                <TouchableOpacity
                  key={item.id}
                  style={{flex: 1}}
                  onPress={() => {
                    showModalFunction(true, item.uri);
                  }}>
                  <FastImage
                    style={styles.imageStyle}
                    source={{
                      uri: item.uri,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ImageGrid;


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
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 50,
    right: 20,
    position: 'absolute',
  },
});