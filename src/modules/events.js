var evts = module.exports = {
    move: ['mousemove', 'touchmove'],
    up: ['mouseup', 'touchend'],
    down: ['mousedown', 'touchstart']
};

evts.addMoveEvent = function addMoveEvent(func, endFunc) {

    evts.listen(evts.move, func);
    evts.listen(evts.up, endMove);

    function endMove() {
        evts.listen(evts.move, func, window, true);
        evts.listen(evts.up, endMove, window, true);
        endFunc && endFunc();
    }
};

evts.listen = function (eventNames, func, target, remove) {
    eventNames.forEach(function (name) {
        (target || window)[(remove ? 'remove' : 'add') + 'EventListener'](name, func);
    });
};

evts.evt = function (e) {

    if (e.touches)
        e = e.touches[0];

    return {
        x: e.clientX,
        y: e.clientY
    }
};