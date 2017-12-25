var dom = module.exports = function (tag) {

    tag = tag === undefined ? 'div' : tag;
    tag = typeof tag === 'string' ? document.createElement(tag) : tag;

    tag.show = c(dom.assign.bind(tag.style, 'display', 'block'));
    tag.hide = c(dom.assign.bind(tag.style, 'display', 'none'));

    tag.html = c(function content(html) {
        tag.innerHTML = html || ''
    });

    tag.class = c(function (name, remove) {
        tag.classList[remove ? 'remove' : 'add'](name)
    });

    tag.click = c(function (action) {
        tag.addEventListener('click', action, true)
    });

    tag.add = c(function (content) {
        dom.add(content, tag)
    });

    tag.parent = c(function (to) {
        to.appendChild(tag)
    });

    return tag;

    function c(func) {
        return dom.chain(func, tag)
    }
};

dom.div = function (className, to) {
    return dom().class(className).parent(to);
};

dom.chain = function (func, obj) {
    return function () {
        func.apply(null, arguments);
        return obj;
    };
};

dom.add = function (content, to) {
    if (typeof content === "string")
        to.innerHTML += content;
    else
        to.appendChild(content);
};

dom.assign =function (property, value) {
    this[property] = value;
};
