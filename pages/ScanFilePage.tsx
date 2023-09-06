import React, { useState, useEffect, useCallback } from 'react'
import DocumentScanner from 'react-native-document-scanner-plugin'
import { Platform, PermissionsAndroid, Image, Alert, BackHandler } from 'react-native'
import Constants from 'expo-constants';
import {useNavigation} from '@react-navigation/native';
import ContextualActionBar from '../components/ContextualActionBar';
import { Dimensions } from 'react-native';
import {Title} from 'react-native-paper';
import base from '../styles/base';


const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

interface IScanFilePageProps {
  onSave: () => void;
}

const ScanFilePage: React.FunctionComponent<IScanFilePageProps> = (props) => {
  
  const [scannedImage, setScannedImage] = useState();

  const navigation = useNavigation();
  // Navigation

  const saveImage = useCallback(async () => {
    console.log('saveImage');
    props.onSave(scannedImage);
  }, []);

  const goBack = useCallback(async () => { 
    console.log(scannedImage);
    navigation.goBack();
  }, []);

  const setNavigation = useCallback(() => {
    navigation.setOptions({
      header: (props: any) => (
        <ContextualActionBar
          {...props}
          title={ 'Use file?' }
          onClose={goBack}
          onSave={saveImage}
        />
    ),
    });
  }, [])

  useEffect(() => {
    setNavigation();
  }, [])

  // Document scanning

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => {
          console.log("return back");
          BackHandler.exitApp();
        }},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      // prompt user to accept camera permission request if they haven't already
      if (Platform.OS === 'android' && await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      ) !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Error', 'User must grant camera permissions to use document scanner.')
        return
      }
    })();
  }, []);

  useEffect(() => { 
    const scanDocument = async () => {
      // start the document scanner
      const { scannedImages } = await DocumentScanner.scanDocument()
    
      // get back an array with scanned image file paths
      if (scannedImages.length > 0) {
        // set the img src, so we can view the first scanned image
         
        const scan = scannedImages[0];
        setScannedImage(scan)
        console.log('scanned');
        console.log(scan);
        props.onSave(scan);

      }
    }
  
    // call scanDocument on load
    scanDocument();
  }, []);

  return (
    <Image
      resizeMode="contain"
      style={{ width: '100%', height: '100%'}}
      source={{uri: scannedImage}}
    />
  )
}
export default ScanFilePage;