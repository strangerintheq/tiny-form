function TinyForm(form) {

    if (typeof form === 'string')
        form = document.querySelector(form);

    var tf = form.tinyform = { // all in properties holder
        minWidth: 300, minHeight: 200
    };

    dom(form);
    init();
    assignFunctions();
    return form.hide();

    function assignFunctions() {
        form.clear = chain(assign.bind(form.body, 'innerHTML', ''));

        form.header = chain(function (text) {
            tf.header.show().add(text);
        });

        form.dragggable = chain(function () {
            addDragSupport(form, tf.header.style.display === 'none' ? form : tf.header);
        });

        form.show = chain(function () {
            form.style.display = 'block';
            resizeWindow();
            bringToFront();
            tf.body.update && tf.body.update();
        });

        form.add = chain(function (content) {
            addContent(content, tf.body);
        });

        form.closeable = chain(function () {
            var svgCross = '<svg viewBox="0 0 21 21"><path stroke="white" stroke-width="2" d="M5,5 L16,16 M5,16 L16,5"/></svg>';
            dom().class('closer').add(svgCross).click(form.hide).appendTo(form);
        });

        form.resizeable = chain(function (minWidth, minHeight, maxWidth, maxHeight) {
            tf.minWidth = minWidth;
            tf.minHeight = minHeight;
            tf.maxWidth = maxWidth;
            tf.maxHeight = maxHeight;
            addResizeSupport(form);
        });

        form.center = chain(function (always) {
            tf.center = true;
            tf.alwaysCenter = always;
        });
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
        tf.body = addScrollSupport(tf.body);
        Array.prototype.slice.call(fragment.childNodes).forEach(function(node) {
            tf.body.appendChild(node);
        });
        form.addEventListener('mousedown', bringToFront);
        //   ['top', 'left', 'width', 'height'].forEach(loadFromLocalStorage);
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

    function assign(property, value) {
        this[property] = value;
    }

    function dom(tag) {
        tag = tag === undefined ? 'div' : tag;
        tag = typeof tag === 'string' ? document.createElement(tag) : tag;
        tag.html = chain(function (html) {tag.innerHTML = html}, tag);
        tag.class = chain(function (name) {tag.classList.add(name)}, tag);
        tag.hide = chain(assign.bind(tag.style, 'display', 'none'), tag);
        tag.show = chain(assign.bind(tag.style, 'display', 'block'), tag);
        tag.click = chain(function (action) {tag.addEventListener('click', action, true)}, tag);
        tag.add = chain(function (content) {addContent(content, tag)}, tag);
        tag.appendTo = chain(function (to) {to.appendChild(tag)}, tag);
        return tag;
    }

    function addContent(content, to) {
        if (typeof content === "string")
            (to || tf.body).innerHTML += content;
        else
            (to || tf.body).appendChild(content);
        !to && tf.body.update && tf.body.update();
    }

    function appendDiv(classes, to) {
        return dom().class(classes).appendTo(to || form);
    }

    function evt(e) {
        if (e.touches) e = e.touches[0];
        return {x: e.clientX, y: e.clientY}
    }

    function bringToFront() {
        Array.prototype.slice.call(document.querySelectorAll('.form')).forEach(function (f) {
            f.style.zIndex = 1000;
        });
        form.style.zIndex = 10000;
    }

    function mouseUp(func) {
        window.removeEventListener('mousemove', func);
        window.removeEventListener('touchmove', func);
    }

    function addListeners(eventNames, func, target) {
        eventNames.forEach(function (name) {
            (target || window).addEventListener(name, func);
        });
    }

    function loadFromLocalStorage(property) {
        var value = localStorage.getItem('tynyform.' + form.id + '.' + property);
        if (value) form.style[property] = (+JSON.parse(value)) + 'px';
    }

    function clampAndSet(parameter, value, min, max) {
        value = clamp(value, min, max);
        form.style[parameter] = value + 'px';
        localStorage.setItem('tynyform.' + form.id + '.' + parameter, JSON.stringify(value));
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(min, value), max);
    }

    function chain(func, obj) {
        return function () {
            func.apply(null, arguments);
            return (obj || form);
        };
    }

    function addDragSupport(form, activeDragZone) {
        var init = {}, mouse;
        addListeners(['mousedown', 'touchstart'], startDrag, activeDragZone || form);

        function startDrag(event) {
            init.x = form.offsetLeft;
            init.y = form.offsetTop;
            mouse = evt(event);
            addListeners(['mousemove', 'touchmove'], repositionElement);
            addListeners(['mouseup', 'touchend'], mouseUp.bind(null, repositionElement));
        }

        function repositionElement(event) {
            var current = evt(event);
            clampAndSet('left', init.x + current.x - mouse.x, 0, window.innerWidth  - form.offsetWidth);
            clampAndSet('top', init.y + current.y - mouse.y, 0, window.innerHeight  - form.offsetHeight);
        }
    }

    function addResizeSupport(form) {
        var initX, initY, mouse;
        var resizer = appendDiv('resizer', form);
        resizer.innerHTML = '<svg viewBox="0 0 21 21"><path stroke="wheat" d="M4,19 L19,4 M8,19 L19,8 M12,19 L19,12"/></svg>';
        addListeners(['mousedown', 'touchstart'], startResize, resizer);

        function startResize(event) {
            initX = form.offsetWidth;
            initY = form.offsetHeight;
            mouse = evt(event);
            addListeners(['mousemove', 'touchmove'], resizeElement);
            addListeners(['mouseup', 'touchend'], mouseUp.bind(null, resizeElement));
        }

        function resizeElement(event) {
            var current = evt(event);
            clampAndSet('height', initY + current.y - mouse.y, tf.minHeight, window.innerHeight - form.offsetTop);
            clampAndSet('width', initX + current.x - mouse.x, tf.minWidth, window.innerWidth - form.offsetLeft);
            tf.body.update && tf.body.update();
        }
    }

    function addScrollSupport(scroll) {
        var start;
        var viewport = appendDiv('viewport', scroll);
        var track = appendDiv('track', scroll);
        var knob = appendDiv('knob', track);
        var content = appendDiv('scroll-content', viewport);
        content.update = update;
        scroll.addEventListener('mousewheel', onWheel);
        knob.addEventListener('mousedown', onMouseDown);
        // update();
        return content;

        function update() {
            var K = k();
            knob.style.height = (K < 1 ? K * scroll.offsetHeight : 0) + "px";
            knob.style.top = viewport.scrollTop * K + "px";
        }

        function onMouseMove(e) {
            var pos = clamp(start + e.clientY, 0, viewport.offsetHeight - knob.offsetHeight);
            viewport.scrollTop = pos / k();
            knob.style.top = pos + "px";
        }

        function onMouseDown(e) {
            start = knob.offsetTop - e.clientY;
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            knob.parentNode.classList.add('active');
        }

        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            knob.parentNode.classList.remove('active');
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
    }
}