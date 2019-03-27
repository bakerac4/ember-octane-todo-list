import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { all } from 'rsvp';

export default class TodoListComponent extends Component {
  @service store;
  @service paperToaster;

  //just a normal class property that wont change, so no need to @track it
  title = 'Todo List';

  //mutating these properties need to cause the UI to update, so we @track them
  @tracked todos = [];
  @tracked isLoadingTodos = false;
  @tracked isSaving = false;
  @tracked selectedFilter = 'ALL';

  //in most cases native class getters are used in place of ember computed properties
  get numCompleted() {
    return this.todos.filterBy('isCompleted', true).length;
  }

  get numActive() {
    return this.todos.filterBy('isCompleted', false).length;
  }

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

  //init() is no more, and in most cases would be replaced by
  //overriding the native class constructor()
  //https://octane-guides-preview.emberjs.com/release/components/defining-a-component/#toc_component-hooks-and-properties
  constructor(owner, args) {
    super(owner, args);
    this.loadTodos();
  }

  async loadTodos() {
    try {
      //we dont need to use set() when updating @tracked properties! :party:
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

  //actions no longer go in an `actions: {}` hash, but instead are decorated w/@action
  //@action simply binds the method's context to `this`, and enables the method to be
  //usable in the template via `this.removeTodo` and allows it to be passed into child components
  @action
  removeTodo(todo) {
    //you can still use methods from ember's Array class that extends the native Array prototype
    //for convenience, but they are no longer necesssary on @tracked properties
    this.todos.removeObject(todo);
    todo.deleteRecord();
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    this.paperToaster.show('Todo has been removed.');
    return this.saveChanges([todo]);
  }

  @action
  updateTodo(todo) {
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    this.paperToaster.show('Todo description has been updated.');
    return this.saveChanges([todo]);
  }

  @action
  toggleTodo(todo, isCompleted) {
    //`todo` is an ember data model, which still requires `set()` usage
    //as it applies its own custom logic when updating attribute values
    todo.set('isCompleted', isCompleted);
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    this.paperToaster.show(`Todo has been marked ${isCompleted ? 'completed' : 'incomplete'}.`);
    return this.saveChanges([todo]);
  }

  @action
  completeAll() {
    const todos = this.todos.filterBy('isCompleted', false);
    todos.forEach(todo => todo.set('isCompleted', true));
    //trigger an update for the todos array (see addTodo() above)
    this.todos = this.todos;
    this.paperToaster.show('Active todos have been marked completed.');
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
    this.paperToaster.show('Completed todos have been removed.');
    return this.saveChanges(todos);
  }
}
