import * as React from 'react';
import { Switch, Text,  } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

interface IAclFormFieldProps {
  data: object;
  options: object;
  change: () => void;
}
// Location
const getLocation = async (data) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    //setErrorMsg('Permission to access location was denied');
    return;
  }
  return await Location.getCurrentPositionAsync({});
};


const LocationSwitchField: React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [switchToggle, setSwitchToggle] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [label, setLabel] = React.useState('');

  const onChange = async (change) => {
    setSwitchToggle(change);
    if(change) {
      const location = await getLocation();
      setValue(location);
      props.change(location);
    } else {
      setValue(null);
      props.change(null);
    }
  }

  React.useEffect(() => {
    setLabel(props.data.label);
    setValue(props.data.value);
  }, []);
  

  return (
    <View style={[styles.switchContainer, props.options.hide ? styles.hide : styles.show]}>
      <Text style={styles.padding}>{label}</Text>
      <Switch style={styles.padding} value={switchToggle} onValueChange={onChange}></Switch>
      <Text style={styles.padding}>{switchToggle ? 'Set' : 'Empty'}</Text>
    </View>
  );
};

export default LocationSwitchField;

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