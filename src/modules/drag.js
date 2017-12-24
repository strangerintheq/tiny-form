var dom = require('./dom');

module.exports = function (form, activeDragZone) {
    var init = {}, mouse;
    (activeDragZone || form).style.cursor = 'move';
    dom.listen(['mousedown', 'touchstart'], startDrag, activeDragZone || form);

    function startDrag(event) {
        init.x = form.offsetLeft;
        init.y = form.offsetTop;
        mouse = dom.evt(event);
        dom.addMoveEvent(repositionElement);
    }

    function repositionElement(event) {
        var current = dom.evt(event);
        form.clampAndSet('left', init.x + current.x - mouse.x, 0, innerWidth - form.clientWidth);
        form.clampAndSet('top', init.y + current.y - mouse.y, 0, innerHeight - form.clientHeight);
    }
};
