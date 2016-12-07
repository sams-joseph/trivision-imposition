// A collection of usefull prototypes
// Copyright (c) 2014 Fabian Moron Zirfas

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


/**
 * This is Prototypes.jsx
 */

try {
	Object.defineProperty({}, 'a', {value: 0});
}
catch(err) {
	// failed: so we're in IE8
	(function() {
		var defineProperty = Object.defineProperty;
		Object.defineProperty = function (object, property, descriptor) {
			delete descriptor.configurable;
			delete descriptor.enumerable;
			delete descriptor.writable;
			try {
				return defineProperty(object, property, descriptor);
			}
			catch(err) {
				object[property] = descriptor.value;
			}
		};
	}());
}

Object.defineProperties || (Object.defineProperties=function defineProperties(object, descriptors) {
	var property;
	for (property in descriptors) {
		Object.defineProperty(object, property, descriptors[property]);
	}
	return object;
});

var lambda = function (l) {
	var fn = l.match(/\((.*)\)\s*=>\s*(.*)/);
	var p = [];
	var b = "";

	if (fn.length > 0) fn.shift();
	if (fn.length > 0) b = fn.pop();
	if (fn.length > 0) p = fn.pop()
		.replace(/^\s*|\s(?=\s)|\s*$|,/g, '')
		.split(' ');

	// prepend a return if not already there.
	fn = ((!/\s*return\s+/.test(b)) ? "return " : "") + b;

	p.push(fn);

	try {
		return Function.apply({}, p);
	} catch (e) {
		return null;
	}
};

/**
 * from here
 * http://www.paulfree.com/28/javascript-array-filtering/#more-28
 */
if (typeof (Array.prototype.where) === 'undefined') {
	Array.prototype.where = function (f) {
		var fn = f;
		// if type of parameter is string
		if (typeof f == "string")
		// try to make it into a function
			if ((fn = lambda(fn)) === null)
			// if fail, throw exception
				throw "Syntax error in lambda string: " + f;
			// initialize result array
		var res = [];
		var l = this.length;
		// set up parameters for filter function call
		var p = [0, 0, res];
		// append any pass-through parameters to parameter array
		for (var i = 1; i < arguments.length; i++) {
			p.push(arguments[i]);
		}
		// for each array element, pass to filter function
		for (var j = 0; j < l; j++) {
			// skip missing elements
			if (typeof this[j] == "undefined") continue;
			// param1 = array element
			p[0] = this[j];
			// param2 = current indeex
			p[1] = j;
			// call filter function. if return true, copy element to results
			if ( !! fn.apply(this, p)) res.push(this[j]);
		}
		// return filtered result
		return res;
	};
}
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

	Array.prototype.forEach = function(callback, thisArg) {

		var T, k;

		if (this === null) {
			throw new TypeError(' this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== "function") {
			throw new TypeError(callback + ' is not a function');
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) {
			T = thisArg;
		}

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
				kValue = O[k];

				// ii. Call the Call internal method of callback with T as the this value and
				// argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O);
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined
	};
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun/*, thisArg*/) {
		'use strict';

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') {
			throw new TypeError();
		}

		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t) {
				var val = t[i];

				// NOTE: Technically this should Object.defineProperty at
				//       the next index, as push can be affected by
				//       properties on Object.prototype and Array.prototype.
				//       But that method's new, and collisions should be
				//       rare, so use the more-compatible alternative.
				if (fun.call(thisArg, val, i, t)) {
					res.push(val);
				}
			}
		}

		return res;
	};
}
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {

		var k;

		// 1. Let O be the result of calling ToObject passing
		//    the this value as the argument.
		if (this === null) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//    internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if (n >= len) {
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while (k < len) {
			var kValue;
			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//    HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//    i.  Let elementK be the result of calling the Get
			//        internal method of O with the argument ToString(k).
			//   ii.  Let same be the result of applying the
			//        Strict Equality Comparison Algorithm to
			//        searchElement and elementK.
			//  iii.  If same is true, return k.
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}
if (typeof (String.prototype.localeCompare) === 'undefined') {
	String.prototype.localeCompare = function (str, locale, options) {
		return ((this == str) ? 0 : ((this > str) ? 1 : -1));
	};
}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  "name": "Joe",
  "adobeVersion": "2015",
  "mac": {
    "name": "Mac25",
    "version": "10.10.1"
  }
};

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
    function Color() {
        _classCallCheck(this, Color);
    }

    _createClass(Color, [{
        key: "solidColor",
        value: function solidColor(c, m, y, k) {
            var color = new SolidColor();
            color.cmyk.black = k;
            color.cmyk.cyan = c;
            color.cmyk.yellow = y;
            color.cmyk.magenta = m;

            return color;
        }
    }]);

    return Color;
}();

