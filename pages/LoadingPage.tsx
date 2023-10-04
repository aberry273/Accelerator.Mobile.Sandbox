import React from 'react';
import {View} from 'react-native';
import {Title} from 'react-native-paper';
import base from '../styles/base';

interface ILoadingProps {}

const LoadingPage: React.FunctionComponent<ILoadingProps> = (props) => {
  return (
    <View style={base.centered}>
      <Title>Loading</Title>
    </View>
  );
};
export default LoadingPage;