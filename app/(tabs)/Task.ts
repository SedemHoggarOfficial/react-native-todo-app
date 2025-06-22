// Task model
export default class Task {
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