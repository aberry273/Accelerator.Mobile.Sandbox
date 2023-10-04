import React, { useState, useRef, createRef, useEffect } from 'react';
import { View, Text, Image, Animated, Dimensions, StyleSheet, PanResponder } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

interface IAclPinchZoomImageProps {
  uri: String;
  //options: object;
  //change: () => void;
}

const PinchZoomImage: React.FunctionComponent<IAclPinchZoomImageProps> = (
  props
) => {
  const [panEnabled, setPanEnabled] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const pinchRef = useRef(null);
  const panRef = useRef(null);

  const test = useEffect(() => {
    console.log('load12');
  }, []);

  const onPinchEvent = Animated.event(
    [{
      nativeEvent: { scale }
    }],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [{
    nativeEvent: {
        translationX: translateX,
        translationY: translateY
      }
    }],
    { useNativeDriver: true }
  );

  const init = useEffect(() => {
     
  }, [])


  const handlePanStateChange = ({ nativeEvent }) => {
    //console.log('handlePanStateChange');
  }

  const handlePinchStateChange = ({ nativeEvent }) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true
        }).start();

        setPanEnabled(false);
      }
    }
  };

  return (  
      <PanGestureHandler
        onGestureEvent={onPanEvent}
        ref={panRef}
        simultaneousHandlers={[pinchRef]}
        enabled={panEnabled}
        failOffsetX={[-1000, 1000]}
        shouldCancelWhenOutside
        onHandlerStateChange={handlePanStateChange}
        minPointers={1}
        maxPointers={1}
      >
        <Animated.View style={[styles.animatedContainer]}>
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            simultaneousHandlers={[panRef]}
            onHandlerStateChange={handlePinchStateChange}  
          > 
            <Animated.Image
              source={{ uri: props.uri }}
              style={{
                width: '100%',
                height: '100%',
                transform: [{ scale }, { translateX }, { translateY }]
              }}
              resizeMode="contain"
            /> 
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>  
  );
};

export default PinchZoomImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  animatedContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
});