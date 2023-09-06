import React from 'react';
import {useColorScheme} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, Theme} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ToDoPage from './pages/ToDoPage';
import Receipts from './pages/ReceiptsPage';
import FileStackPage from './pages/files/FileStackPage';
import StoreStackPage from './pages/stores/StoreStackPage';
import ProfilePage from './pages/ProfilePage';

import {combineThemes} from './theme';

import MenuIcon from './components/MenuIcon';
import MenuContent from './components/MenuContent';

const Stack = createNativeStackNavigator(); 

/*

            <Tab.Screen name="ToDo" component={ToDoPage} options={{
              tabBarLabel: 'ToDo',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              ),
            }} />
              <Tab.Screen name="Receipts" component={Receipts} options={{
                tabBarLabel: 'Receipts',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="receipt" color={color} size={size} />
                ),
              }} />
              */
export default function App() {
  const Drawer = createDrawerNavigator();
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = combineThemes(colorScheme);
  
  const Tab = createBottomTabNavigator();
  /* <Provider theme={theme as ReactNativePaper.Theme} >*/
  return (
    <SafeAreaProvider>
      <Provider theme={theme as ReactNativePaper.Theme} >
        <NavigationContainer>
          
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
            })}
          >
        
          <Tab.Screen name="Files" component={FileStackPage} options={{
              tabBarLabel: 'Files',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="document" color={color} size={size} />
              ),
            }} />
          
            <Tab.Screen name="Stores" component={StoreStackPage} options={{
              tabBarLabel: 'Stores',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }} />
            <Tab.Screen name="Profile" component={ProfilePage} options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
              ),
            }} />
          </Tab.Navigator>          
            
        </NavigationContainer>
        <StatusBar style='auto' />
      </Provider>
    </SafeAreaProvider>
  );
}

/*
 <Drawer.Navigator
  screenOptions={{headerShown: true, headerLeft: () => <MenuIcon />}}
  drawerContent={(props) => <MenuContent {...props} />}
  >
  <Drawer.Screen name='Profile' component={Profile} />
  <Drawer.Screen name='Stores' component={Stores} />
  <Drawer.Screen name='Scan' component={Scan} />
</Drawer.Navigator>
*/