import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default class TodoHeaderComponent extends Component {
  @tracked newTodoDescription = '';

  @computed('args.numActive')
  get noActiveTodos() {
    return this.args.numActive === 0;
  }

  @action
  onInputKeydown(event) {
    //on enter add a new todo
    if(event.keyCode === 13 && !isBlank(this.newTodoDescription)) {
      this.args.addTodo(this.newTodoDescription.trim());
      this.newTodoDescription = '';
    }
  }
}
