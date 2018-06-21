import { Application } from './modules/application';

class App extends Application {}

new App().extend({
    sliders : {
        slider: {
            el: '.owl-carousel',
            driver: 'owl', // optional
            conditions () { return true }, // optional
            option: {
                items: 1
            }
        }
    },
    handlers: {
        "body:click" () { console.log('body click') },
        "document:click:apply" (e) { console.log(this) }
    },
    ready(){
    }
}).init();