import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'; 
import MapView, { Marker, Polyline } from "react-native-maps";
import {FAB, Portal, Provider, Title, Text, Modal, Button, List} from 'react-native-paper';
import DocumentScanner from 'react-native-document-scanner-plugin'
import { IAclCardsMapProps } from '.';
 
const AclCardsMap: React.FunctionComponent<IAclCardsMapProps> = (
  props
) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const storeRegion = {
    latitude: props.latitude,
    longitude: props.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const goToStore = () => {
    //complete this animation in 3 seconds
    mapRef.current.animateToRegion(storeRegion, 3 * 1000);
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: props.latitude,
          longitude: props.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {/*<Marker coordinate={tokyoRegion} />*/}
        {/*marker to a nearby location */}
        <Marker
          coordinate={{
            latitude: props.latitude,
            longitude: props.longitude,
          }}
        />
      </MapView>
      <Button onPress={() => goToStore()} title={props.title} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 20,
    backgroundColor: "lightblue",
  },
});

export default AclCardsMap;