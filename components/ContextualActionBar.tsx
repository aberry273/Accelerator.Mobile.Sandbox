
import React, {useState, useCallback, useEffect } from 'react';
import {Appbar} from 'react-native-paper';

interface IContextualActionBarProps {
  title: string;
  onClose: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onSave: () => void;
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
      { props.title != null && <Appbar.Content title={props.title} /> }
      { props.onSave != null && <Appbar.Action icon='check' onPress={props.onSave} /> }
      { props.onEdit != null && <Appbar.Action icon='file-edit' onPress={props.onEdit} /> }
      { props.onDelete != null && <Appbar.Action icon='delete' onPress={props.onDelete} /> }
      { props.onCopy != null && <Appbar.Action icon='content-copy' onPress={props.onCopy} /> }
      { props.onMore != null && <Appbar.Action icon='dots-vertical' onPress={props.onMore} /> }
    </Appbar.Header>
  );
};
export default ContextualActionBar;