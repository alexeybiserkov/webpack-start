import 'jquery';

import 'owl.carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';

class Application {
    constructor(){
       this.badBrowser = null;
       this.handlers = {};
       this.sliders = {};
    }
    checkBadBrowser () {
        if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            $('html').addClass('badBrowser');
            return this.badBrowser = true;
        } else {
            return this.badBrowser = false;
        }
    }
    regHandlers ( obj ) {
        for (let key in obj) {
            let param = key.split(':');
            let el = param[0];
            let event = param[1];
            let func = obj[key];
            if (event === 'click' && this.badBrowser) $(el).attr('onclick', "void(0)"); //Fix event bug for IOS
            if ( !!param[2] ) {
                if( el === 'document' ) $(document).on(event, (...args) => { func.apply(this, args) });
                else $(document).on(event, el, (...args) => { func.apply(this, args) });
            }
            else {
                if( el === 'document' ) $(document).on(event, func );
                else $(document).on(event, el, func );
            }

        }
    }
    extend ( obj ) {
        if (typeof obj === 'object' && !!obj.length) return console.error('Application extend error: type must be object');
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) this[key] = obj[key];
        }
        return this;
    }
    initSliders () {
        let options = {
            driver: 'owl',
            condition () {return true}
        };
        let sliders = this.sliders || {};
        for (let name in sliders) {
            let slider = sliders[name];
            let driver = slider.driver || options.driver;
            let condition = slider.condition || options.condition;
            try {
                switch (driver) {
                    case 'slick' :
                        if( condition() ) $(slider.el).slick(slider.options);
                        break;
                    case 'owl' :
                        if( condition() ) $(slider.el).owlCarousel(slider.options);
                        break;
                    default:
                        console.warn('Slider plugin: ' + driver + ' --- app doesn\'t know how to run slider with ' + driver + ' driver');
                        break;
                }
            } catch (err) {
                console.log('init Slider error: ' + err.message);
            }
        }
    }
    init () {
        $(document).ready( () => {
            this.checkBadBrowser();
            this.regHandlers(this.handlers);
            this.initSliders();
            this.ready();
            this.helpers().replaceImage($('[img-replace-container] img'));
            $('[height-align-container]').each( () => {
                this.helpers().heightAlign($('[height-align-item]'));
            })
        })
    }
    helpers () {
        return {
            detectMaxHeight($array){
                let max = 0;
                $array.each(function () {
                    let height = parseInt( $(this).css('height') );
                    if (height > max) max = height;
                });
                return max;
            },
            heightAlign($array){
                let max = this.detectMaxHeight($array);
                $array.css('minHeight', max);
            },
            replaceImage($imgs){
                $.each( $imgs, function(){
                    var $img = $(this);
                    if ( $img.hasClass('replaced') ) return;
                    var src = $img.attr('src');
                    $img.addClass('replaced').hide().wrap('<div class="__replace_image" style="background-image: url('+ src +')"></div>');
                });
            }
        }
    }
    ready () {
        console.log('Application ready', this)
    }
}
class Cookie {
    get ( name ) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : false;
    }
    set (name, value, options) {
        options = options || {};

        let expires = options.expires;

        if (typeof expires === "number" && expires) {
            let d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) options.expires = expires.toUTCString();

        value = encodeURIComponent(value);

        let updatedCookie = name + "=" + value;

        for (let propName in options) {
            updatedCookie += "; " + propName;
            let propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
        $('body').trigger('set_cookie');

        return this;
    }
}


export {
    Application,
    Cookie
}

export default Application