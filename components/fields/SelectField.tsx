import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Chip, Menu, Divider, PaperProvider } from 'react-native-paper';

interface IAclSelectFieldDataProps {
  label: string;
  placeholder: string;
  value: string;
  items: [];
}

interface IAclFormFieldProps {
  data: IAclSelectFieldDataProps;
  options: object;
  change: () => void;
}

const SelectField : React.FunctionComponent<IAclFormFieldProps> = (
  props
) => {
  const [items, setItems] = React.useState([]);
  const [value, setValue] = React.useState('');
  const [textValue, setTextValue] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [placeholder, setPlaceholder] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const openMenu = () => setModalVisible(true);

  const closeMenu = () => setModalVisible(false);

  const itemIsObject = (item) => {
    if (item === null) { return false;}
    return ( (typeof item === 'function') || (typeof item === 'object') );
  }

  const getItemValue = (item) => {
    if(item == null) return null;
    const value = itemIsObject(item) ? item.value : item;
    return value;
  }

  const getItemKey = (item) => {
    if(item == null) return null;
    const value = itemIsObject(item) ? item.key : item;
    return value;
  }

  const onChange = (item) => {
    //props.change(getItemValue(item));
    props.change(getItemKey(item));
    
    setValue(getItemKey(item));
    setTextValue(getItemValue(item));
   
    closeMenu();
  }
 
  React.useEffect(() => {
    setLabel(props.data.placeholder || props.data.label || props.data.name);
    setPlaceholder(props.data.placeholder);
   
    const value = getItemValue(props.data.value);
    setValue(value);
    if (props.data.items != null)
      setItems(props.data.items || []);
      //Set friendly label

      const item = props.data.items != null ? props.data.items.filter(x => x.key == value)[0] : null;
      setTextValue(getItemValue(item));
  }, []);
  

  return (
      
      <View style={[styles.switchContainer, props.options.hide ? styles.hide : styles.show]}>
      {
        value == null && <Chip style={[styles.chip]} icon="chevron-down" onPress={openMenu}>{label}</Chip>
      }
      {
        value != null && <Chip style={[styles.chip]} icon="chevron-down" onPress={openMenu}>{textValue}</Chip>
      }
      {
        //<TextInput onFocus={openMenu} placeholder={placeholder} label={label} style={[styles.padding, props.options.hide ? styles.hide : styles.show]} value={value}></TextInput>
      }
      <Menu
        visible={modalVisible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>{modalVisible}</Button>}>
          { (items.length > 0 && items[0].value) && 
              items
                .map((item, i) => (
                  <Menu.Item key={i} onPress={() => { onChange(item) }} title={item.value} />
                ))
          }
      </Menu>
    </View>
  );
};

export default SelectField;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: "center"
  },
  chip: {
    marginLeft: 8,
    padding: 4
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