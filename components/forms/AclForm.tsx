import React, {useState, useCallback, useEffect } from 'react';
import {View} from 'react-native';
import { FAB, Portal, Provider, Title, Text, Modal, Button, List } from 'react-native-paper';
import { TextField, SelectField, RadioButtonField, SwitchField, ChipsField, ChipField, LocationToggleField, ToggleField } from '../fields';

const FieldComponents = {
  TextField,
  SelectField,
  LocationToggleField,
  RadioButtonField,
  SwitchField,
  ChipsField,
  ChipField,
  ToggleField
}

interface IAclFormFieldProps {
  data: object;
  key: number,
  options: object;
  change: () => void;
}

interface IAclFormDataProps {
  fields: Array<IAclFormFieldProps>;
  submit: () => void;
}
interface IAclFormProps {
  title: string;
  data: IAclFormDataProps;
  options: object;
  fields: Array<IAclFormFieldProps>;
  submit: () => void;
}

const AclForm: React.FunctionComponent<IAclFormProps> = (
  props
) => {
  //JSON object holding all updates to the form fields
  const [formData, setFormData] = useState({});
  const [renderIndex, setRenderIndex] = useState(0);

  useEffect (() => {
    console.log('On Prop Change');
    setFormData(formData);
  }, [props])
 
  const updateFormData = useCallback((field, data) => {
      const fieldName = field.data.name.toLowerCase();
      formData[fieldName] = data;
      setFormData(formData);
  }, [formData]);

  const onFieldChange = useCallback((field, data) => {
    updateFormData(field, data);
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
            options: field.options
          })
          : React.createElement(FieldComponents[0], {
            key: `${i}.null`,
            change: (data) => {onFieldChange(field, data) },
            data: field.data,
            options: field.options
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
      justifyContent: 'flex-center',
      margin: 8
    }}>
        {renderFields()}
        <Button title="Add" onPress={submitForm}>Submit</Button>
    </View>
  );
};
export default AclForm;