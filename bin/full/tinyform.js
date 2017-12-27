(function (doc, cssText) {
    var styleEl = doc.createElement("style");
    doc.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText;
        } catch (ignore) {
            styleEl.innerText = cssText;
        }
    }
}(document, ".form {\n  /*position: absolute;*/\n  /*z-index: 2000;*/\n  border: 1px solid lightgray ;\n  user-select: none;\n}\n\n.form div.body {\n  position: absolute;\n  width: 100%;\n  height: calc(100% - 30px);\n}\n\n.form div.header {\n  height: 30px;\n  line-height: 30px;\n  width: 100%;\n  text-align: center;\n  overflow: hidden;\n}\n\n.form div.closer {\n  margin: 5px;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n}\n\n.form div.closer path {\n  stroke: lightgray\n}\n\n.form div.closer:hover path {\n  stroke: gray\n}\n\n.form div.closer:active path {\n  stroke: black\n}\n\n.form div.resizer {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 20px;\n  height: 20px;\n  cursor: nwse-resize;\n}\n\n.form div.resizer path {\n  stroke: gray\n}\n\ndiv.viewport {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\ndiv.track {\n  position: absolute;\n  opacity: 0.5;\n  transition: 100ms;\n  margin-right: 3px;\n  right: 0;\n  width: 5px;\n  height: 100%;\n}\n\ndiv.track:hover {\n  width: 11px;\n  margin-right: 1px;\n}\n\ndiv.track.active {\n  width: 11px;\n  margin-right: 1px;\n  opacity: 1;\n}\n\ndiv.scroll-container:hover div.track {\n  opacity: 0.7;\n}\n\ndiv.knob {\n  width: 100%;\n  position: absolute;\n  background-color: rgba(150, 150, 150, 1);\n  cursor: pointer;\n}"));
