import * as React from 'react';
import { Switch, Text,  } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface IAclFormFieldProps {
  data: object;
  options: object;
  change: () => void;
}

const SwitchField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [value, setValue] = React.useState(false);
  const [label, setLabel] = React.useState('');

  const onChange = (change) => {
    props.change(change);
    setValue(change);
  }

  React.useEffect(() => {
    console.log('useEffect Swtich '+props.data.value);
    setLabel(props.data.label);
    setValue(props.data.value);
  }, []);
  

  return (
    <View style={[styles.switchContainer, props.options.hide ? styles.hide : styles.show]}>
      <Text style={styles.padding}>{label}</Text>
      <Switch style={styles.padding} value={value} onValueChange={onChange}></Switch>
    </View>
  );
};

export default SwitchField;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: "center"
  },
  switchContainer: {
    padding: 4,
    flexDirection: "row", 
    alignItems: "center",
  },
  switch: {
    marginLeft: 10
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