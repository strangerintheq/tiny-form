var events = require('./modules/events');
var dom = require('./modules/dom');
var drag = require('./modules/drag');
var scroll = require('./modules/scroll');
var resize = require('./modules/resize');

Math.clamp = function (value, min, max) {
    return Math.min(Math.max(min, value), max);
};

window.TinyForm = function (form) {

    if (typeof form === 'string')
        form = document.querySelector(form);

    var tf = form.tinyform = { // all in properties holder
        minWidth: 300, minHeight: 140,
        key: 'tynyform.' + form.id + '.'
    };

    dom(form);
    init();
    assignFunctions();
    return form.hide();

    function assignFunctions() {

        form.clear = dom.chain(form.html.bind(''));

        form.header = dom.chain(function (text) {
            tf.header.show().add(text);
        }, form);

        form.dragggable = dom.chain(function () {
            drag(form, tf.header);
        }, form);

        form.show = dom.chain(function () {
            form.style.display = 'block';
            resizeWindow();
            bringToFront();
            tf.body.update && tf.body.update();
        }, form);

        form.add = dom.chain(function (content) {
            addContent(content, tf.body);
        }, form);

        form.closeable = dom.chain(function () {
            dom.div('closer', form).click(form.hide).abs().top(0).right(0)
                .add(dom.svg(21, "M5,5 L16,16 M5,16 L16,5"));
        }, form);

        form.resizeable = dom.chain(function (minWidth, minHeight, maxWidth, maxHeight) {
            tf.minWidth = minWidth || tf.minWidth;
            tf.minHeight = minHeight || tf.minHeight;
            tf.maxWidth = maxWidth || Number.MAX_VALUE;
            tf.maxHeight = maxHeight || Number.MAX_VALUE;
            resize(form);
        }, form);

        form.center = dom.chain(function (always) {
            tf.center = true;
            tf.alwaysCenter = always;
        }, form);

        form.update = update;
        form.clampAndSet = clampAndSet;
    }

    function init() {
        var fragment = document.createDocumentFragment();
        iterate(form.childNodes, function(node) {
            fragment.appendChild(node);
        });
        form.class('form').abs().html();
        tf.header = dom.div('header', form).hide();
        tf.body = dom.div('body', form);
        tf.body = scroll(tf.body);
        iterate(fragment.childNodes, function(node) {
            tf.body.appendChild(node);
        });
        events.listen(events.down, bringToFront);
        ['top', 'left', 'width', 'height'].forEach(loadFromLocalStorage);
        window.addEventListener('resize', resizeWindow);
        bringToFront();
    }

    function resizeWindow() {
        if (form.style.display === "block") {
            clampAndSet('width', form.clientWidth, tf.minWidth, innerWidth - form.clientWidth);
            clampAndSet('height', form.clientHeight, tf.minHeight, innerHeight - form.clientHeight);
            clampAndSet('left', form.offsetLeft, 0, innerWidth - form.clientWidth);
            clampAndSet('top', form.offsetTop, 0, innerHeight - form.clientHeight);
        }
    }

    function addContent(content, to) {
        dom.add(content, to);
        update();
    }

    function update() {
        tf.body.update && tf.body.update();
    }

    function bringToFront() {
        iterate('.form', function (form) {
            form.style.zIndex = 1000;
        });
        form.style.zIndex = 10000;
    }

    function loadFromLocalStorage(parameter) {
        var value = localStorage.getItem(tf.key + parameter);
        if (value) form[parameter](+JSON.parse(value));
    }

    function clampAndSet(parameter, value, min, max) {
        value = Math.clamp(value, min, max);
        form[parameter](value);
        localStorage.setItem(tf.key + parameter, JSON.stringify(value));
    }
    
    function iterate(nodes, func) {
        nodes = typeof nodes === 'string' ? document.querySelector(nodes) : nodes;
        Array.prototype.slice.call(nodes).forEach(func);
    }
};
