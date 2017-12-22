module.exports = function (tag) {
    tag = tag === undefined ? 'div' : tag;
    tag = typeof tag === 'string' ? document.createElement(tag) : tag;
    tag.html = chain(function (html) {
        tag.innerHTML = html
    }, tag);
    tag.class = chain(function (name) {
        tag.classList.add(name)
    }, tag);
    tag.hide = chain(assign.bind(tag.style, 'display', 'none'), tag);
    tag.show = chain(assign.bind(tag.style, 'display', 'block'), tag);
    tag.click = chain(function (action) {
        tag.addEventListener('click', action, true)
    }, tag);
    tag.add = chain(function (content) {
        add(content, tag)
    }, tag);
    tag.appendTo = chain(function (to) {
        to.appendChild(tag)
    }, tag);
    return tag;
};

module.exports.chain = chain;
module.exports.add = add;
module.exports.assign = assign;
module.exports.clamp = clamp;
module.exports.mouseUp = mouseUp;
module.exports.addListeners = addListeners;
module.exports.evt = evt;

function mouseUp(func) {
    window.removeEventListener('mousemove', func);
    window.removeEventListener('touchmove', func);
}

function addListeners(eventNames, func, target) {
    eventNames.forEach(function (name) {
        (target || window).addEventListener(name, func);
    });
}

function clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
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