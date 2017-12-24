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
}(document, "/* tiny form @ stranger in the q */\n\n.form {\n  position: absolute;\n  z-index: 2000;\n  /*background-color: rgba(0,0,0,0.5);*/\n  /*box-shadow: 0 0 10px 0 lightgray;*/\n  /*border-radius: 5px;*/\n  /*color: white;*/\n  /*font-family: sans-serif;*/\n  user-select: none;\n}\n\n.form div.body {\n  position: absolute;\n  width: 100%;\n  height: calc(100% - 30px);\n}\n\n.form div.header {\n  /*cursor: move;*/\n  /*color: wheat;*/\n  /*font-size: 20px;*/\n  height: 30px;\n  /*line-height: 30px;*/\n  width: 100%;\n  text-align: center;\n  overflow: hidden;\n}\n\n.form div.closer {\n  /*border-radius: 3px;*/\n  /*transition: 100ms;*/\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  /*box-shadow: 0 0 3px 0 lightgray;*/\n}\n\n.form div.closer:hover {\n  /*box-shadow: 0 0 10px 0 lightblue;*/\n  /*background-color: #48b  ;*/\n}\n\n.form div.closer:active  {\n  /*background-color: #adf;*/\n}\n\n.form div.closer:active path {\n  /*transition: 100ms;*/\n  stroke: black\n}\n\n.form div.closer:active path {\n  /*transition: 100ms;*/\n  stroke: black\n}\n\n.form div.resizer {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 20px;\n  height: 20px;\n  cursor: nwse-resize;\n}\n\n\ndiv.viewport {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n\n\ndiv.track {\n  position: absolute;\n  opacity: 0.5;\n  transition: 100ms;\n  margin-right: 3px;\n  right: 0;\n  width: 5px;\n  height: 100%;\n}\n\ndiv.track:hover {\n  width: 11px;\n  margin-right: 0;\n}\n\ndiv.track.active {\n  width: 11px;\n  margin-right: 0;\n  opacity: 1 !important;\n}\n\ndiv.scroll-container:hover div.track {\n  opacity: 0.7;\n}\n\ndiv.knob {\n  width: 100%;\n  position: absolute;\n  background-color: rgba(150, 150, 150, 1);\n  border-radius: 6px;\n  cursor: pointer;\n}"));
