var dom = require('./dom');

module.exports = function (form, activeDragZone) {
    var init = {}, mouse;
    dom.addListeners(['mousedown', 'touchstart'], startDrag, activeDragZone || form);

    function startDrag(event) {
        init.x = form.offsetLeft;
        init.y = form.offsetTop;
        mouse = dom.evt(event);
        dom.addListeners(['mousemove', 'touchmove'], repositionElement);
        dom.addListeners(['mouseup', 'touchend'], dom.mouseUp.bind(null, repositionElement));
    }

    function repositionElement(event) {
        var current = dom.evt(event);
        form.clampAndSet('left', init.x + current.x - mouse.x, 0, window.innerWidth  - form.offsetWidth);
        form.clampAndSet('top', init.y + current.y - mouse.y, 0, window.innerHeight  - form.offsetHeight);
    }
};
