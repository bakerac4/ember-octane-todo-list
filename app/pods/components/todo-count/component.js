import Component from '@glimmer/component';

export default class TodoCountComponent extends Component {
  get label() {
    return this.args.count === 1 ? 'item' : 'items';
  }
}
