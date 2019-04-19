// Types for compiled templates
declare module 'ember-octane-todo-list/templates/*' {
    import { TemplateFactory } from 'htmlbars-inline-precompile';
    const tmpl: TemplateFactory;
    export default tmpl;
}
