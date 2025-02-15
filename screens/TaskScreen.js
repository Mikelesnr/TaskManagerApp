import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { SERVER_URL } from '@env'; // Import the SERVER_URL from the .env file

const TaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params || {};
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [taskStatus, setTaskStatus] = useState('incomplete');

  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        try {
          const response = await axios.get(`${SERVER_URL}/api/tasks/${taskId}`);
          const task = response.data;
          setTaskTitle(task.title);
          setTaskDetails(task.details || '');
          setTaskStatus(task.status);
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      }
    };
    fetchTask();
  }, [taskId]);

  const saveTask = async () => {
    try {
      if (taskId) {
        await axios.put(`${SERVER_URL}/api/tasks/${taskId}`, {
          title: taskTitle,
          details: taskDetails,
          status: taskStatus,
        });
      } else {
        await axios.post(`${SERVER_URL}/api/tasks`, {
          title: taskTitle,
          details: taskDetails,
          status: taskStatus,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Task Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Details"
        value={taskDetails}
        onChangeText={setTaskDetails}
      />
      <Picker
        selectedValue={taskStatus}
        style={styles.picker}
        onValueChange={(itemValue) => setTaskStatus(itemValue)}
      >
        <Picker.Item label="Incomplete" value="incomplete" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>
      <Button title="Save Task" onPress={saveTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightcoral',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default TaskScreen;
