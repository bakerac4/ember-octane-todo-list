import DS from 'ember-data';
const { Model, attr } = DS;

export default class TodoModel extends Model {
  //attributes
  @attr('date') dateCreated;
  @attr('string') description;
  @attr('boolean') isCompleted;
}
