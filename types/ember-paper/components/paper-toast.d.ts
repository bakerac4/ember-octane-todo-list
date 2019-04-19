import Component from '@ember/component';

declare module 'ember-paper/components/paper-toast' {
    export default class PaperToast extends Component {
        escapeToClose: boolean;
        swipeToClose: boolean;
        capsule: boolean;
        duration: number;
        position: string;

        formatRelative(name: string): any;
        formatMessage(name: string): any;
        formatNumber(name: string): any;
        formatTime(name: string): any;
        formatDate(name: string): any;

        init(): VoidFunction;
        willDestroy(): VoidFunction;

        lookup(key: string, localeName: string, options: object): object;
        t(key: string, options: object): string;
        setLocale(name: string): VoidFunction;
    }
}
