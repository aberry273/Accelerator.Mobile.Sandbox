import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import { FAB, Portal, Provider, Title, Text, Modal, Button, List } from 'react-native-paper';
import { TextField, TextVoiceField, SelectField, RadioButtonField, SwitchField, ImageField, ChipField, LocationToggleField, ToggleField } from '../fields';
import { IAclFormProps } from '.'

const FieldComponents = {
  TextField,
  TextVoiceField,
  SelectField,
  LocationToggleField,
  RadioButtonField,
  SwitchField,
  ImageField,
  ChipField,
  ToggleField
}

const AclForm: React.FunctionComponent<IAclFormProps> = (
  props
) => {
  //JSON object holding all updates to the form fields
  const [formData, setFormData] = useState({});
  const [renderIndex, setRenderIndex] = useState(0);

  useEffect (() => {
    
    if(props.data == null) return;
    for(var i = 0; i < props.data.fields.length; i++) {
      const field = props.data.fields[i];
      const fieldName = field.data.name;
      if (field.data.value === null || field.data.value === 'undefined')
        continue;
      else if (field.component == 'ChipField' && field.data.value) {
        formData[fieldName] = field.data.value.split(',');
      } else {
        formData[fieldName] = field.data.value;
      }
    }
    setFormData(formData);
  }, [props])
 
  const updateFormData = useCallback((field, data) => {
      const fieldName = field.data.name;
      formData[fieldName] = data;
      setFormData(formData);
  }, [formData]);

  const onFieldChange = useCallback((field, data) => {
    updateFormData(field, data);
    // if the field has a change function, emit the change to the form
    if (typeof field.change === 'function') {
      field.change(field, data);
    }
  }, [formData]);

  const submitForm = useCallback(() => {
    //submit data
    props.submit(formData);
  }, []);
  
  // Need to figure out how to pass prop updates (downward updates), while also holding onto updated changes from form fields (updwards updates)
  const renderFields = () => {
    const fields = [];
    if (props.data == null || props.data.fields == null) return;
    for (let i = 0; i < props.data.fields.length; i++) {
        const field = props.data.fields[i];
        //create element or error element
        const element = (typeof FieldComponents[field.component] !== "undefined")
          ? React.createElement(FieldComponents[field.component], {
            key: `${i}.${field.data.name}.${field.key}`,
            change: (data) => { onFieldChange(field, data) },
            data: field.data,
            options: field.options,
            style: 'marginTop: 2'
          })
          : React.createElement(FieldComponents[0], {
            key: `${i}.null`,
            change: (data) => {onFieldChange(field, data) },
            data: field.data,
            options: field.options,
            style: 'marginTop: 2'
          })
        // Try avoiding the use of index as a key, it has to be unique!
        fields.push(element );
    }
    return fields;
  };

  return (
    <View key={renderIndex} style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      margin: 8
    }}>
        {renderFields()}
        <Button title="Add" onPress={submitForm}>Submit</Button>
    </View>
  );
};
export default AclForm;