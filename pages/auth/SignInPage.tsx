import React, { useCallback, useEffect, useState } from 'react';
import {View} from 'react-native';
import {Title} from 'react-native-paper';
import base from '../../styles/base';
import { AclForm } from '../../components/forms';
import AjaxService from '../../services/AjaxService';

interface ISignInPageProps {}

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
        label: 'Password',
        name: 'password',
        value: null,
        placeholder: '*******'
      },
      options: {
        mode: 'flat',
        secureTextEntry: true
      }
    },
  ]
}

const SignInPage: React.FunctionComponent<ISignInPageProps> = (props) => {
  const [formState, setFormState] = useState(null);
 
  useEffect(() => {
    setFormState(loginFormData);
  });

  const login = useCallback(async (data) => {
    const url = 'https://localhost:30001/posturl';
    try {
      const response = await AjaxService.Instance().Post(url, data);
      console.log(response);
    }
    catch(e){
      console.log(e)
    }
  }, []);

  return (
    <View style={base.container}>
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
    </View>
  );
};
export default SignInPage;