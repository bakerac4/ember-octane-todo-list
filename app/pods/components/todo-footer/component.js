import Component from '@glimmer/component';

export default class TodoFooterComponent extends Component {
  get noCompletedTodos() {
    return this.args.numCompleted === 0;
  }
}
