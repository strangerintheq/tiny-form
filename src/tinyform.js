var dom = require('./modules/dom');
var drag = require('./modules/drag');
var scroll = require('./modules/scroll');
var resize = require('./modules/resize');

window.TinyForm = function (form) {

    if (typeof form === 'string')
        form = document.querySelector(form);

    var tf = form.tinyform = { // all in properties holder
        minWidth: 200, minHeight: 100
    };

    dom(form);
    init();
    assignFunctions();
    return form.hide();

    function assignFunctions() {
        form.clear = dom.chain(dom.assign.bind(form.body, 'innerHTML', ''));

        form.header = dom.chain(function (text) {
            tf.header.add(text);
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
            var svgCross = '<svg viewBox="0 0 21 21"><path stroke="white" stroke-width="2" d="M5,5 L16,16 M5,16 L16,5"/></svg>';
            dom().class('closer').add(svgCross).click(form.hide).appendTo(form);
        }, form);

        form.resizeable = dom.chain(function (minWidth, minHeight, maxWidth, maxHeight) {
            tf.minWidth = minWidth;
            tf.minHeight = minHeight;
            tf.maxWidth = maxWidth;
            tf.maxHeight = maxHeight;
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
        form.classList.add('form');
        var fragment = document.createDocumentFragment();
        Array.prototype.slice.call(form.childNodes).forEach(function(node) {
            fragment.appendChild(node);
        });
        form.innerHTML = '';
        tf.header = appendDiv('header');
        tf.body = appendDiv('body');
        tf.body = scroll(tf.body);
        Array.prototype.slice.call(fragment.childNodes).forEach(function(node) {
            tf.body.appendChild(node);
        });
        form.addEventListener('mousedown', bringToFront);
        ['top', 'left', 'width', 'height'].forEach(loadFromLocalStorage);
        window.addEventListener('resize', resizeWindow);
    }

    function resizeWindow() {
        if (form.style.display === "block") {
            clampAndSet('width', form.offsetWidth, tf.minWidth, window.innerWidth - form.offsetWidth);
            clampAndSet('height', form.offsetHeight, tf.minHeight, window.innerHeight - form.offsetHeight);
            clampAndSet('left', form.offsetLeft, 0, window.innerWidth - form.offsetWidth);
            clampAndSet('top', form.offsetTop, 0, window.innerHeight - form.offsetHeight);
        }
    }

    function addContent(content, to) {
        dom.add(content, to);
        !to && update();
    }

    function update() {
        tf.body.update && tf.body.update();
    }

    function appendDiv(classes, to) {
        return dom().class(classes).appendTo(to || form);
    }

    function bringToFront() {
        Array.prototype.slice.call(document.querySelectorAll('.form')).forEach(function (f) {
            f.style.zIndex = 1000;
        });
        form.style.zIndex = 10000;
    }

    function loadFromLocalStorage(property) {
        var value = localStorage.getItem('tynyform.' + form.id + '.' + property);
        if (value) form.style[property] = (+JSON.parse(value)) + 'px';
    }

    function clampAndSet(parameter, value, min, max) {
        value = dom.clamp(value, min, max);
        form.style[parameter] = value + 'px';
        localStorage.setItem('tynyform.' + form.id + '.' + parameter, JSON.stringify(value));
    }
};