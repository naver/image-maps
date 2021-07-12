function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/* eslint-disable unicorn/prefer-switch */

/*
The MIT License (MIT)

Copyright (c) 2016 NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
* ImageMaps 1.1.0
* jquery plugin which can be partially linked to the image
*
* https://github.com/naver/image-maps
* demo - https://naver.github.io/image-maps/
*
* Released on: July 6, 2016.
* @module imageMaps
*/
var shapeFaceClass = '_shape_face';
var shapeVertexClass = '_shape_vertex';
var areaClass = 'area';
/**
* @typedef {"rect"|"circle"|"ellipse"|"text"|"image"|"poly"|
* "polyline"|"polygon"} module:imageMaps.ShapeType
*/

var SHAPE = {
  RECT: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  TEXT: 'text',
  IMAGE: 'image',
  POLY: 'poly',
  POLYLINE: 'polyline',
  POLYGON: 'polygon'
};
/**
 * @see https://api.jquery.com/css/
 * @typedef {PlainObject<string,string>} module:imageMaps.ShapeStyles
*/

/**
* @callback OnClick
* @param {Event} e
* @param {string} targetAreaHref
* @returns {void}
*/

/**
 * @callback MouseDown
 * @param {Event} e
 * @param {module:imageMaps.ShapeType} shapeType
 * @param {module:imageMaps.Coords} coords
 * @returns {void}
 */

/**
* @callback MouseMove
* @param {Event} e
* @param {module:imageMaps.ShapeType} shapeType
* @param {module:imageMaps.MovedCoords} movedCoords
* @returns {void}
*/

/**
* @callback MouseUp
* @param {Event} e
* @param {module:imageMaps.ShapeType} shapeType
* @param {module:imageMaps.ShapeCoords} updatedCoords
* @returns {void}
*/

/**
* @callback Select
* @param {Event} e
* @param {module:imageMaps.ShapeInfoOptions|
*   module:imageMaps.ShapeSecondaryOptions} shapeInfo
* @returns {void}
*/

/**
* @typedef {PlainObject} module:imageMaps.ImageMapOptions
* @property {boolean} [isEditMode=false]
* @property {module:imageMaps.ShapeType} [shape="rect"]
* @property {string} [shapeText="press on link"]
* @property {module:imageMaps.ShapeStyles} [shapeStyle] Defaults to
*   `{fill: '#ffffff', 'fill-opacity': 0.2,
*     stroke: '#ffffff', 'stroke-width': 3}`
* @property {OnClick} [onClick=function () {}]
* @property {MouseDown} [onMouseDown=function () {}]
* @property {MouseMove} [onMouseMove=function () {}]
* @property {MouseUp} [onMouseUp=function () {}]
* @property {Select} [onSelect=function () {}]
*/

/**
 * @type {module:imageMaps.ImageMapOptions}
 */

var defaults = {
  isEditMode: false,
  // select map area shape type - rect, circle, text, image, poly
  shape: SHAPE.RECT,
  shapeText: 'press on link',
  // shape 옵션이 text일 때 적용된다.
  shapeStyle: {
    fill: '#ffffff',
    'fill-opacity': 0.2,
    stroke: '#ffffff',
    'stroke-width': 3
  },

  /* eslint-disable no-empty-function */
  onClick: function onClick(e, targetAreaHref) {},
  onMouseDown: function onMouseDown(e, shapeType, coords) {},
  onMouseMove: function onMouseMove(e, shapeType, movedCoords) {},
  onMouseUp: function onMouseUp(e, shapeType, updatedCoords) {},
  onSelect: function onSelect(e, shapeInfo) {}
  /* eslint-enable no-empty-function */

};
var defaultShapeOptions = {
  // top-left-x, top-left-y, bottom-right-x, botton-right-y
  rect: [0, 0, 20, 20],
  circle: [0, 0, 10],
  // center-x, center-y, radius
  ellipse: [0, 0, 5, 5],
  // center-x, center-y, radius-x, radius-y
  text: [0, 0, 12] // bottom-right-x, bottom-right-y, font-size

};
var FONT_SIZE_RATIO = 0.5;
var NS_SVG = 'http://www.w3.org/2000/svg';
var NS_XLINK = 'http://www.w3.org/1999/xlink';
/**
 * Adds {@link external:"jQuery.fn"} methods.
 * @function module:imageMaps.jqueryImageMaps
 * @param {external:jQuery} $
 * @returns {external:jQuery}
 */

