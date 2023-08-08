import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface IAclFormFieldProps {
  data: object;
  options: object;
  change: () => void;
}

const TextField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [value, setValue] = React.useState('');
  const [label, setLabel] = React.useState('');

  const onChange = (text) => {
    setValue(text);
    props.change(text);
  }

  React.useEffect(() => {
    console.log('change textf')
    console.log(props.data.value)
    setLabel(props.data.label);
    setValue(props.data.value);
  }, [props]);

  return (
    <TextInput style={[styles.padding, props.options.hide ? styles.hide : styles.show]}
    
      mode={props.options.mode ?? 'view'}
      name={props.data.name}
      label={props.data.label}
      placeholder={props.data.placeholder}
      dense={props.options.dense}
      multiline={props.options.multiline}
      numberOfLines={props.options.numberOfLines}
      left={props.options.left}
      right={props.options.right}
      disabled={props.options.disabled}
      error={props.options.error}
      
      selectionColor={props.options.selectionColor}
      cursorColor={props.options.cursorColor}
      underlineColor={props.options.underlineColor}
      activeUnderlineColor={props.options.activeUnderlineColor}
      outlineColor={props.options.outlineColor}
      textColor={props.options.textColor}
      activeOutlineColor={props.options.activeOutlineColor}

      value={value}

      onChangeText={text => onChange(text)}
    />
  );
};

export default TextField;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: "center"
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