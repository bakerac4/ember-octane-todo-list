import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TodoListComponent extends Component {
  @service store;

  @tracked todos = [];
  @tracked isLoading = false;

  constructor(owner, args) {
    super(owner, args);
    this.loadTodos();
  }

  async loadTodos() {
    try {
      this.isLoading = true;
      this.todos = await this.store.findAll('todo', {reload: true});
      this.isLoading = false;
    } catch(error) {
      this.todos = [];
      this.isLoading = false;
    }
  }
}
