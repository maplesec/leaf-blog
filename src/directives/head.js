
import * as Headroom from '../../node_modules/headroom.js/dist/headroom';

export default {
    bind(el) {
        // construct an instance of Headroom, passing the element
        console.log("##", Headroom, el)
        var options = {
            offset: 50
        }
        var headroom  = new Headroom.default(el, options);
        // initialise
        headroom.init();
    }
}