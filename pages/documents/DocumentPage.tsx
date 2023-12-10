import React, { useCallback, useEffect, useState } from 'react';
import {View} from 'react-native';
import base from '../../styles/base';
import {FAB, Portal, Provider, Title, Text, Modal, Button, List, Card, Avatar, Chip, Divider} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { AclForm } from '../../components/forms';
import AjaxService from '../../services/AjaxService';

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import { Easing } from "react-native-reanimated";

interface IDocumentPageProps {}

const loginFormData = 
{
  fields: [
    {
      component: 'TextField',
      data: {
        label: 'Username',
        name: 'username',
        value: null,
        placeholder: 'tester..'
      },
      options: {
        mode: 'flat'
      }
    },
    {
      component: 'TextField',
      data: {
        label: 'Voice',
        name: 'voice',
        value: null,
        placeholder: ''
      },
      options: {
        mode: 'flat',
        secureTextEntry: true
      }
    },
  ]
}

const DocumentPage: React.FunctionComponent<IDocumentPageProps> = (props) => {
  const [formState, setFormState] = useState(null);
 
  useEffect(() => {
    setFormState(loginFormData);
  });

  const login = useCallback(async (data) => {
    const url = 'https://192.168.1.72:44322/PublicAuthentication/SocialLogin?provider=facebook';
    try {
      const response = await AjaxService.Instance().Post(url, data);
      console.log(response);
    }
    catch(e){
      console.log(e)
    }
  }, []);
  /*
    <AclForm 
      submit={(data) => login(data)}
      data={formState}
      options={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-center',
        margin: 8
      }}
    />
  */

  return (
    <View style={base.container}>
      <Card>
        <Card.Title title={'wqddq'} subtitle="Card Subtitle"  />
        <Card.Content>
        { 'wqddq' != 'zze' && 
          <View>
            <Text variant="bodyMedium">Store</Text>
            <Chip>{'wqddq'}</Chip>
          </View>
        }

          <Text variant="bodyMedium">Category</Text>
            <Chip>{'wqddq'}</Chip>

            <Text variant="bodyMedium">Tags:</Text> 
                  
          <Divider />
          <Text variant="titleLarge">{'wqddq'}</Text>
        </Card.Content>
      </Card>
      
    </View>
  );
};
export default DocumentPage;



const localStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 0,
    right: 12,
    bottom: 90,
  },
})
const styles = StyleSheet.create({
  mapContainer: {
    display: "flex",
    margin: 0,
    padding: 0,
    width: "100%",
    height: 175,
  },  
  container: {
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },  
  cardContainer: {
    overflow: "scroll",
  },  
  chip: {
    marginRight: 4,
    marginBottom: 4
  },
  padding: {
    marginLeft: 12,
    marginRight: 12,
  },
  show: {
    display: "flex"
  },
  hide: {
    display: "none"
  }
})