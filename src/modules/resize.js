var dom = require('./dom');
var events = require('./events');

module.exports = function (form) {
    var initX, initY, mouse;

    events.listen(events.down, startResize, dom.div('resizer', form)
        .add(dom.svg(21, "M8,19 L19,8 M12,19 L19,12")));

    function startResize(event) {
        initX = form.clientWidth;
        initY = form.clientHeight;
        mouse = events.evt(event);
        events.addMoveEvent(resizeElement);
    }

    function resizeElement(event) {
        var current = events.evt(event);
        form.clampAndSet('height', initY + current.y - mouse.y, form.tinyform.minHeight, innerHeight - form.clientTop);
        form.clampAndSet('width', initX + current.x - mouse.x, form.tinyform.minWidth, innerWidth - form.clientLeft);
        form.update();
    }
};
