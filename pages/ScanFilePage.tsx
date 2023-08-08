import React, { useState, useEffect } from 'react'
import DocumentScanner from 'react-native-document-scanner-plugin'
import { Platform, PermissionsAndroid, Image, Alert } from 'react-native'
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import {Title} from 'react-native-paper';
import base from '../styles/base';


const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

interface IScanFilePageProps {}

const ScanFilePage: React.FunctionComponent<IScanFilePageProps> = (props) => {
   
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

  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument()
  
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
    }
  }

  useEffect(() => {
    // call scanDocument on load
    scanDocument()
  }, []);

  return (
    <Image
      resizeMode="contain"
    
    />
  )
}
export default ScanFilePage;