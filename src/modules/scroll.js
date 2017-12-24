var dom = require('./dom');

module.exports = function (scroll) {
    var start;
    var viewport = dom().class('viewport').appendTo(scroll);
    var track = dom().class('track').appendTo(scroll);
    var knob = dom().class('knob').appendTo(track);
    var content = dom().class('scroll-content').appendTo(viewport);
    content.update = update;
    scroll.addEventListener('mousewheel', onWheel);
    knob.addEventListener('mousedown', onMouseDown);
    return content;

    function update() {
        var K = k();
        knob.style.height = (K < 1 ? K * scroll.offsetHeight : 0) + "px";
        knob.style.top = viewport.scrollTop * K + "px";
    }

    function onMouseMove(e) {
        var pos = Math.clamp(start + e.clientY, 0, viewport.offsetHeight - knob.offsetHeight);
        viewport.scrollTop = pos / k();
        knob.style.top = pos + "px";
    }

    function onMouseDown(e) {
        start = knob.offsetTop - e.clientY;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        track.class('active');
    }

    function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
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