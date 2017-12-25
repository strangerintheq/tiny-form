var dom = require('./dom');
var events = require('./events');

module.exports = function (scroll) {
    var start;
    var viewport = dom.div('viewport', scroll);
    var track = dom.div('track', scroll);
    var knob = dom.div('knob', track);
    var content = dom.div('scroll-content', viewport);
    content.update = update;
    scroll.addEventListener('mousewheel', onWheel);
    events.listen(events.down, onMouseDown, knob);
    return content;

    function update() {
        var K = k();
        knob.style.height = (K < 1 ? K * scroll.offsetHeight : 0) + "px";
        knob.style.top = viewport.scrollTop * K + "px";
    }

    function onMouseMove(e) {
        e = events.evt(e);
        var pos = Math.clamp(start + e.y, 0, viewport.offsetHeight - knob.offsetHeight);
        viewport.scrollTop = pos / k();
        knob.style.top = pos + "px";
    }

    function onMouseDown(e) {
        e = events.evt(e);
        start = knob.offsetTop - e.y;
        track.class('active');
        events.addMoveEvent(onMouseMove, onMouseUp);
    }

    function onMouseUp() {
        track.class('active', true);
    }

    function onWheel(e) {
        viewport.scrollTop += e.deltaY;
        knob.style.top = viewport.scrollTop * k() + "px";
        e.preventDefault();
    }

    function k() {
        return scroll.offsetHeight / content.offsetHeight;
    }
};