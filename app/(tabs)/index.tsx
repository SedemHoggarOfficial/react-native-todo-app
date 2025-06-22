import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Task class (OOP style)
class Task {
  id: string;
  title: string;
  completed: boolean;

  constructor(id: string, title: string, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Load tasks from AsyncStorage on start
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem('@tasks');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Rehydrate class instances
          const loadedTasks = parsed.map((t: any) => new Task(t.id, t.title, t.completed));
          setTasks(loadedTasks);
          //console.log('Loaded tasks:', loadedTasks);
        }
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to AsyncStorage when they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
        //console.log('Saved tasks:', tasks);
      } catch (e) {
        console.error('Failed to save tasks', e);
      }
    };

    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (taskTitle.trim() === '') return;
    const newTask = new Task(Date.now().toString(), taskTitle);
    setTasks([...tasks, newTask]);
    setTaskTitle('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === id ? new Task(task.id, task.title, !task.completed) : task
      )
    );
  };

  const renderItem = ({ item }: { item: Task }) => {
    const isEditing = editingTaskId === item.id;

    return (
      <View style={styles.taskItem}>
        {/* Toggle complete */}
        <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.toggleButton}>
          <Text style={[styles.toggleButtonText, item.completed && styles.completedCheck]}>
            {item.completed ? '✓' : ''}
          </Text>
        </TouchableOpacity>

        {/* Title or Editable TextInput */}
        <View style={{ flex: 1 }}>
          {isEditing ? (
            <TextInput
              style={[styles.taskText, styles.editInput]}
              value={editingTitle}
              onChangeText={setEditingTitle}
              onSubmitEditing={() => {
                const updated = tasks.map(task =>
                  task.id === item.id
                    ? new Task(task.id, editingTitle, task.completed)
                    : task
                );
                setTasks(updated);
                setEditingTaskId(null);
              }}
              onBlur={() => setEditingTaskId(null)}
              autoFocus
            />
          ) : (
            <TouchableOpacity
              onLongPress={() => {
                setEditingTaskId(item.id);
                setEditingTitle(item.title);
              }}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Delete button */}
        <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={taskTitle}
          onChangeText={setTaskTitle}
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  toggleButtonText: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
  },
  completedCheck: {
    color: '#28a745',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
  editInput: {
    borderBottomWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 2,
    fontSize: 16,
    color: '#222',
  },

});