import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Task model
class Task {
  id: string;
  title: string;
  completed: boolean;
  isEditing: boolean;

  constructor(id: string, title: string, completed = false, isEditing = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.isEditing = isEditing;
  }
}

const STORAGE_KEY = '@tasks';

const TodoApp: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');

  // Load tasks from storage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          const loadedTasks = parsed.map(
            (t: any) => new Task(t.id, t.title, t.completed, t.isEditing)
          );
          setTasks(loadedTasks);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load tasks.');
      }
    };
    loadTasks();
  }, []);

  // Save tasks to storage
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        Alert.alert('Error', 'Failed to save tasks.');
      }
    };
    saveTasks();
  }, [tasks]);

  // Add a new task
  const addTask = useCallback(() => {
    if (taskTitle.trim() === '') return;
    const newTask = new Task(Date.now().toString(), taskTitle.trim());
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => [...prev, newTask]);
    setTaskTitle('');
  }, [taskTitle]);

  // Remove a task
  const removeTask = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // Toggle task completion
  const toggleTask = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? new Task(task.id, task.title, !task.completed, task.isEditing)
          : task
      )
    );
  }, []);

  // Start editing a task
  const editTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, isEditing: true }
          : { ...task, isEditing: false }
      )
    );
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setTasks(prev => prev.map(task => ({ ...task, isEditing: false })));
    Keyboard.dismiss();
  }, []);

  // Update a task's title
  const updateTask = useCallback((id: string, newTitle: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? new Task(task.id, newTitle.trim(), task.completed, false)
          : task
      )
    );
  }, []);

  // Render each task item
  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <Animatable.View
        animation="fadeInUp"
        duration={400}
        style={styles.animatedWrapper}
      >
        <View style={styles.taskItem}>
          <TouchableOpacity onPress={() => toggleTask(item.id)}>
            <Ionicons
              name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={item.completed ? '#28a745' : '#007bff'}
              style={styles.checkIcon}
            />
          </TouchableOpacity>
          {item.isEditing ? (
            <TextInput
              value={item.title}
              onChangeText={text => updateTask(item.id, text)}
              onSubmitEditing={() => updateTask(item.id, item.title)}
              style={[styles.taskTextInput, { fontFamily: 'Poppins_400Regular' }]}
              autoFocus
              blurOnSubmit
              returnKeyType="done"
            />
          ) : (
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedText,
              ]}
              onLongPress={() => editTask(item.id)}
            >
              {item.title}
            </Text>
          )}
          {item.isEditing && (
            <TouchableOpacity onPress={cancelEdit} style={styles.iconButton}>
              <Ionicons name="close" size={18} color="#888" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => editTask(item.id)} style={styles.iconButton}>
            <Ionicons name="pencil" size={18} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.iconButton}>
            <Ionicons name="trash" size={18} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    ),
    [toggleTask, updateTask, editTask, cancelEdit, removeTask]
  );

  if (!fontsLoaded) return <AppLoading />;

  return (
    <TouchableWithoutFeedback onPress={cancelEdit}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.heading}>My Tasks</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task"
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor="#888"
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={addTask} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet.</Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

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
    fontFamily: 'Poppins_600SemiBold',
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
    fontFamily: 'Poppins_400Regular',
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  animatedWrapper: {
    overflow: 'hidden',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  checkIcon: {
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Poppins_400Regular',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskTextInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 2,
    color: '#222',
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
});

export default TodoApp;