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
import * as SecureStore from 'expo-secure-store';
  
import FileStackPage from './pages/files/FileStackPage';
import StoreStackPage from './pages/stores/StoreStackPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/auth/SignInPage';
import LoadingPage from './pages/LoadingPage';

import {combineThemes} from './theme';

import useAuth from './hooks/useAuth';

import { AclNavigationTab } from './components/navigation';

const Stack = createNativeStackNavigator(); 

export default function App() {
  const Drawer = createDrawerNavigator();
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const theme = combineThemes(colorScheme);
  
  const AuthContext = React.createContext();
  const [getAuthState] = useAuth();
  
  const getTabItems = function() {
    const items = [
      {
        name: 'Files',
        label: 'Files',
        component: FileStackPage,
        icon: 'document',
        headerShown: false
      },
      {
        name: 'Stores',
        label: 'Stores',
        component: StoreStackPage,
        icon: 'home',
        headerShown: false
      }
    ];
    if(getAuthState().isSignedIn) {
      items.push({
        name: 'Profile',
        label: 'Profile',
        component: ProfilePage,
        icon: 'person-outline',
        headerShown: true
      });
    } else {
      items.push({
        name: 'SignIn',
        label: 'Sign in',
        component: SignInPage,
        icon: 'person-outline',
        headerShown: true
      });
    }
    return items;
  }

  const tabNavigationState = {
    items: getTabItems()
  }

  if (getAuthState().isLoading) {
    // We haven't finished checking for the token yet
    return <LoadingPage />;
  }

  return (
    <SafeAreaProvider>
      <Provider theme={theme as ReactNativePaper.Theme} >
        <AclNavigationTab {...tabNavigationState} />
         <StatusBar style='auto' />
      </Provider>
    </SafeAreaProvider>
  );
}