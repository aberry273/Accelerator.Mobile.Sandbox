import React, { useState, useEffect, useRef } from 'react';
import { Text, FAB, IconButton } from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, FlatList, View, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import PinchZoomImage from '../../components/images/PinchZoomImage';
import AclMenu from '../../components/menus/AclMenu';
import { IAclNavigationTabProps } from './index'
import LoadingPage from '../../pages/LoadingPage';
 
const AclNavigationTab: React.FunctionComponent<IAclNavigationTabProps> = (
  props
) => {
  const Tab = createBottomTabNavigator();
  const [items, setItems] = useState([]);
  
  // createNavigation requires some screens by default, if nothing is passed in use an empty tab
  const emptyNavigation = [
    {
      name: 'Loading',
      label: 'Loading',
      component: LoadingPage,
      icon: 'document',
      headerShow: false
    },
  ]

  useEffect(() => {
    setItems(props.items || emptyNavigation)
  }, [props]);
  
  return (
    ( items.length > 0 &&
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: props.tabBarActiveTintColor,
            tabBarInactiveTintColor: props.tabBarInactiveTintColor,
          })}
        >
          {
            items.map((tab, i) => (
              <Tab.Screen key={i} name={tab.name} component={tab.component} options={{
                tabBarLabel: tab.label,
                headerShown: tab.headerShown,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name={tab.icon} color={color} size={size} />
                ),
                }} />
              )
            )
          }
        </Tab.Navigator>
      </NavigationContainer>
    )
  );
};

export default AclNavigationTab;


const styles = StyleSheet.create({
  container: {
  
    backgroundColor: '#ffffff',
  }, 
});