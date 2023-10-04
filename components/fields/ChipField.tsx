import React from 'react';
import { TextInput, Chip, Button  } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface IAclFormFieldProps {
  data: object;
  options: object;
  change: () => void;
}

const ChipField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [chips, setChips] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [label, setLabel] = React.useState('');

  const onChange = (text) => {
    setValue(text);
  }
  const onChipSelect = (i, text) => {

  }

  const removeChip = (index) => {
    const arr = chips.slice(0);
    arr.splice(index, 1);
    setChips(arr);
    props.change(arr);
  }

  const addChip = () => {
    const arr = chips.slice(0);
    arr.push(value); 
    setChips(arr);
    setValue('');
    props.change(arr);
  }

  React.useEffect(() => {
    setLabel(props.data.label);
    setValue('');
    const chips = props.data.value != null && props.data.value.length > 0 ? props.data.value.split(',') : [];
    setChips(chips);
  }, [props.data]);
 
  return (
    <View>
      <TextInput style={[styles.padding, props.options.hide ? styles.hide : styles.show]}
      
        mode={props.options.mode ?? 'view'}
        name={props.data.name}
        label={props.data.label}
        placeholder={props.data.placeholder}
        dense={props.options.dense}
        multiline={props.options.multiline}
        numberOfLines={props.options.numberOfLines}
        disabled={props.options.disabled}
        error={props.options.error}
        
        selectionColor={props.options.selectionColor}
        cursorColor={props.options.cursorColor}
        underlineColor={props.options.underlineColor}
        activeUnderlineColor={props.options.activeUnderlineColor}
        outlineColor={props.options.outlineColor}
        textColor={props.options.textColor}
        activeOutlineColor={props.options.activeOutlineColor}
        left={props.options.left}
        right={value && <TextInput.Icon icon="plus" onPress={addChip} />}

        value={value}

        onChangeText={text => onChange(text)}
      />
          <View style={[styles.container]}>
          {
            chips.map((chip, i) => (
              <Chip key={i +":"+ chip} onPress={() => onChipSelect} onClose={() => removeChip(i)} style={[styles.chip]}>{chip}</Chip>
            ))
          }
          </View>
      </View>
  );
};

export default ChipField;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
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