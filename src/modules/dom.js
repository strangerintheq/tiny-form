module.exports = function (tag) {
    tag = tag === undefined ? 'div' : tag;
    tag = typeof tag === 'string' ? document.createElement(tag) : tag;

    tag.show = c(assign.bind(tag.style, 'display', 'block'));
    tag.hide = c(assign.bind(tag.style, 'display', 'none'));

    tag.html = c(function content(html) {
        tag.innerHTML = html
    });

    tag.class = c(function (name, remove) {
        tag.classList[remove ? 'remove' : 'add'](name)
    });

    tag.click = c(function (action) {
        tag.addEventListener('click', action, true)
    });

    tag.add = c(function (content) {
        add(content, tag)
    });

    tag.appendTo = c(function (to) {
        to.appendChild(tag)
    });

    return tag;

    function c(func) {
        return chain(func, tag)
    }
};

module.exports.chain = chain;
module.exports.add = add;
module.exports.assign = assign;
module.exports.addMoveEvent = addMoveEvent;
module.exports.listen = listen;
module.exports.evt = evt;

var moveEventNames = ['mousemove', 'touchmove'];
var upEventNames = ['mouseup', 'touchend'];

function addMoveEvent(func, endFunc) {
    listen(moveEventNames, func);
    listen(upEventNames, endMove);

    function endMove() {
        listen(moveEventNames, func, window, true);
        listen(upEventNames, endMove, window, true);
        endFunc();
    }
}

function listen(eventNames, func, target, remove) {
    eventNames.forEach(function (name) {
        (target || window)[(remove ? 'remove' : 'add') + 'EventListener'](name, func);
    });
}

function chain(func, obj) {
    return function () {
        func.apply(null, arguments);
        return obj;
    };
}

function assign(property, value) {
    this[property] = value;
}

function add(content, to) {
    if (typeof content === "string")
        to.innerHTML += content;
    else
        to.appendChild(content);
}

function evt(e) {
    if (e.touches) e = e.touches[0];
    return {x: e.clientX, y: e.clientY}
}