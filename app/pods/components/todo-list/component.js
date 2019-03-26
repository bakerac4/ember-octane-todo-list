import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoListComponent extends Component {
  @service store;

  title = 'Todo List';
  @tracked todos = [];
  @tracked isLoading = false;
  @tracked selectedFilter = 'ALL';

  constructor(owner, args) {
    super(owner, args);
    this.loadTodos();
  }

  async loadTodos() {
    try {
      this.isLoading = true;
      const todos = await this.store.findAll('todo', {reload: true});
      this.todos = todos.toArray();
      this.isLoading = false;
    } catch(error) {
      this.todos = [];
      this.isLoading = false;
    }
  }

  @action
  async addTodo(description) {
    const todo = await this.store.createRecord('todo', {
      description,
      isCompleted: false,
      dateCreated: new Date()
    });

    this.todos.pushObject(todo);
    return todo.save();
  }

  @action
  removeTodo(todo) {
    this.todos.removeObject(todo);
    return todo.destroyRecord();
  }

  @action
  toggleTodo(todo, isCompleted) {
    todo.set('isCompleted', isCompleted);
    return todo.save();
  }

  @action
  completeAll() {
    this.todos.forEach(todo => {
      todo.set('isCompleted', true);
      todo.save();
    });
  }

  @action clearCompleted() {
    this.todos.filterBy('isCompleted', true).forEach(todo => {
      this.todos.removeObject(todo);
      todo.destroyRecord();
    });
  }
}
