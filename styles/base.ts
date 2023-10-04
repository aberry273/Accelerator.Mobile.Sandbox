import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },  
  centered: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    // other CSS
    color: '#000'
  },
});