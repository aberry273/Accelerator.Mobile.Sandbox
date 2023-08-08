import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { ToDoItemComponent } from '../components/ToDoItem';
import { ToDoItem } from '../models';
import {
  getDBConnection, getTodoItems, saveTodoItems, createTable, getTableName, getColName, deleteTable, clearTable, deleteTodoItem } from '../services/todo-db-service';
import uuid from 'react-native-uuid';

interface IToDoPageProps {}

const ToDoPage: React.FunctionComponent<IToDoPageProps> = (props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const loadDataCallback = useCallback(async () => {
    try {
      console.log('-------------loadDataCallback--------------')
      const db = getDBConnection();
      createTable(db, (result) => { console.log('createTable.end'); });
      getTodoItems(db , (result) => { 
        if(result.length) {
          setTodos(result);
        } else {
          console.log('empty');
        }
      })
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
    
      const newTodoItem = {
        id: uuid.v4(),
        value: newTodo
      };

      const db = getDBConnection();
      saveTodoItems(db, [newTodoItem], (res) => {
        const joined = [...todos, newTodoItem]
        setTodos(joined);
      });
      
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: string) => {
    try {;
      const db = getDBConnection();
      deleteTodoItem(db, id, (res) => {
        const index = todos.map(x => x.id).indexOf(id);
        todos.splice(index, 1);
        setTodos(todos.slice(0));
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.appTitleView]}>
          <Text style={styles.appTitleText}> ToDo Application </Text>
        </View>
        <View>
          {todos.map((todo) => (
            <ToDoItemComponent key={todo.id} todo={todo} deleteItem={() => deleteItem(todo.id) } />
          ))}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput style={styles.textInput} value={newTodo} onChangeText={text => setNewTodo(text)} />
          <Button
            onPress={addTodo}
            title="Add ToDo"
            color="#841584"
            accessibilityLabel="add todo item"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800'
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end'
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    margin: 10,
    backgroundColor: 'pink'
  },
});
export default ToDoPage;