import EmberObject from '@ember/object';
import PaperToast from 'ember-paper/components/paper-toast';
import Service from '@ember/service';

declare module 'ember-paper/services/paper-toaster' {
    export default class intl extends Service {
        show(text: string, options: any): EmberObject;
        showComponent(componentName: string, options: any): EmberObject;
        cancelToast(toast: PaperToast): void;
        buildOptions(options: any): any;
    }
    // showComponent(componentName, options) {
    //   let t = EObject.create(assign({ componentName, show: true }, this.buildOptions(options)));
    //   this.get('queue').pushObject(t);
    //   return t;
    // },
    //
    // cancelToast(toast) {
    //   toast.set('show', false);
    //
    //   if (this.get('activeToast') === toast) {
    //     run.later(() => {
    //       tryInvoke(toast, 'onClose');
    //       this.get('queue').removeObject(toast);
    //     }, 400);
    //   } else {
    //     tryInvoke(toast, 'onClose');
    //     this.get('queue').removeObject(toast);
    //   }
    // },
    //
    // buildOptions(options) {
    //   let toasterOptions = {};
    //   if (config['ember-paper'] && config['ember-paper']['paper-toaster']) {
    //     toasterOptions = config['ember-paper']['paper-toaster'];
    //   }
    //   return assign({}, DEFAULT_PROPS, toasterOptions, options);
    // }
}
