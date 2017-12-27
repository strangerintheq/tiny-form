var dom = module.exports = function (tag) {

    tag = tag === undefined ? 'div' : tag;
    tag = typeof tag === 'string' ? document.createElement(tag) : tag;

    tag.show = c(st('display', 'block'));
    tag.hide = c(st('display', 'none'));
    tag.abs = c(st('position', 'absolute'));
    tag.left = c(px('left'));
    tag.top = c(px('top'));
    tag.right = c(px('right'));
    tag.bottom = c(px('bottom'));
    tag.width = c(px('width'));
    tag.height = c(px('height'));

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

    function px(name) {
        return function (value) {
            tag.style[name] = value + 'px';
        }
    }

    function st(param, value) {
        return dom.assign.bind(tag.style, param, value)
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
    if (typeof content === 'string')
        to.innerHTML += content;
    else
        to.appendChild(content);
};

dom.assign = function (property, value) {
    this[property] = value;
};

dom.svg = function (size, pathD) {
    return '<svg viewBox="0 0 ' + size + ' ' + size + '"><path d="' + pathD + '"/></svg>'
};