function jqueryImageMaps($) {
  // The actual plugin constructor

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   */
  var ImageMaps = /*#__PURE__*/function () {
    /**
     *
     * @param {external:jQuery} container
     * @param {module:imageMaps.ImageMapOptions} [options]
     */
    function ImageMaps(container, options) {
      _classCallCheck(this, ImageMaps);

      this.container = $(container);
      this.mapEl = null;
      this.svgEl = null; // merge the default options with user-provided options

      this.options = $.extend(true, {}, defaults, options);
      this.shapeType = this.options.shape;
      this.isEditMode = this.options.isEditMode;
      this.shapeStyle = this.options.shapeStyle;
      this.shapeText = '';
      this.shapeImageUrl = '';
      this.shapeCoords = null;
      this.vertexCoords = null;
      this.grabType = null;
      this.containerWidth = 0;
      this.containerHeight = 0;
      this.touchStartCoords = {
        x: null,
        y: null
      };
      this.dragInfo = {
        face: {
          x: null,
          y: null
        },
        vertex: {
          x: null,
          y: null
        }
      };
      this.shapeLimitCoords = {
        x: 30,
        y: 30,
        radius: 15
      };
      this.allShapeInfo = {};
    }
    /**
     * ImageMaps: 이미지 엘리먼트 하단에 map, area 엘리먼트 생성 및 속성 부여.
     * @param {?(module:imageMaps.Coords)} coords
     * @param {Url} linkUrl
     * @returns {void}
     */


    _createClass(ImageMaps, [{
      key: "createMaps",
      value: function createMaps(coords, linkUrl) {
        var imageWidth = this.container.width();

        if (Number.isNaN(imageWidth) || !imageWidth) {
          this.container.one('load', $.proxy(_createMaps, this, coords, linkUrl));
        } else {
          _createMaps.call(this, coords, linkUrl);
        }
      }
      /**
       * @param {module:imageMaps.ShapeType} shapeType
       * @returns {void}
       */

    }, {
      key: "setShapeType",
      value: function setShapeType(shapeType) {
        this.shapeType = shapeType;
      }
      /**
       *
       * @param {module:imageMaps.ShapeStyles} [styleOptions]
       * @returns {void}
       */

    }, {
      key: "setShapeStyle",
      value: function setShapeStyle(styleOptions) {
        styleOptions = styleOptions || {};
        this.shapeStyle = $.extend({}, true, this.shapeStyle, styleOptions);
      }
      /**
       * @todo Implement
       * @param {Url} linkUrl
       * @param {Integer} index
       * @returns {void}
       */

    }, {
      key: "setUrl",
      value: function setUrl(linkUrl, index) {// eslint-disable-line class-methods-use-this
        // Todo
      }
      /**
       *
       * @param {string} text
       * @param {module:imageMaps.ShapeStyles} [styleOptions]
       * @returns {void}
       */

    }, {
      key: "setTextShape",
      value: function setTextShape(text, styleOptions) {
        this.setShapeStyle(styleOptions);
        this.shapeText = text;
      }
      /**
       *
       * @param {string} imageUrl
       * @param {module:imageMaps.ShapeStyles} [styleOptions]
       * @returns {void}
       */

    }, {
      key: "setImageShape",
      value: function setImageShape(imageUrl, styleOptions) {
        this.setShapeStyle(styleOptions);
        this.shapeImageUrl = imageUrl;
      }
      /**
       *
       * @param {?(module:imageMaps.Coords)} coords
       * @param {Url} linkUrl
       * @param {module:imageMaps.ShapeType} [shapeType]
       * @returns {void}
       */

    }, {
      key: "addShape",
      value: function addShape(coords, linkUrl, shapeType) {
        if (shapeType) {
          this.setShapeType(shapeType);
        }

        this.createMaps(coords, linkUrl);
      }
      /**
       * @param {Integer} [index]
       * @returns {void}
       */

    }, {
      key: "removeShape",
      value: function removeShape(index) {
        if (!this.shapeEl) {
          return;
        }

        if (typeof index === 'undefined') {
          index = this.shapeEl.data('index');
        }

        var areaEl = this.mapEl.find('area[data-index="' + index + '"]');
        var shapeEl = this.svgEl.find('.' + shapeFaceClass + '[data-index="' + index + '"]');
        this.detachEvents(shapeEl, [{
          type: 'click touchend'
        }]);
        shapeEl.parent().remove();
        areaEl.remove();
        this.removeShapeInfo(index);
      }
      /**
       *
       * @returns {void}
       */

    }, {
      key: "removeAllShapes",
      value: function removeAllShapes() {
        var _this = this;

        if (!this.shapeEl) {
          return;
        }

        var allShapeEls = this.svgEl.find('.' + shapeFaceClass);
        allShapeEls.each(function (i, shapeEl) {
          _this.removeShape($(shapeEl).data('index'));
        });
        this.allShapeInfo = {};
      }
      /**
       *
       * @returns {void}
       */

    }, {
      key: "removeImageMaps",
      value: function removeImageMaps() {
        this.removeAllShapes();
        this.svgEl && this.svgEl.remove();
      }
      /**
      * @typedef {PlainObject} module:imageMaps.ShapeInfoOptions
      * @property {Integer} index
      * @property {module:imageMaps.ShapeCoords} coords
      * @property {module:imageMaps.ShapeType} type
      * @property {Url} url
      * @property {module:imageMaps.ShapeStyles} style
      */

      /**
      * @typedef {PlainObject} module:imageMaps.ShapeSecondaryOptions
      * @property {string} text
      * @property {HTMLImageElement|string} href
      */

      /**
       *
       * @param {Integer} index
       * @param {module:imageMaps.ShapeInfoOptions} shapeOptions
       * @param {
       *   module:imageMaps.ShapeSecondaryOptions
       * } [shapeSecondaryOptions]
       * @returns {void}
       */

    }, {
      key: "updateShapeInfo",
      value: function updateShapeInfo(index, shapeOptions, shapeSecondaryOptions) {
        var shapeInfo = this.allShapeInfo;
        shapeOptions.index = index;

        if (!shapeInfo['shape' + index]) {
          shapeInfo['shape' + index] = $.extend(true, shapeOptions, shapeSecondaryOptions);
        } else {
          shapeInfo['shape' + index] = $.extend(true, {}, shapeInfo['shape' + index], shapeOptions, shapeSecondaryOptions);
        }
      }
      /**
       * @param {Integer} index
       * @returns {void}
       */

    }, {
      key: "removeShapeInfo",
      value: function removeShapeInfo(index) {
        delete this.allShapeInfo['shape' + index];
      }
      /**
       *
       * @param {Integer} index
       * @returns {module:imageMaps.ShapeInfoOptions|
       *   module:imageMaps.ShapeSecondaryOptions}
       */

    }, {
      key: "getShapeInfo",
      value: function getShapeInfo(index) {
        return this.allShapeInfo['shape' + index];
      }
      /**
      * @typedef {PlainObject} module:imageMaps.AllShapeInfo
      * @property {module:imageMaps.ShapeType} type
      * @property {module:imageMaps.Coords} coords
      * @property {Integer} index
      * @property {module:imageMaps.ShapeInfoOptions|
      *   module:imageMaps.ShapeSecondaryOptions} shape<num>
      */

      /**
       *
       * @returns {module:imageMaps.AllShapeInfo}
       */

    }, {
      key: "getAllShapesInfo",
      value: function getAllShapesInfo() {
        return $.extend(true, {}, this.allShapeInfo);
      }
      /**
       *
       * @param {Float[]} percentages
       * @returns {void}
       */

    }, {
      key: "zoom",
      value: function zoom(percentages) {
        _zoom.call(this, percentages);
      }
      /**
       *
       * @returns {void}
       */

    }, {
      key: "enableClick",
      value: function enableClick() {
        this.attachEvents(this.svgEl.find('.' + shapeFaceClass), [{
          type: 'touchstart',
          handler: onTouchStart
        }, {
          type: 'click touchend',
          handler: onClickShapeFace
        }]);
      }
      /**
       *
       * @returns {void}
       */

    }, {
      key: "disableClick",
      value: function disableClick() {
        this.detachEvents(this.svgEl.find('.' + shapeFaceClass), [{
          type: 'touchstart',
          handler: onTouchStart
        }, {
          type: 'click touchend',
          handler: onClickShapeFace
        }]);
      }
      /**
       *
       * @param {module:imageMaps.ShapeCoords} coords
       * @returns {void}
       */

    }, {
      key: "setShapeCoords",
      value: function setShapeCoords(coords) {
        this.shapeCoords = coords;
      }
      /**
       *
       * @param {module:imageMaps.VertexCoords} coords
       * @returns {void}
       */

    }, {
      key: "setVertexCoords",
      value: function setVertexCoords(coords) {
        this.vertexCoords = coords;
      }
      /**
       *
       * @param {module:imageMaps.ShapeElement} element
       * @returns {void}
       */

    }, {
      key: "setShapeElement",
      value: function setShapeElement(element) {
        this.shapeEl = element;
      }
      /**
      * @typedef {Element} module:imageMaps.VertexElement
      */

      /**
       *
       * @param {module:imageMaps.VertexElement} element
       * @returns {void}
       */

    }, {
      key: "setVertexElement",
      value: function setVertexElement(element) {
        this.vertexEl = element;
      }
      /**
       *
       * @param {module:imageMaps.VertexElements} elements
       * @returns {void}
       */

    }, {
      key: "setVertexElements",
      value: function setVertexElements(elements) {
        this.vertexEls = elements;
      }
      /**
      * @callback Handler
      * @param {Event} e
      * @param {...any} extraParameters
      * @returns {boolean}
      */

      /**
      * @typedef {PlainObject} module:imageMaps.TypeHandler
      * @property {string} type
      * @property {Handler} handler
      */

      /**
       * ImageMaps: 이미지맵 이벤트 할당.
       * @param {Node|external:jQuery} element
       * @param {module:imageMaps.TypeHandler[]} eventOptions
       * @returns {void}
       */

    }, {
      key: "attachEvents",
      value: function attachEvents(element, eventOptions) {
        var _this2 = this;

        element = $(element);
        eventOptions.forEach(function (_ref) {
          var type = _ref.type,
              handler = _ref.handler;
          element.on(type + '.' + areaClass, $.proxy(handler, _this2));
        });
      }
      /**
       * ImageMaps: 이미지맵 이벤트 해제.
       * @param {external:jQuery} element
       * @param {module:imageMaps.TypeHandler[]} eventOptions
       * @returns {void}
       */

    }, {
      key: "detachEvents",
      value: function detachEvents(element, eventOptions) {
        var _this3 = this;

        element = $(element);
        eventOptions.forEach(function (_ref2) {
          var type = _ref2.type,
              handler = _ref2.handler;
          var eventType = type || '';
          var eventHandler = handler ? $.proxy(handler, _this3) : '';

          if (eventHandler) {
            element.off(eventType + '.' + areaClass, eventHandler);
          } else {
            element.off(eventType + '.' + areaClass);
          }
        });
      }
    }]);

    return ImageMaps;
  }();

  ImageMaps.getCoordsByRatio = getCoordsByRatio;
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {?(module:imageMaps.Coords)} coords
   * @param {Url} linkUrl
   * @returns {void}
   */

  function _createMaps(coords, linkUrl) {
    // 최초 맵영역을 만드는 순간에 map 엘리먼트를 만들고 하위에 area 엘리먼트 생성.
    var uid = guid();

    if (!this.container.attr('usemap')) {
      this.mapEl = $('<map name=' + uid + '></map>').insertAfter(this.container);
      this.container.attr('usemap', '#' + uid);
    } else {
      var usemapName = this.container.attr('usemap').replace('#', '');
      this.mapEl = $('body').find('map[name=' + usemapName + ']');
    }

    this.containerWidth = this.container.width();
    this.containerHeight = this.container.height();
    var imageWidth = this.containerWidth;
    var imageHeight = this.containerHeight;
    var centerX = imageWidth / 2;
    var centerY = imageHeight / 2; // 파라미터로 좌표값을 받으면 좌표에 해당하는 영역을 함께 그려준다.

    var shapeType = this.shapeType;
    var shapeCoords = [];
    var isDefaultTextCoords = false;
    coords = convertStringToNumber(coords);

    if (!Array.isArray(coords)) {
      // default 편집영역의 사이즈는 이미지의 0.1배로 계산. (내 맘대로..)
      var defaultShapeX = imageWidth * 0.1,
          defaultShapeY = imageHeight * 0.1;
      var defaultRadius = defaultShapeX >= defaultShapeY ? defaultShapeY : defaultShapeX; // invalid 좌표값이거나 배열이 아닌 타입일 경우는 디폴트 좌표로 그린다.

      if (shapeType === SHAPE.RECT) {
        shapeCoords = $.extend([], defaultShapeOptions.rect, [centerX - defaultShapeX, centerY - defaultShapeY, centerX + defaultShapeX, centerY + defaultShapeY]);
      } else if (shapeType === SHAPE.CIRCLE) {
        shapeCoords = $.extend([], defaultShapeOptions.circle, [centerX, centerY, defaultRadius]);
      } else if (shapeType === SHAPE.ELLIPSE) {
        shapeCoords = $.extend([], defaultShapeOptions.ellipse, [centerX, centerY, defaultRadius, defaultRadius]);
      } else if (shapeType === SHAPE.IMAGE) {
        var imageSize = getNaturalImageSize(this.shapeImageUrl);
        defaultShapeX = imageSize.width / 2;
        defaultShapeY = imageSize.height / 2;
        shapeCoords = [centerX - defaultShapeX, centerY - defaultShapeY, centerX + defaultShapeX, centerY + defaultShapeY];
      } else ;
    } else {
      // 타입별로 정상적으로 좌표값을 받았다면 해당 좌표로 그린다.
      // eslint-disable-next-line no-lonely-if
      if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
        shapeCoords = $.extend([], defaultShapeOptions.rect, coords);
      } else if (shapeType === SHAPE.CIRCLE) {
        shapeCoords = $.extend([], defaultShapeOptions.circle, coords);
      } else if (shapeType === SHAPE.ELLIPSE) {
        shapeCoords = $.extend([], defaultShapeOptions.ellipse, coords);
      } else if (shapeType === SHAPE.TEXT) {
        if (!coords[0]) {
          coords[0] = centerX;
          isDefaultTextCoords = true;
        }

        if (!coords[1]) {
          coords[1] = centerY;
          isDefaultTextCoords = true;
        }

        if (!coords[2]) {
          coords[2] = 20;
        }

        shapeCoords = $.extend([], defaultShapeOptions.text, coords);
      } else ;
    }

    var index = this.mapEl.find('.' + shapeFaceClass).length;
    var areaType = shapeType;
    var shapeSecondaryOptions = {};

    if (shapeType === SHAPE.TEXT || shapeType === SHAPE.IMAGE) {
      areaType = SHAPE.RECT;
      shapeSecondaryOptions = shapeType === SHAPE.TEXT ? {
        text: this.shapeText
      } : {
        href: this.shapeImageUrl
      };
    }

    createOverlay.call(this, shapeCoords, uid, linkUrl, index);
    this.setShapeCoords(shapeCoords);
    this.updateShapeInfo(index, {
      coords: shapeCoords,
      type: shapeType,
      url: linkUrl,
      style: this.shapeStyle
    }, shapeSecondaryOptions);

    if (isDefaultTextCoords && this.isEditMode && shapeType === SHAPE.TEXT) {
      adjustTextShape.call(this);
    }

    if (shapeType === SHAPE.ELLIPSE) {
      areaType = SHAPE.CIRCLE;
      shapeCoords = [shapeCoords[0], shapeCoords[1], defaultShapeOptions.ellipse[2], defaultShapeOptions.ellipse[2]];
    }

    createArea.call(this, areaType, shapeCoords, linkUrl, index);
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @param {string} uid
   * @param {Url} linkUrl
   * @param {Integer} index
   * @returns {void}
   */


  function createOverlay(shapeCoords, uid, linkUrl, index) {
    var containerWidth = this.container.width(),
        containerHeight = this.container.height();

    if (typeof document.createElementNS !== 'undefined') {
      var svgNativeEl = this.mapEl.find('svg').get(0);
      var svgEl = $(svgNativeEl);
      var shapeType = this.shapeType;

      if (!svgNativeEl) {
        svgNativeEl = document.createElementNS(NS_SVG, 'svg');
        svgEl = $(svgNativeEl);
        this.svgEl = svgEl;

        if (this.isEditMode) {
          this.attachEvents(svgEl, [{
            type: 'mousedown',
            handler: onMouseDown
          }]);
        } else {
          this.attachEvents(this.mapEl, [{
            type: 'touchstart',
            handler: onTouchStart
          }, {
            type: 'click touchend',
            handler: onClickShapeFace
          }]);
        }

        this.attachEvents(window, [{
          type: 'resize',
          handler: onResize
        }]);
      } // svgEl.get(0).setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      // svg의 width, height는 DOM API로 처리해야 사이즈가 제대로 나옴.


      svgNativeEl.setAttribute('width', containerWidth);
      svgNativeEl.setAttribute('height', containerHeight); // container의 부모에 대한 상대좌표에 따라 svg의 좌표값이 결정된다.

      var containerPos = this.container.position();
      svgEl.attr({
        xmlns: NS_SVG,
        'xmlns:xlink': NS_XLINK,
        version: '1.1',
        'data-Id': uid
      }).css({
        position: 'absolute',
        zIndex: 1000,
        overflow: 'hidden',
        top: containerPos.top,
        left: containerPos.left
      });
      var shapeGroupEl = createShape.call(this, shapeType, shapeCoords, linkUrl, index);
      svgEl.append(shapeGroupEl);
      this.mapEl.append(svgEl);
    }
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {string} areaType
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @param {Url} linkUrl
   * @param {string|Integer} index
   * @returns {void}
   */


  function createArea(areaType, shapeCoords, linkUrl, index) {
    $('<area shape=' + areaType + ' coords=' + shapeCoords.join(',') + ' href=' + (linkUrl || '#') + ' data-index=' + index + ' ' + (linkUrl ? 'target="_blank"' : '') + '>').appendTo(this.mapEl);
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {module:imageMaps.ShapeType} shapeType
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @param {Url} linkUrl
   * @param {string|Integer} index
   * @returns {void}
   */


  function createShape(shapeType, shapeCoords, linkUrl, index) {
    if (shapeType === SHAPE.POLY) {
      shapeType = SHAPE.POLYLINE;
    }

    var shapeEl = $(document.createElementNS(NS_SVG, shapeType));
    var gEl = $(document.createElementNS(NS_SVG, 'g'));
    drawShape.call(this, shapeCoords, shapeEl);
    var cursor = 'default';

    if (this.isEditMode) {
      cursor = 'move';
    } else if (linkUrl !== '') {
      cursor = 'pointer';
    }

    this.setShapeStyle({
      cursor: cursor
    });
    shapeEl.css(this.shapeStyle);

    if (shapeType === SHAPE.TEXT) {
      shapeEl.css({
        'fill-opacity': '',
        'stroke-opacity': ''
      });
    }

    shapeEl.attr('data-index', index);
    gEl.append(shapeEl);
    this.setShapeElement(shapeEl);

    if (this.isEditMode && shapeType !== 'text') {
      var vertexEls = createVertex(shapeType, shapeCoords, index);
      gEl.append.apply(gEl, _toConsumableArray(vertexEls));
      this.setVertexElements(vertexEls);
    }

    return gEl;
  }
  /**
  * @typedef {PlainObject} module:imageMaps.ShapeOptions
  * @property {string} text
  * @property {string} href
  * @property {module:imageMaps.ShapeType} type
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @param {module:imageMaps.ShapeElement} [shapeEl]
   * @param {module:imageMaps.ShapeOptions} [shapeOptions]
   * @returns {void}
   */


  function drawShape(shapeCoords, shapeEl, shapeOptions) {
    shapeEl = shapeEl || this.shapeEl;
    var shapeType = shapeOptions ? shapeOptions.type : this.shapeType;

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
      shapeEl.attr({
        x: shapeCoords[0],
        y: shapeCoords[1],
        "class": shapeFaceClass
      });

      if (shapeCoords[2]) {
        shapeEl.attr('width', shapeCoords[2] - shapeCoords[0]);
      }

      if (shapeCoords[3]) {
        shapeEl.attr('height', shapeCoords[3] - shapeCoords[1]);
      }

      if (shapeType === SHAPE.IMAGE) {
        // xlink 속성 설정 시에는 DOM api의 setAttributeNS를 사용해야 함.
        // svg 전용 속성은 무조건 DOM api를 사용해야 함.
        shapeEl.get(0).setAttributeNS(NS_XLINK, 'href', shapeOptions ? shapeOptions.href : this.shapeImageUrl); // image 엘리먼트의 width, height를 고정 비율로 변경되는 걸 해제해주기 위한 속성 셋팅.

        shapeEl.get(0).setAttribute('preserveAspectRatio', 'none');
      }
    } else if (shapeType === SHAPE.CIRCLE) {
      shapeEl.attr({
        cx: shapeCoords[0],
        cy: shapeCoords[1],
        "class": shapeFaceClass
      });

      if (shapeCoords[2]) {
        shapeEl.attr('r', shapeCoords[2]);
      }
    } else if (shapeType === SHAPE.ELLIPSE) {
      shapeEl.attr({
        cx: shapeCoords[0],
        cy: shapeCoords[1],
        "class": shapeFaceClass
      });

      if (shapeCoords[2]) {
        shapeEl.attr('rx', shapeCoords[2]);
      }

      if (shapeCoords[3]) {
        shapeEl.attr('ry', shapeCoords[3]);
      }
    } else if (shapeType === SHAPE.TEXT) {
      shapeEl.attr({
        x: shapeCoords[0],
        y: shapeCoords[1],
        'font-size': shapeCoords[2],
        "class": shapeFaceClass
      });
      shapeEl.text(shapeOptions && shapeOptions.text || this.shapeText);
    } else ;
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @returns {void}
   */


  function adjustTextShape() {
    var shapeEl = this.shapeEl;
    var shapeSize = shapeEl.get(0).getBBox();
    var centerX = shapeSize.width / 2;
    var centerY = Number.parseFloat(shapeEl.attr('font-size')) * FONT_SIZE_RATIO / 2;
    var bottomRightX = Number.parseInt(shapeEl.attr('x'));
    var bottomRightY = Number.parseInt(shapeEl.attr('y'));
    var resultX = bottomRightX - centerX;
    var resultY = bottomRightY + centerY;
    this.updateShapeInfo(shapeEl.data('index'), {
      coords: [resultX, resultY, shapeEl.attr('font-size')]
    });
    shapeEl.attr({
      x: resultX,
      y: resultY
    });
  }
  /**
   * `SVGRect` element for each vertex coordinate.
   * @typedef {SVGRect[]} module:imageMaps.VertexElements One
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {module:imageMaps.ShapeType} shapeType
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @param {Integer} index
   * @returns {module:imageMaps.VertexElements}
   */


  function createVertex(shapeType, shapeCoords, index) {
    var vertexCoords = calculateVertexCoords(shapeType, shapeCoords);
    var vertexTemp = vertexCoords.map(function () {
      var vertexEl = $(document.createElementNS(NS_SVG, 'rect'));
      vertexEl.attr('data-index', index).css({
        fill: '#ffffff',
        stroke: '#000000',
        'stroke-width': 2
      });
      return vertexEl;
    });
    drawVertex(vertexCoords, vertexTemp);
    return vertexTemp;
  }
  /**
  * @typedef {PlainObject} module:imageMaps.VertexCoords
  * @property {Float} x
  * @property {Float} y
  * @property {module:imageMaps.CursorType} type
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {module:imageMaps.VertexCoords} vertexCoords
   * @param {module:imageMaps.VertexElements} vertexEls
   * @param {module:imageMaps.ShapeType} shapeType Not currently in use
   * @returns {void}
   */


  function drawVertex(vertexCoords, vertexEls, shapeType) {
    vertexCoords.forEach(function (eachCoords, i) {
      $(vertexEls[i]).attr({
        x: eachCoords.x - 3,
        y: eachCoords.y - 3,
        width: 7,
        height: 7,
        'data-direction': eachCoords.type,
        "class": shapeVertexClass
      }).css('cursor', getCursor(eachCoords.type));
    });
  }
  /**
  * @typedef {module:imageMaps.Coords} module:imageMaps.ShapeCoords
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {module:imageMaps.ShapeType} shapeType
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @returns {module:imageMaps.VertexCoords}
   */


  function calculateVertexCoords(shapeType, shapeCoords) {
    var vertexArr = [];

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
      // 좌상, 좌하, 우상, 우하, 상, 하, 좌, 우 순
      // 개별 vertex의 좌표값이므로 좌표의 순서는 크게 상관 없지만 참고로...
      vertexArr = [{
        x: shapeCoords[0],
        y: shapeCoords[1],
        type: 'nw'
      }, {
        x: shapeCoords[0],
        y: shapeCoords[3],
        type: 'sw'
      }, {
        x: shapeCoords[2],
        y: shapeCoords[1],
        type: 'ne'
      }, {
        x: shapeCoords[2],
        y: shapeCoords[3],
        type: 'se'
      }, {
        x: (shapeCoords[2] - shapeCoords[0]) / 2 + shapeCoords[0],
        y: shapeCoords[1],
        type: 'n'
      }, {
        x: (shapeCoords[2] - shapeCoords[0]) / 2 + shapeCoords[0],
        y: shapeCoords[3],
        type: 's'
      }, {
        x: shapeCoords[0],
        y: (shapeCoords[3] - shapeCoords[1]) / 2 + shapeCoords[1],
        type: 'w'
      }, {
        x: shapeCoords[2],
        y: (shapeCoords[3] - shapeCoords[1]) / 2 + shapeCoords[1],
        type: 'e'
      }];
    } else if (shapeType === SHAPE.CIRCLE) {
      // 상, 하, 좌, 우
      vertexArr = [{
        x: shapeCoords[0],
        y: shapeCoords[1] - shapeCoords[2],
        type: 'n'
      }, {
        x: shapeCoords[0],
        y: shapeCoords[1] + shapeCoords[2],
        type: 's'
      }, {
        x: shapeCoords[0] - shapeCoords[2],
        y: shapeCoords[1],
        type: 'w'
      }, {
        x: shapeCoords[0] + shapeCoords[2],
        y: shapeCoords[1],
        type: 'e'
      }];
    } else if (shapeType === SHAPE.ELLIPSE) {
      // 상, 하, 좌, 우
      vertexArr = [{
        x: shapeCoords[0],
        y: shapeCoords[1] - shapeCoords[3],
        type: 'n'
      }, {
        x: shapeCoords[0],
        y: shapeCoords[1] + shapeCoords[3],
        type: 's'
      }, {
        x: shapeCoords[0] - shapeCoords[2],
        y: shapeCoords[1],
        type: 'w'
      }, {
        x: shapeCoords[0] + shapeCoords[2],
        y: shapeCoords[1],
        type: 'e'
      }];
    } else ;

    return vertexArr;
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {module:imageMaps.ShapeCoords} shapeCoords
   * @param {Element} areaEl
   * @param {module:imageMaps.ShapeType} [shapeType]
   * @returns {void}
   */


  function drawArea(shapeCoords, areaEl, shapeType) {
    var shapeEl = this.svgEl.find('.' + shapeFaceClass + '[data-index="' + areaEl.data('index') + '"]');
    shapeType = shapeType || this.shapeType;

    if (shapeType === SHAPE.TEXT) {
      shapeCoords = convertTextToRectCoords(shapeEl);
    } else if (shapeType === SHAPE.ELLIPSE) {
      shapeCoords = [shapeCoords[0], shapeCoords[1], defaultShapeOptions.ellipse[2]];
    }

    areaEl.attr('coords', shapeCoords.join(','));
  }
  /**
  * @typedef {"col"|"row"|Direction|"ew"|
  * "ns"|"nesw"|"nwse"} module:imageMaps.CursorType
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {module:imageMaps.CursorType} type
   *     CSS cursor resize type
   * @returns {string}
   */


  function getCursor(type) {
    return type + '-resize';
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Event} e The `touchstart` event
   * @returns {void}
   */


  function onTouchStart(e) {
    var touchCoords = e.originalEvent.touches[0];
    this.touchStartCoords.x = touchCoords.pageX;
    this.touchStartCoords.y = touchCoords.pageY;
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Event} e The `click touchend` event
   * @returns {void}
   */


  function onClickShapeFace(e) {
    // IE8이 이외의 브라우저는 아래 계산 로직을 타지 않아도 된다.
    // IE8은 area 엘리먼트 클릭 시 href 속성의 url로 이동.
    var targetAreaEl = $(e.currentTarget);

    if (e.currentTarget.tagName.toLowerCase() !== 'area') {
      e.preventDefault();

      if (this.dragInfo.face.x && this.dragInfo.face.x !== e.pageX || this.dragInfo.face.y && this.dragInfo.face.y !== e.pageY || e.target.tagName.toLowerCase() === 'svg' || e.type === 'touchend' && e.originalEvent.changedTouches[0].pageX !== this.touchStartCoords.x && e.originalEvent.changedTouches[0].pageY !== this.touchStartCoords.y) {
        return;
      } // 클릭하거나 마우스엔터, 마우스다운 된 shape를 현재 타겟으로 저장.
      // 타겟이 되는 shape의 좌표 정보를 가지고 모든 로직이 수행되도록 한다.


      var targetEl = $(e.target);
      var index = targetEl.attr('data-index');
      targetAreaEl = this.mapEl.find('area[data-index="' + index + '"]');
      var url = targetAreaEl.attr('href');
      url !== '#' && window.open(targetAreaEl.attr('href'));
    }

    this.options.onClick.call(this, e, targetAreaEl.attr('href'));
  } // drag & drop

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Event} e The `mousedown` event
   * @returns {void}
   */


  function onMouseDown(e) {
    e.preventDefault();

    if (e.target.tagName.toLowerCase() === 'svg') {
      return;
    }

    var targetEl = $(e.target);
    var index = targetEl.attr('data-index');
    var shapeInfo = this.getShapeInfo(index);
    var groupEl = targetEl.parent();
    var shapeEl = groupEl.find(':first-child');
    var coords = [];
    var shapeType = shapeEl.get(0).tagName.toLowerCase();

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
      var targetX = Number.parseInt(shapeEl.attr('x'));
      var targetY = Number.parseInt(shapeEl.attr('y'));
      coords = [targetX, targetY, targetX + Number.parseInt(shapeEl.attr('width')), targetY + Number.parseInt(shapeEl.attr('height'))];

      if (shapeType === SHAPE.IMAGE) {
        this.setImageShape(shapeEl.attr('href'));
      }
    } else if (shapeType === SHAPE.CIRCLE) {
      var _targetX = Number.parseInt(shapeEl.attr('cx'));

      var _targetY = Number.parseInt(shapeEl.attr('cy'));

      coords = [_targetX, _targetY, Number.parseInt(shapeEl.attr('r'))];
    } else if (shapeType === SHAPE.ELLIPSE) {
      var _targetX2 = Number.parseInt(shapeEl.attr('cx'));

      var _targetY2 = Number.parseInt(shapeEl.attr('cy'));

      coords = [_targetX2, _targetY2, Number.parseInt(shapeEl.attr('rx')), Number.parseInt(shapeEl.attr('ry'))];
    } else if (shapeType === SHAPE.TEXT) {
      var _targetX3 = Number.parseFloat(shapeEl.attr('x'));

      var _targetY3 = Number.parseFloat(shapeEl.attr('y'));

      var fontSize = Number.parseFloat(shapeEl.attr('font-size'));
      coords = [_targetX3, _targetY3, fontSize];
      this.shapeText = shapeEl.text();
    } else if (shapeType === SHAPE.POLYGON) {
      shapeType = SHAPE.POLY;
    }

    this.setShapeType(shapeType);
    this.setShapeElement(shapeEl);
    this.setShapeCoords(coords);

    if (shapeType !== SHAPE.TEXT) {
      shapeEl.attr('data-fill', shapeEl.css('fill'));
      shapeEl.css('fill', '#ffffff');
      this.setVertexCoords(calculateVertexCoords(shapeType, coords));
      var vertexTemp = [];
      var vertexEls = this.mapEl.find('.' + shapeVertexClass + '[data-index="' + index + '"]');
      vertexEls.each(function () {
        vertexTemp.push($(this));
      });
      this.setVertexElements(vertexTemp);
    }

    if (targetEl.is('.' + shapeFaceClass)) {
      this.grabType = 'face';
      declareShape.call(this, targetEl, e.pageX, e.pageY);
    } else if (targetEl.is('.' + shapeVertexClass)) {
      this.grabType = 'vertex';
      declareVertex.call(this, targetEl, index);
    }

    this.attachEvents(this.mapEl.parent(), [{
      type: 'mouseup',
      handler: onMouseUp
    }, {
      type: 'mousemove',
      handler: onMouseMove
    }]);
    this.options.onSelect.call(this, e, shapeInfo);
    this.options.onMouseDown.call(this, e, shapeType, coords);
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Event} e The `mouseup` event
   * @returns {void}
   */


  function onMouseUp(e) {
    var targetEl = $(e.target);
    var shapeEl = this.shapeEl;
    shapeEl.css('fill', shapeEl.attr('data-fill'));
    targetEl.attr('data-movable', false);
    var updatedCoords = determineShape.call(this);
    this.setShapeCoords(updatedCoords);
    this.updateShapeInfo(shapeEl.data('index'), {
      coords: updatedCoords
    });
    this.detachEvents(this.mapEl.parent(), [{
      type: 'mouseup',
      handler: onMouseUp
    }, {
      type: 'mousemove',
      handler: onMouseMove
    }]);
    this.options.onMouseUp.call(this, e, this.shapeType, updatedCoords);
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Event} e The `mousemove` event
   * @returns {void}
   */


  function onMouseMove(e) {
    var targetEl = $(e.target);

    var _this$shapeCoords = _slicedToArray(this.shapeCoords, 2),
        x = _this$shapeCoords[0],
        y = _this$shapeCoords[1];

    var grabType = this.grabType,
        shapeType = this.shapeType;
    var coords = {}; // 좌표 계산 시 e.offsetX, offsetY값은 이벤트 발생 대상(e.currentTarget)
    //   기준 좌표 값이므로
    // 이벤트 발생 도중(특히 mousemove) 겹치는 이벤트 타겟이 생기면 해당 타겟 기준
    //    좌표로 변경되어 좌표가 튀는 현상 발생.
    // 그러므로 브라우저에서 drag & drop 구현 시 웬만하면 브라우저의 절대 좌표값인
    //    e.pageX, pageY를 사용하도록 한다.

    if (grabType === 'face' || grabType === 'vertex') {
      if (grabType === 'face') {
        var movedX = x + e.pageX;
        var movedY = y + e.pageY;
        coords = getMovedShapeCoords.call(this, movedX - this.dragInfo.face.x, movedY - this.dragInfo.face.y);
      } else if (grabType === 'vertex') {
        coords = getMovedVertexCoords.call(this, e.pageX - this.svgEl.offset().left, e.pageY - this.svgEl.offset().top);
      }

      if (!coords) {
        return;
      }

      if (shapeType !== SHAPE.TEXT) {
        this.setVertexCoords(coords.vertexCoords);
        drawVertex(coords.vertexCoords, this.vertexEls, this.shapeType);
      }

      var index = Number.parseInt(coords.grabEl.attr('data-index'));
      drawShape.call(this, coords.movedCoords, this.svgEl.find('.' + shapeFaceClass + '[data-index="' + index + '"]'));
      drawArea.call(this, coords.movedCoords, this.mapEl.find('area[data-index="' + index + '"]')); // svg 내 엘리먼트들은 z-index 영향을 받지 않고 document 순서에 영향을 받는다.
      // 그래서 drag 시 다른 요소들보다 최상위에 두려면 엘리먼트 순서를 부모의 가장 하위에 두어야 한다.
      // mousedown에서 이 로직을 넣을 경우,
      // 외부에서 click 이벤트를 할당했을 때 mousedown 핸들러에서 dom 우선순위 조정하는 과정에서
      //    click 이벤트가 해제되는 이슈로 mousemove 안에 둠.

      if ((targetEl.is('.' + shapeFaceClass) || targetEl.is('.' + shapeVertexClass)) && (Math.abs(this.dragInfo.face.x - e.pageX) <= 1 || Math.abs(this.dragInfo.face.y - e.pageY) <= 1)) {
        this.svgEl.append(targetEl.parent());
      }

      this.options.onMouseMove.call(this, e, shapeType, coords.movedCoords);
    }
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Event} e The `resize` event
   * @returns {void}
   */


  function onResize(e) {
    var containerWidth = this.container.width();
    var containerHeight = this.container.height();

    if (this.containerWidth !== containerWidth || this.containerHeight !== containerHeight) {
      redraw.call(this, containerWidth, containerHeight);
    }
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Float[]} percentages
   * @returns {void}
   */


  function _zoom(percentages) {
    var _this4 = this;

    var widthPercentage = percentages[0];
    var heightPercentage = percentages.length < 2 ? widthPercentage : percentages[1];
    var containerWidth = widthPercentage * 0.01 * this.container.width();
    var containerHeight = heightPercentage * 0.01 * this.container.height();
    this.container.css({
      width: containerWidth + 'px',
      height: containerHeight + 'px'
    });
    setTimeout(function () {
      if (_this4.svgEl && _this4.svgEl.length > 0) {
        redraw.call(_this4, containerWidth, containerHeight);
      }
    });
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Float} containerWidth
   * @param {Float} containerHeight
   * @returns {void}
   */


  function redraw(containerWidth, containerHeight) {
    var _this5 = this;

    var allShapeInfo = this.allShapeInfo;
    var widthRatio = containerWidth / this.containerWidth;
    var heightRatio = containerHeight / this.containerHeight;
    var containerPos = this.container.position();
    this.svgEl.get(0).setAttribute('width', containerWidth);
    this.svgEl.get(0).setAttribute('height', containerHeight);
    this.svgEl.css({
      top: containerPos.top,
      left: containerPos.left
    });
    $.each(allShapeInfo, function (index, item) {
      item.coords = getCoordsByRatio(item.coords, item.type, widthRatio, heightRatio);
      drawVertex(calculateVertexCoords(item.type, item.coords), _this5.svgEl.find('.' + shapeVertexClass + '[data-index="' + item.index + '"]'), item.type);
      drawShape.call(_this5, item.coords, _this5.svgEl.find('.' + shapeFaceClass + '[data-index="' + item.index + '"]'), item);
      drawArea.call(_this5, item.coords, _this5.mapEl.find('area[data-index="' + item.index + '"]'), item.type);
    });
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
  }
  /**
  * @typedef {Element} module:imageMaps.ShapeElement
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {module:imageMaps.ShapeElement} shapeEl
   * @param {Float} x
   * @param {Float} y
   * @returns {void}
   */


  function declareShape(shapeEl, x, y) {
    this.dragInfo.face.x = x;
    this.dragInfo.face.y = y;
    shapeEl.attr('data-movable', true);
  }
  /**
  * @typedef {PlainObject} module:imageMaps.MovedCoords
  * @property {module:imageMaps.Coords} movedCoords
  * @property {module:imageMaps.VertexCoords} vertexCoords
  * @property {module:imageMaps.ShapeElement} grabEl
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Float} x
   * @param {Float} y
   * @returns {module:imageMaps.MovedCoords|void}
   */


  function getMovedShapeCoords(x, y) {
    var shapeEl = this.shapeEl;

    if (shapeEl.attr('data-movable') === 'false') {
      return undefined;
    }

    var movedCoords = [];
    var vertexCoords = [];
    var shapeType = this.shapeType;

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
      var width = Number.parseInt(shapeEl.attr('width'));
      var height = Number.parseInt(shapeEl.attr('height'));
      var movedBottomRightX = x + width;
      var movedBottomRightY = y + height;
      movedCoords = [x, y, movedBottomRightX, movedBottomRightY];
      vertexCoords = calculateVertexCoords(SHAPE.RECT, movedCoords);
    } else if (shapeType === SHAPE.CIRCLE) {
      movedCoords = [x, y, Number.parseInt(shapeEl.attr('r'))];
      vertexCoords = calculateVertexCoords(SHAPE.CIRCLE, movedCoords);
    } else if (shapeType === SHAPE.ELLIPSE) {
      movedCoords = [x, y, Number.parseInt(shapeEl.attr('rx')), Number.parseInt(shapeEl.attr('ry'))];
      vertexCoords = calculateVertexCoords(SHAPE.ELLIPSE, movedCoords);
    } else if (shapeType === SHAPE.TEXT) {
      movedCoords = [x, y];
    } else ;

    return {
      movedCoords: movedCoords,
      vertexCoords: vertexCoords,
      grabEl: shapeEl
    };
  }
  /**
  * @typedef {GenericArray} module:imageMaps.Coords
  * @property {Float} 0
  * @property {Float} 1
  * @property {Float} 2
  * @property {Float} 3
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @returns {module:imageMaps.Coords}
   */


  function determineShape() {
    var shapeEl = this.shapeEl,
        shapeType = this.shapeType;
    var updatedCoords = [];

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
      var x = Number.parseInt(shapeEl.attr('x'));
      var y = Number.parseInt(shapeEl.attr('y'));
      updatedCoords = [x, y, x + Number.parseInt(shapeEl.attr('width')), y + Number.parseInt(shapeEl.attr('height'))];
    } else if (shapeType === SHAPE.CIRCLE) {
      updatedCoords = [Number.parseInt(shapeEl.attr('cx')), Number.parseInt(shapeEl.attr('cy')), Number.parseInt(shapeEl.attr('r'))];
    } else if (shapeType === SHAPE.ELLIPSE) {
      updatedCoords = [Number.parseInt(shapeEl.attr('cx')), Number.parseInt(shapeEl.attr('cy')), Number.parseInt(shapeEl.attr('rx')), Number.parseInt(shapeEl.attr('ry'))];
    } else if (shapeType === SHAPE.TEXT) {
      updatedCoords = [Number.parseInt(shapeEl.attr('x')), Number.parseInt(shapeEl.attr('y'))];
    } else ;

    return updatedCoords;
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {external:jQuery} vertexEl
   * @param {Integer} index Not currently in use
   * @returns {void}
   */


  function declareVertex(vertexEl, index) {
    this.setVertexElement(vertexEl);
    var vertexIndex = 0;
    this.vertexEls.forEach(function (item, idx) {
      if (vertexEl.get(0) === item.get(0)) {
        vertexIndex = idx;
      }
    });
    var coords = this.vertexCoords[vertexIndex];
    this.dragInfo.vertex.x = coords.x;
    this.dragInfo.vertex.y = coords.y;
    vertexEl.attr('data-movable', true);
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Float} x
   * @param {Float} y
   * @returns {module:imageMaps.MovedVertexCoords|void}
   */


  function getMovedVertexCoords(x, y) {
    if (this.vertexEl.attr('data-movable') === 'false') {
      return undefined;
    }

    var movedCoords = [];
    var vertexCoords = [];
    var shapeType = this.shapeType;
    var direction = this.vertexEl.attr('data-direction');

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
      switch (direction) {
        // 좌상
        case 'nw':
          movedCoords = getValidCoordsForRect.call(this, [x, y, this.shapeCoords[2], this.shapeCoords[3]], direction);
          break;
        // 좌하

        case 'sw':
          movedCoords = getValidCoordsForRect.call(this, [x, this.shapeCoords[1], this.shapeCoords[2], y], direction);
          break;
        // 우상

        case 'ne':
          movedCoords = getValidCoordsForRect.call(this, [this.shapeCoords[0], y, x, this.shapeCoords[3]], direction);
          break;
        // 우하

        case 'se':
          movedCoords = getValidCoordsForRect.call(this, [this.shapeCoords[0], this.shapeCoords[1], x, y], direction);
          break;
        // 상

        case 'n':
          movedCoords = getValidCoordsForRect.call(this, [this.shapeCoords[0], y, this.shapeCoords[2], this.shapeCoords[3]], direction);
          break;
        // 하

        case 's':
          movedCoords = getValidCoordsForRect.call(this, [this.shapeCoords[0], this.shapeCoords[1], this.shapeCoords[2], y], direction);
          break;
        // 좌

        case 'w':
          movedCoords = getValidCoordsForRect.call(this, [x, this.shapeCoords[1], this.shapeCoords[2], this.shapeCoords[3]], direction);
          break;
        // 우

        case 'e':
          movedCoords = getValidCoordsForRect.call(this, [this.shapeCoords[0], this.shapeCoords[1], x, this.shapeCoords[3]], direction);
          break;

        default:
          // eslint-disable-next-line no-console
          console.warn('Unexpected direction', direction);
          break;
      }
    } else if (shapeType === SHAPE.CIRCLE) {
      switch (direction) {
        case 'n':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], getValidCoordsForCircle.call(this, this.shapeCoords[1] - y)];
          break;

        case 's':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], getValidCoordsForCircle.call(this, y - this.shapeCoords[1])];
          break;

        case 'w':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], getValidCoordsForCircle.call(this, this.shapeCoords[0] - x)];
          break;

        case 'e':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], getValidCoordsForCircle.call(this, x - this.shapeCoords[0])];
          break;

        default:
          // eslint-disable-next-line no-console
          console.warn('Unexpected direction', direction);
          break;
      }
    } else if (shapeType === SHAPE.ELLIPSE) {
      switch (direction) {
        case 'n':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], this.shapeCoords[2], getValidCoordsForCircle.call(this, this.shapeCoords[1] - y)];
          break;

        case 's':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], this.shapeCoords[2], getValidCoordsForCircle.call(this, y - this.shapeCoords[1])];
          break;

        case 'w':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], getValidCoordsForCircle.call(this, this.shapeCoords[0] - x), this.shapeCoords[3]];
          break;

        case 'e':
          movedCoords = [this.shapeCoords[0], this.shapeCoords[1], getValidCoordsForCircle.call(this, x - this.shapeCoords[0]), this.shapeCoords[3]];
          break;

        default:
          // eslint-disable-next-line no-console
          console.warn('Unexpected direction', direction);
          break;
      }
    } else ;

    vertexCoords = calculateVertexCoords(shapeType, movedCoords);
    return {
      movedCoords: movedCoords,
      vertexCoords: vertexCoords,
      grabEl: this.vertexEl
    };
  }
  /**
  * @typedef {"se"|"sw"|"ne"|"nw"|"w"|"s"|"n"|"e"} module:imageMaps.Direction
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {module:imageMaps.RectCoords} coords
   * @param {module:imageMaps.Direction} direction
   * @returns {module:imageMaps.RectCoords}
   */


  function getValidCoordsForRect(coords, direction) {
    var _coords = _slicedToArray(coords, 4),
        topLeftX = _coords[0],
        topLeftY = _coords[1],
        bottomRightX = _coords[2],
        bottomRightY = _coords[3];

    if (bottomRightX - topLeftX <= this.shapeLimitCoords.x) {
      if (direction === 'se' || direction === 'ne' || direction === 'e') {
        bottomRightX = topLeftX + this.shapeLimitCoords.x;
      }

      if (direction === 'nw' || direction === 'sw' || direction === 'w') {
        topLeftX = bottomRightX - this.shapeLimitCoords.x;
      }
    }

    if (bottomRightY - topLeftY <= this.shapeLimitCoords.y) {
      if (direction === 'se' || direction === 'sw' || direction === 's') {
        bottomRightY = topLeftY + this.shapeLimitCoords.y;
      }

      if (direction === 'nw' || direction === 'ne' || direction === 'n') {
        topLeftY = bottomRightY - this.shapeLimitCoords.y;
      }
    }

    return [topLeftX, topLeftY, bottomRightX, bottomRightY];
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @this module:imageMaps~ImageMaps
   * @param {Float} coordsDiff
   * @returns {Float}
   */


  function getValidCoordsForCircle(coordsDiff) {
    var radius;

    if (coordsDiff <= this.shapeLimitCoords.radius) {
      radius = this.shapeLimitCoords.radius;
    } else {
      radius = coordsDiff;
    }

    return radius;
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {module:imageMaps.Coords} coords
   * @param {module:imageMaps.ShapeType} shapeType
   * @param {Float} widthRatio
   * @param {Float} heightRatio
   * @returns {module:imageMaps.Coords}
   */


  function getCoordsByRatio(coords, shapeType, widthRatio, heightRatio) {
    var adjustCoords = [];

    if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE || shapeType === SHAPE.ELLIPSE) {
      adjustCoords = [coords[0] * widthRatio, coords[1] * heightRatio, coords[2] * widthRatio, coords[3] * heightRatio];
    } else if (shapeType === SHAPE.CIRCLE) {
      var radiusRatio;
      radiusRatio = widthRatio >= heightRatio ? heightRatio : widthRatio;

      if (widthRatio === 1) {
        radiusRatio = heightRatio;
      }

      if (heightRatio === 1) {
        radiusRatio = widthRatio;
      }

      adjustCoords = [coords[0] * widthRatio, coords[1] * heightRatio, coords[2] * radiusRatio];
    } else if (shapeType === SHAPE.TEXT) {
      adjustCoords = [coords[0] * widthRatio, coords[1] * heightRatio, coords[2] * widthRatio];
    } else ;

    return adjustCoords;
  }
  /**
  * @typedef {GenericArray} module:imageMaps.RectCoords
  * @property {Float} 0
  * @property {Float} 1
  * @property {Float} 2
  * @property {Float} 3
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {module:imageMaps.ShapeElement} shapeEl
   * @returns {module:imageMaps.RectCoords}
   */


  function convertTextToRectCoords(shapeEl) {
    var bottomLeftX = Number.parseFloat(shapeEl.attr('x'));
    var bottomLeftY = Number.parseFloat(shapeEl.attr('y'));
    var shapeSize = shapeEl.get(0).getBBox();
    var width = shapeSize.width;
    var height = Number.parseFloat(shapeEl.attr('font-size')) * FONT_SIZE_RATIO / 2;
    return [bottomLeftX, bottomLeftY - height, bottomLeftX + width, bottomLeftY];
  }
  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {string} [coords]
   * @returns {?(Float[])}
   */


  function convertStringToNumber(coords) {
    if (!coords) {
      return null;
    }

    return _toConsumableArray(coords).map(function (ch) {
      return Number.parseFloat(ch);
    });
  } //   UTIL FUNCTIONS

  /**
   * GUID: img의 usemap 속성, map의 name 속성을 unique id로 생성.
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   * @returns {string}
   */


  function guid() {
    /**
     * @memberof module:imageMaps.jqueryImageMaps~guid.
     * @static
     * @returns {string}
     */
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  /**
  * @typedef {PlainObject} module:imageMaps.Dimensions
  * @property {Float} width
  * @property {Float} height
  */

  /**
   * @memberof module:imageMaps.jqueryImageMaps~
   * @static
   * @param {HTMLImageElement|string} imageElOrUrl
   * @todo If this is to handle an image element, other contexts which use
   *    the passed in URL should also
   * @returns {module:imageMaps.Dimensions}
   */


  function getNaturalImageSize(imageElOrUrl) {
    var imageObj = new Image();

    if ('naturalWidth' in imageObj && typeof imageElOrUrl !== 'string') {
      return {
        width: imageElOrUrl.naturalWidth,
        height: imageElOrUrl.naturalHeight
      };
    }

    if (typeof imageElOrUrl === 'string') {
      imageElOrUrl = {
        src: imageElOrUrl
      };
    }

    imageObj.src = imageElOrUrl.src;
    return {
      width: imageObj.width,
      height: imageObj.height
    };
  }

  $.fn.extend({
    /**
     * @function external:"jQuery.fn".createMaps
     * @param {?(module:imageMaps.Coords)} coords
     * @param {Url} linkUrl
     * @returns {external:jQuery}
     */
    createMaps: function createMaps(coords, linkUrl) {
      this.data('image_maps_inst').createMaps(coords, linkUrl);
      return this;
    },

    /**
     *
     * @param {external:jQuery} targetEl
     * @returns {external:jQuery}
     */
    copyImageMapsTo: function copyImageMapsTo(targetEl) {
      $.imageMaps.copyImageMaps({
        shapes: this.getAllShapes(),
        width: this.width(),
        height: this.height()
      }, targetEl);
      return this;
    },

    /**
     * @function external:"jQuery.fn".addShape
     * @param {?(module:imageMaps.Coords)} coords
     * @param {Url} linkUrl
     * @param {module:imageMaps.ShapeType} shapeType
     * @returns {external:jQuery}
     */
    addShape: function addShape(coords, linkUrl, shapeType) {
      this.data('image_maps_inst').addShape(coords, linkUrl, shapeType);
      return this;
    },

    /**
     * @function external:"jQuery.fn".removeShape
     * @param {Integer} [index]
     * @returns {external:jQuery}
     */
    removeShape: function removeShape(index) {
      this.data('image_maps_inst').removeShape(index);
      return this;
    },

    /**
     * @function external:"jQuery.fn".removeAllShapes
     * @returns {external:jQuery}
     */
    removeAllShapes: function removeAllShapes() {
      this.data('image_maps_inst').removeAllShapes();
      return this;
    },

    /**
     * @function external:"jQuery.fn".destroy
     * @returns {void}
     */
    destroy: function destroy() {
      var imageMapsObj = this.data('image_maps_inst');

      if (!imageMapsObj) {
        return;
      }

      imageMapsObj.removeImageMaps();
      this.data('image_maps_inst', null);
    },

    /**
     * @function external:"jQuery.fn".setShapeStyle
     * @param {module:imageMaps.ShapeStyles} [styleOptions]
     * @returns {external:jQuery}
     */
    setShapeStyle: function setShapeStyle(styleOptions) {
      this.data('image_maps_inst').setShapeStyle(styleOptions);
      return this;
    },

    /**
     * @function external:"jQuery.fn".setUrl
     * @param {Url} linkUrl
     * @param {Integer} index
     * @returns {external:jQuery}
     */
    setUrl: function setUrl(linkUrl, index) {
      this.data('image_maps_inst').setUrl(linkUrl, index);
      return this;
    },

    /**
     * @function external:"jQuery.fn".setTextShape
     * @param {string} text
     * @param {module:imageMaps.ShapeStyles} [styleOptions]
     * @returns {external:jQuery}
     */
    setTextShape: function setTextShape(text, styleOptions) {
      this.data('image_maps_inst').setTextShape(text, styleOptions);
      return this;
    },

    /**
     * @function external:"jQuery.fn".setImageShape
     * @param {Url} imageUrl
     * @param {module:imageMaps.ShapeStyles} [styleOptions]
     * @returns {external:jQuery}
     */
    setImageShape: function setImageShape(imageUrl, styleOptions) {
      this.data('image_maps_inst').setImageShape(imageUrl, styleOptions);
      return this;
    },

    /**
     * @function external:"jQuery.fn".enableClick
     * @returns {void}
     */
    enableClick: function enableClick() {
      this.data('image_maps_inst').enableClick();
    },

    /**
     * @function external:"jQuery.fn".disableClick
     * @returns {void}
     */
    disableClick: function disableClick() {
      this.data('image_maps_inst').disableClick();
    },

    /**
     * @function external:"jQuery.fn".getAllShapes
     * @returns {module:imageMaps.AllShapeInfo}
     */
    getAllShapes: function getAllShapes() {
      return this.data('image_maps_inst').getAllShapesInfo();
    },

    /**
     * @function external:"jQuery.fn".getCoordsByRatio
     * @param {module:imageMaps.Coords} coords
     * @param {module:imageMaps.ShapeType} shapeType
     * @param {Float} widthRatio
     * @param {Float} heightRatio
     * @returns {module:imageMaps.Coords}
     */
    getCoordsByRatio: function getCoordsByRatio(coords, shapeType, widthRatio, heightRatio) {
      return ImageMaps.getCoordsByRatio(coords, shapeType, widthRatio, heightRatio);
    },

    /**
     * @function external:"jQuery.fn".zoom
     * @param {Float[]} percentages
     * @returns {void}
     */
    zoom: function zoom(percentages) {
      this.data('image_maps_inst').zoom(percentages);
    }
  });
  $.imageMaps = {
    /**
    * @typedef {PlainObject} module:imageMaps.SourceInfo
    * @property {module:imageMaps.AllShapeInfo} shapes
    * @property {Float} width
    * @property {Float} height
    */

    /**
     * @param {module:imageMaps.SourceInfo} sourceInfo
     * @param {external:jQuery} targetEl
     * @returns {void}
     */
    copyImageMaps: function copyImageMaps(_ref3, targetEl) {
      var shapes = _ref3.shapes,
          width = _ref3.width,
          height = _ref3.height;
      targetEl.removeAllShapes();
      $.each(shapes, function (index, item) {
        targetEl.setShapeStyle(item.style);

        if (item.href) {
          targetEl.setImageShape(item.href);
        }

        if (item.text) {
          targetEl.setTextShape(item.text);
        }

        var widthRatio = width;
        var heightRatio = height;
        var newCoords = getCoordsByRatio(item.coords, item.type, targetEl.width() / widthRatio, targetEl.height() / heightRatio);
        targetEl.addShape(newCoords, item.url, item.type);
      });
    }
  };
  /**
   * @function external:"jQuery.fn".imageMaps
   * @this external:jQuery
   * @param {module:imageMaps.ImageMapOptions} [options]
   * @throws {Error}
   * @returns {module:imageMaps.ImageMaps|void}
   */

  $.fn.imageMaps = function (options) {
    if (this.length === 1) {
      if (!this.data('image_maps_inst')) {
        var imageMapsInst = new ImageMaps(this, options);
        this.data('image_maps_inst', imageMapsInst);
        return imageMapsInst;
      }

      return this.data('image_maps_inst');
    }

    if (this.length > 1) {
      throw new Error('imageMaps instance has already been created.');
    }

    return undefined;
  };

  return $;
}

export default jqueryImageMaps;
