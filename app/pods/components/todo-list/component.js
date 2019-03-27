import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { all } from 'rsvp';

export default class TodoListComponent extends Component {
  @service store;

  title = 'Todo List';
  @tracked todos = [];
  @tracked isLoadingTodos = false;
  @tracked isSaving = false;
  @tracked selectedFilter = 'ALL';

  //using the @computed() decorator on getters is NOT necessary
  //as long as all properties accessed within are @tracked
  //(which they should be), but can be useful as a performance
  //optimization. basically @computed will cause the getter
  //value to be cached, instead of recomputed on every access
  @computed('todos', 'selectedFilter')
  get filteredTodos() {
    switch(this.selectedFilter) {
      case 'ACTIVE':
        return this.todos.filterBy('isCompleted', false);
      case 'COMPLETED':
        return this.todos.filterBy('isCompleted', true);
      default:
        return this.todos;
    }
  }

  get numCompleted() {
    return this.todos.filterBy('isCompleted', true).length;
  }

  get numActive() {
    return this.todos.filterBy('isCompleted', false).length;
  }

  constructor(owner, args) {
    super(owner, args);
    this.loadTodos();
  }

  async loadTodos() {
    try {
      this.isLoadingTodos = true;
      const todos = await this.store.findAll('todo', {reload: true});
      this.todos = todos.toArray();
      this.isLoadingTodos = false;
    } catch(error) {
      this.todos = [];
      this.isLoadingTodos = false;
    }
  }

  async saveChanges(todos) {
    try {
      this.isSaving = true;
      await all(todos.map(todo => todo.save()));
      this.isSaving = false;
    } catch(error) {
      this.isSaving = false;
    }
  }

  @action
  async addTodo(description) {
    const todo = await this.store.createRecord('todo', {
      description,
      isCompleted: false,
      dateCreated: new Date()
    });

    this.todos.push(todo);
    //trigger an update for the todos array
    //this is essentially the replacement for tracking individual tested array properties
    //via @each computed property syntax, e.g. `todos.@each.isCompleted` or `todos.[]`
    //https://octane-guides-preview.emberjs.com/release/state-management/tracked-properties/#toc_arrays
    this.todos = this.todos;
    return this.saveChanges([todo]);
  }

  @action
  removeTodo(todo) {
    this.todos.removeObject(todo);
    todo.deleteRecord();
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    return this.saveChanges([todo]);
  }

  @action
  toggleTodo(todo, isCompleted) {
    //`todo` is an ember data model, which still requires `set()` usage
    //as it applies its own custom logic when updating attribute values
    todo.set('isCompleted', isCompleted);
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    return this.saveChanges([todo]);
  }

  @action
  completeAll() {
    const todos = this.todos.filterBy('isCompleted', false);
    todos.forEach(todo => todo.set('isCompleted', true));
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    return this.saveChanges(todos);
  }

  @action
  clearCompleted() {
    const todos = this.todos.filterBy('isCompleted', true);
    todos.forEach(todo => {
      this.todos.removeObject(todo);
      todo.deleteRecord();
    });

    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    return this.saveChanges(todos);
  }
}
