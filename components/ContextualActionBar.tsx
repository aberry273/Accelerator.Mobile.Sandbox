
import React, {useState, useCallback, useEffect } from 'react';
import {Appbar} from 'react-native-paper';

interface IContextualActionBarProps {
  title: string;
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onZoom: () => void;
  onMore: () => void;
}

const ContextualActionBar: React.FunctionComponent<IContextualActionBarProps> = (
  props
) => {
  //<Appbar.Action icon='magnify' onPress={props.onZoom} />
  return (
    <Appbar.Header {...props} style={{width: '100%'}}>
      <Appbar.Action icon='close' onPress={props.onClose} />
      <Appbar.Content title={props.title} />
      <Appbar.Action icon='delete' onPress={props.onDelete} />
      <Appbar.Action icon='content-copy' onPress={props.onCopy} />
      
      <Appbar.Action icon='dots-vertical' onPress={props.onMore} />
    </Appbar.Header>
  );
};
export default ContextualActionBar;