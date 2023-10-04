import React from 'react';
import { TextInput, Chip, Button  } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

interface IAclFormFieldProps {
  data: object;
  options: object;
  change: () => void;
}
///DEPERECHATED by ChipField
const ImageField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [textValue, setTextValue] = React.useState('');
  const [value, setValue] = React.useState([]);
  const [label, setLabel] = React.useState('');

  const onChipChange = (i, text) => {
    console.log('imageChange');
  }

  const addChip = (text) => {
    const arr = value ?? [];
    arr.push(text);
    setValue(arr);
    props.change(arr);
  }

  React.useEffect(() => {
    console.log('change ImageField')
    console.log(props.data.value)
    if(props.data.label != null)
      setLabel(props.data.label);
    if(props.data.value != null) {
      setValue(props.data.value);
      console.log('set undefined')
    }
  }, [props]);

  return (
    <View style={[styles.container ]}>
      <TextInput style={[styles.hide]}
          mode={props.options.mode ?? 'view'}
          name={props.data.name}
          label={props.data.label}
          placeholder={props.data.placeholder}
          value={props.data.value}
        />

        <FastImage
          source={{uri: "https://placehold.co/600x400" }}
          resizeMode={
            FastImage.resizeMode.contain
          }
        />
        
    </View>
  
  );
};

export default ImageField;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
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