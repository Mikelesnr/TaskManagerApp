import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@env'; // Import the SERVER_URL from the .env file

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${SERVER_URL}/api/tasks/${taskId}`);
      fetchTasks(); // Refresh tasks list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'incomplete') return task.status === 'incomplete';
  });

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => navigation.navigate('Task', { taskId: item.id })}>
        <Text style={styles.taskText}>{item.title}</Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={() => deleteTask(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.homeText}>Home</Text>
      <View style={styles.filters}>
        <Button title="All" onPress={() => setFilter('all')} />
        <Button title="Completed" onPress={() => setFilter('completed')} />
        <Button title="Incomplete" onPress={() => setFilter('incomplete')} />
      </View>
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('Task')} style={styles.addButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20, // Added margin to create space around the Home text
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  taskItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskText: {
    flex: 1,
    marginRight: 10, // Adjusted margin to create more space between text and button
  },
  deleteButton: {
    marginLeft: 15, // Added margin to the left of the delete button
  },
  addButton: {
    marginTop: 20, // Added margin to move the Add Task button away from the bottom
  },
});

export default HomeScreen;
