var dom = require('./dom');
var events = require('./events');

module.exports = function (form) {
    var initX, initY, mouse;
    var resizer = dom.div('resizer', form)
        .add('<svg viewBox="0 0 21 21"><path stroke="lightgray" d="M8,19 L19,8 M12,19 L19,12"/></svg>');
    events.listen(events.down, startResize, resizer);

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
