import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { equal } from '@ember/object/computed';

export default class TodoHeaderComponent extends Component {
  @tracked newTodoDescription = '';

  //computed macros are still usable in octane, and encouraged where applicable
  //here the using the `equal()` macro is a bit more expressive and clean than
  //a native class getter as shown below
  @equal('args.numActive', 0) noActiveTodos;

  // get noActiveTodos() {
  //   return this.args.numActive === 0;
  // }

  //an example of using a getter to provide defaults for component arguments
  //all args in this.args are immutable, so you can not override/change them
  //when the component is instantiated
  get title() {
    return this.args.title || 'Todos';
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