exports["default"] = Color;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logging = function () {
  function Logging(jobNumber, operator, adobeVersion, macName, macVersion) {
    _classCallCheck(this, Logging);

    this.jobNumber = jobNumber;
    this.operator = operator;
    this.adobeVersion = adobeVersion;
    this.macName = macName;
    this.macVersion = macVersion;
  }

  _createClass(Logging, [{
    key: "logger",
    value: function logger(error) {
      var currentdate = new Date();
      var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

      var filepath = "G33STORE-1/4_Joe/scripts/_logs/trivision/" + this.jobNumber + ".txt";
      var write_file = File(filepath);
      var bar = '====================';

      if (!write_file.exists) {
        write_file = new File(filepath);
        var out = void 0;
        if (write_file !== '') {
          out = write_file.open('w', undefined, undefined);
          write_file.encoding = "UTF-8";
          write_file.lineFeed = "Macintosh";
        }
        if (out !== false) {
          write_file.writeln(this.operator + " worked " + this.jobNumber + " at " + datetime + "\n\nSystem Specs - Adobe Version: " + this.adobeVersion + " | Mac Name: " + this.macName + " | Mac Version: " + this.macVersion + "\n\nAny Errors: " + error + "\n" + bar + "\n");
          write_file.close();
        }
      } else {
        var append_file = File(filepath);
        append_file.open('a', undefined, undefined);
        if (append_file !== '') {
          append_file.writeln(this.operator + " worked " + this.jobNumber + " at " + datetime + "\n\nSystem Specs - Adobe Version: " + this.adobeVersion + " | Mac Name: " + this.macName + " | Mac Version: " + this.macVersion + "\n\nAny Errors: " + error + "\n" + bar + "\n");

          append_file.close();
        }
      }
    }
  }]);

  return Logging;
}();

exports["default"] = Logging;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenFile = function () {
    function OpenFile() {
        _classCallCheck(this, OpenFile);
    }

    _createClass(OpenFile, [{
        key: "open",
        value: function (_open) {
            function open(_x) {
                return _open.apply(this, arguments);
            }

            open.toString = function () {
                return _open.toString();
            };

            return open;
        }(function (file) {
            var workingFileLocation = File(file);

            app.preferences.rulerUnits = Units.PIXELS;
            app.displayDialogs = DialogModes.NO;
            open(workingFileLocation);

            var res = app.activeDocument.resolution,
                height = parseInt(app.activeDocument.height),
                width = parseInt(app.activeDocument.width);

            return [height, width, res];
        })
    }]);

    return OpenFile;
}();

exports["default"] = OpenFile;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SaveFiles = function () {
    function SaveFiles(saveFile) {
        _classCallCheck(this, SaveFiles);

        this.saveFile = saveFile;
    }

    _createClass(SaveFiles, [{
        key: 'saveTIF',
        value: function saveTIF() {
            saveTiff = new TiffSaveOptions();
            saveTiff.alphaChannels = true;
            saveTiff.annotations = true;
            saveTiff.byteOrder = ByteOrder.MACOS;
            saveTiff.embedColorProfile = true;
            saveTiff.imageCompression = TIFFEncoding.TIFFLZW;
            saveTiff.layerCompression = LayerCompression.ZIP;
            saveTiff.layers = false;
            saveTiff.saveImagePyramid = false;
            saveTiff.spotColors = false;
            saveTiff.transparency = false;
            app.activeDocument.saveAs(this.saveFile, saveTiff, true, Extension.LOWERCASE);
        }
    }, {
        key: 'savePDF',
        value: function savePDF() {
            pdfSaveOpts = new PDFSaveOptions();
            pdfSaveOpts.pDFPreset = 'MMT PDFx4';
            app.activeDocument.saveAs(this.saveFile, pdfSaveOpts);
        }
    }]);

    return SaveFiles;
}();

exports['default'] = SaveFiles;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Selection = function () {
    function Selection() {
        _classCallCheck(this, Selection);
    }

    _createClass(Selection, [{
        key: "selection",
        value: function selection(x, y, width, height) {
            selectedRegion = Array(Array(x, y), Array(x + width, y), Array(x + width, y + height), Array(x, y + height));

            return selectedRegion;
        }
    }]);

    return Selection;
}();

exports["default"] = Selection;

/*
NOTE To use: document.selection.select(SELECTION)
*/

},{}],7:[function(require,module,exports){
'use strict';

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _SaveFile = require('./SaveFile');

var _SaveFile2 = _interopRequireDefault(_SaveFile);

var _Selection = require('./Selection');

var _Selection2 = _interopRequireDefault(_Selection);

var _Color = require('./Color');

var _Color2 = _interopRequireDefault(_Color);

var _Logging = require('./Logging');

var _Logging2 = _interopRequireDefault(_Logging);

var _OpenFile = require('./OpenFile');

var _OpenFile2 = _interopRequireDefault(_OpenFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var openFiles = new _OpenFile2['default'](),
    jobNumber = '123456P01',
    bladeWidth = 95,
    numBlades = 138,
    fileDims = openFiles.open('G33STORE-1/WIP/' + jobNumber + '/prep_art/' + jobNumber + '.tif'),
    height = fileDims[0],
    width = fileDims[1],
    res = fileDims[2],
    bladeWidthMM = bladeWidth / 25.4 * res,
    gapWidth = (width - bladeWidthMM / 10 * numBlades) / (numBlades - 1),
    log = new _Logging2['default'](jobNumber, _config2['default'].name, _config2['default'].adobeVersion, _config2['default'].mac.name, _config2['default'].mac.version),
    magenta = new _Color2['default']().solidColor(0, 100, 0, 0);

function cutBlades(width, height, gap, num) {
    for (var i = 0; i < num; i++) {
        var xPositionOffset = void 0;
        if (i == 0) {
            xPositionOffset = 0;
        } else {
            xPositionOffset = gap;
        }
        var selectedRegion = new _Selection2['default']().selection(i * (width / 10 + xPositionOffset), 0, width / 10, height);
        app.activeDocument.selection.select(selectedRegion);
        app.activeDocument.selection.fill(magenta);
    }
}

cutBlades(bladeWidthMM, height, gapWidth, numBlades);
// TODO Receive input from user.

},{"../config":1,"./Color":2,"./Logging":3,"./OpenFile":4,"./SaveFile":5,"./Selection":6}]},{},[7]);
