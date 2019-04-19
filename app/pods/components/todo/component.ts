import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { tryInvoke } from '@ember/utils';

export default class TodoComponent extends Component {
    @tracked isEditing = false;

    //Glimmer Components do not have a this.element (since they are tag-less,
    //and can have multiple top level elements) and they also don't have
    //lifecycle hooks like didInsertElement()/didRender(). In their place
    //we use modifiers like {{did-insert}} and {{did-update}} which pass
    //the element that was rendered as an argument to the handler
    focusInput(element) {
        element.querySelector('input').focus();
    }

    @action
    startEditing(event) {
        event.stopPropagation();
        this.isEditing = true;
    }

    @action
    stopEditing() {
        this.isEditing = false;
        tryInvoke(this.args, 'updateTodo', [this.args.todo]);
    }

    @action
    blurInput(event) {
        //focut out of the text input when Enter is pressed
        if (event.keyCode === 13) {
            event.target.blur();
        }
    }
}
