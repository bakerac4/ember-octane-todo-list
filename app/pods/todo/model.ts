import DS from 'ember-data';
const { Model, attr } = DS;

export default class Todo extends Model {
    @attr('date') dateCreated!: Date;
    @attr('string') description!: string;
    @attr('boolean') isCompleted!: boolean;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        todo: Todo;
    }
}
