import Component from '@glimmer/component';
import { computed } from '@ember/object';

export default class TodoFooterComponent extends Component {

  @computed('args.numCompleted')
  get noCompletedTodos() {
    return this.args.numCompleted === 0;
  }
}
