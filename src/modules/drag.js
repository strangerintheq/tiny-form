var events = require('./events');

module.exports = function (form, activeDragZone) {
    var init = {}, mouse;
    (activeDragZone || form).style.cursor = 'move';
    events.listen(events.down, startDrag, activeDragZone || form);

    function startDrag(event) {
        init.x = form.offsetLeft;
        init.y = form.offsetTop;
        mouse = events.evt(event);
        events.addMoveEvent(repositionElement);
    }

    function repositionElement(event) {
        var current = events.evt(event);
        form.clampAndSet('left', init.x + current.x - mouse.x, 0, innerWidth - form.clientWidth);
        form.clampAndSet('top', init.y + current.y - mouse.y, 0, innerHeight - form.clientHeight);
    }
};
