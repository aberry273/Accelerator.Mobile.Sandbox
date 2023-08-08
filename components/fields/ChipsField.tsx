import React from 'react';
import { TextInput, Chip, Button  } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface IAclFormFieldProps {
  data: object;
  options: object;
  change: () => void;
}
///DEPERECHATED by ChipField
const ChipsField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [textValue, setTextValue] = React.useState('');
  const [value, setValue] = React.useState([]);
  const [label, setLabel] = React.useState('');

  const onChipChange = (i, text) => {
    console.log('chipChange');
  }

  const addChip = (text) => {
    const arr = value ?? [];
    arr.push(text);
    setValue(arr);
    props.change(arr);
  }

  React.useEffect(() => {
    console.log('change ChipsField')
    console.log(props.data.value)
    if(props.data.label != null)
      setLabel(props.data.label);
    if(props.data.value != null) {
      setValue(props.data.value);
      console.log('set undefined')
    }
  }, [props]);

  const renderChips = () => {
    const fields = [];
    if (value == null) return;
    for (let i = 0; i < value.length; i++) {
        const chip = value[i];
        //create element or error element
        const element =  React.createElement(
            Chip,
            {
              key: `${i}.${chip}`,
              icon: 'information',
              onPress: (data) => { onChipChange(i, chip) }
            },
            chip
          )
        // Try avoiding the use of index as a key, it has to be unique!
        fields.push(element);
    }
    return fields;
  };


  return (
    <View style={[styles.container ]}>
      <TextInput style={[styles.padding, props.options.hide ? styles.hide : styles.show]}
          mode={props.options.mode ?? 'view'}
          name={props.data.name}
          label={props.data.label}
          placeholder={props.data.placeholder}
          dense={props.options.dense}
          multiline={props.options.multiline}
          numberOfLines={props.options.numberOfLines}
          left={props.options.left}
          disabled={props.options.disabled}
          error={props.options.error}
          
          selectionColor={props.options.selectionColor}
          cursorColor={props.options.cursorColor}
          underlineColor={props.options.underlineColor}
          activeUnderlineColor={props.options.activeUnderlineColor}
          outlineColor={props.options.outlineColor}
          textColor={props.options.textColor}
          activeOutlineColor={props.options.activeOutlineColor}
          right={<TextInput.Icon icon="information" />}

          value={textValue}
        />
        

        {
          value.map((chip, i) => (
            
            <Chip key={i} icon="information" onPress={() => console.log('Pressed')}>{chip}</Chip>
          ))
        }
        
    </View>
  
  );
};

export default ChipsField;

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