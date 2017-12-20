// html5 tiny form @ stranger in the q

function TinyForm(form, name, closeable) {
    if (typeof form === 'string')
        form = document.querySelector(form);
    var fragment = document.createDocumentFragment();
    Array.prototype.slice.call(form.childNodes).forEach(function(node) {
        fragment.appendChild(node);
    });
    form.innerHTML = '';
    form.classList.add('form');
    var header = appendDiv('header');
    header.innerHTML = name;
    addDragSupport(form, header);
    var body = appendDiv('body');
    body = addScrollSupport(body);

    Array.prototype.slice.call(fragment.childNodes).forEach(function(node){
        body.appendChild(node);
    });
    addResizeSupport(form);
    form.hide = assign.bind(form.style, 'display', 'none');
    form.show = show;
    form.clear = assign.bind(body, 'innerHTML', '');
    form.add = addContent;
    closeable && addCloseButton();
    form.hide();
    form.addEventListener('mousedown', bringToFront);
    ['top', 'left', 'width', 'height'].forEach(loadFromLocalStorage);
    window.addEventListener('resize', resizeWindow);
    return form;

    function show() {
        form.style.display = 'block';
        resizeWindow();
        bringToFront();
        body.update && body.update();
    }

    function addContent(content) {
        if (typeof content === "string")
            body.innerHTML += content;
        else
            body.appendChild(content);
        body.update && body.update();
    }

    function resizeWindow() {
        if (form.style.display === "block") {
            clampAndSet('left', form.offsetLeft, 0, window.innerWidth - form.offsetWidth);
            clampAndSet('top', form.offsetTop, 0, window.innerHeight - form.offsetHeight);
        }
    }
    
    function assign(property, value) {
        this[property] = value;
    }

    function addCloseButton() {
        var closer = appendDiv('closer');
        closer.innerHTML = '<svg viewBox="0 0 21 21"><path stroke="white" stroke-width="2" d="M5,5 L16,16 M5,16 L16,5"/></svg>';
        closer.onclick = form.hide;
    }

    function appendDiv(classes, to) {
        var div = document.createElement('div');
        div.className = classes;
        return (to || form).appendChild(div);
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
            clampAndSet('height', initY + current.y - mouse.y, 200, window.innerHeight - form.offsetTop);
            clampAndSet('width', initX + current.x - mouse.x, 200, window.innerWidth - form.offsetLeft);
            body.update && body.update();
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
        update();
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