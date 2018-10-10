
// import * as Headroom from '../../node_modules/headroom.js/dist/headroom';

export default {
    inserted(el) {
        const Headroom = require('headroom.js')
        var options = {
            offset: 50
        }
        // construct an instance of Headroom, passing the element
        var headroom  = new Headroom(el, options);
        // var headroom  = new Headroom.default(el, options);
        // initialise
        headroom.init();
    }
}