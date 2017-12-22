var dom = require('./dom');

module.exports = function (form) {
    var initX, initY, mouse;
    var resizer = dom().class('resizer').appendTo(form);
    resizer.innerHTML = '<svg viewBox="0 0 21 21"><path stroke="wheat" d="M4,19 L19,4 M8,19 L19,8 M12,19 L19,12"/></svg>';
    dom.addListeners(['mousedown', 'touchstart'], startResize, resizer);

    function startResize(event) {
        initX = form.offsetWidth;
        initY = form.offsetHeight;
        mouse = dom.evt(event);
        dom.addListeners(['mousemove', 'touchmove'], resizeElement);
        dom.addListeners(['mouseup', 'touchend'], dom.mouseUp.bind(null, resizeElement));
    }

    function resizeElement(event) {
        var current = dom.evt(event);
        form.clampAndSet('height', initY + current.y - mouse.y, form.tinyform.minWidth, window.innerHeight - form.offsetTop);
        form.clampAndSet('width', initX + current.x - mouse.x, form.tinyform.minHeight, window.innerWidth - form.offsetLeft);
        form.update()
    }
};
