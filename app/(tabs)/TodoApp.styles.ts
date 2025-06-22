import {StyleSheet,} from 'react-native';

export const styles = StyleSheet.create({
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