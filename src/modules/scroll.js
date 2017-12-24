var dom = require('./dom');

module.exports = function (scroll) {
    var start;
    var viewport = dom().class('viewport').appendTo(scroll);
    var track = dom().class('track').appendTo(scroll);
    var knob = dom().class('knob').appendTo(track);
    var content = dom().class('scroll-content').appendTo(viewport);
    content.update = update;
    scroll.addEventListener('mousewheel', onWheel);
    dom.listen(['mousedown', 'touchstart'], onMouseDown, knob);
    return content;

    function update() {
        var K = k();
        knob.style.height = (K < 1 ? K * scroll.offsetHeight : 0) + "px";
        knob.style.top = viewport.scrollTop * K + "px";
    }

    function onMouseMove(e) {
        e = dom.evt(e);
        var pos = Math.clamp(start + e.y, 0, viewport.offsetHeight - knob.offsetHeight);
        viewport.scrollTop = pos / k();
        knob.style.top = pos + "px";
    }

    function onMouseDown(e) {
        e = dom.evt(e);
        start = knob.offsetTop - e.y;
        track.class('active');
        dom.addMoveEvent(onMouseMove, onMouseUp)
    }

    function onMouseUp() {
        track.class('active', true);
    }

    function onWheel(e) {
        var delta = e.deltaY;
        viewport.scrollTop += delta / 2;
        knob.style.top = viewport.scrollTop * k() + "px";
        e.preventDefault();
    }

    function k() {
        return scroll.offsetHeight / content.offsetHeight;
    }
};