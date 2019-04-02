// The MIT License (MIT)

// Copyright (c) 2016 NAVER Corp.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
* imageMaps 1.1.0
* jquery plugin which can be partially linked to the image
*
* https://github.com/naver/ImageMaps
* demo - http://naver.github.io/ImageMaps/
*
* Released on: July 6, 2016
*/

/**
* @external jQuery
*/
/**
 * @typedef {number} Integer
 */
/**
 * @typedef {number} Float
 */
/**
* @typedef {String} Url
*/
/**
 * @typedef {object} PlainObject
 */
/**
* @typedef {Array} GenericArray
*/

/**
* @typedef
* {"rect"|"circle"|"ellipse"|"text"|"image"|"poly"|"polyline"|"polygon"}
* ShapeType
*/

const SHAPE = {
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
 * @typedef {PlainObject} ShapeStyles
*/

/**
* @typedef {PlainObject} ImageMapOptions
* @property {boolean} [isEditMode=false]
* @property {ShapeType} [shape="rect"]
* @property {string} [shapeText="press on link"]
* @property {ShapeStyles} [shapeStyle] Defaults to
*   `{fill: '#ffffff', 'fill-opacity': 0.2,
*     stroke: '#ffffff', 'stroke-width': 3}`
* @property {function} [onClick=function () {}]
* @property {function} [onMouseDown=function () {}]
* @property {function} [onMouseMove=function () {}]
* @property {function} [onMouseUp=function () {}]
* @property {function} [onSelect=function () {}]
*/

/**
 * @type {ImageMapOptions}
 */
const defaults = {
    isEditMode: false,
    // select map area shape type - rect, circle, text, image, poly
    shape: SHAPE.RECT,
    shapeText: 'press on link', // shape 옵션이 text일 때 적용된다.
    shapeStyle: {
        fill: '#ffffff',
        'fill-opacity': 0.2,
        stroke: '#ffffff',
        'stroke-width': 3
    },
    /* eslint-disable no-empty-function */
    onClick () {},
    onMouseDown () {},
    onMouseMove () {},
    onMouseUp () {},
    onSelect () {}
    /* eslint-enable no-empty-function */
};

const defaultShapeOptions = {
    // top-left-x, top-left-y, bottom-right-x, botton-right-y
    rect: [0, 0, 20, 20],
    circle: [0, 0, 10], // center-x, center-y, radius
    ellipse: [0, 0, 5, 5], // center-x, center-y, radius-x, radius-y
    text: [0, 0, 12] // bottom-right-x, bottom-right-y, font-size
};

const FONT_SIZE_RATIO = 0.5;

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_XLINK = 'http://www.w3.org/1999/xlink';

/**
 *
 * @param {jQuery} $
 * @returns {jQuery}
 */
function jqueryImageMaps ($) {
    // The actual plugin constructor
    class ImageMaps {
        /**
         *
         * @param {jQuery} container
         * @param {ImageMapOptions} options
         */
        constructor (container, options) {
            this.container = $(container);
            this.mapEl = null;
            this.svgEl = null;
            // merge the default options with user-provided options

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
                x: null, y: null
            };
            this.dragInfo = {
                face: {x: null, y: null},
                vertex: {x: null, y: null}
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
         * @param {Coords} coords
         * @param {Url} linkUrl
         * @returns {undefined}
         */
        createMaps (coords, linkUrl) {
            const imageWidth = this.container.width();

            if (isNaN(imageWidth) || !imageWidth) {
                this.container.one(
                    'load',
                    $.proxy(createMaps, this, coords, linkUrl)
                );
            } else {
                createMaps.call(this, coords, linkUrl);
            }
        }

        /**
         * @param {ShapeType} shapeType
         * @returns {undefined}
         */
        setShapeType (shapeType) {
            this.shapeType = shapeType;
        }

        /**
         *
         * @param {ShapeStyles} styleOptions
         * @returns {undefined}
         */
        setShapeStyle (styleOptions) {
            styleOptions = styleOptions || {};
            this.shapeStyle = $.extend({}, true, this.shapeStyle, styleOptions);
        }

        /**
         * @todo Implement
         * @param {Url} linkUrl
         * @param {Integer} index
         * @returns {undefined}
         */
        setUrl (linkUrl, index) { // eslint-disable-line class-methods-use-this
            // Todo
        }

        /**
         *
         * @param {string} text
         * @param {ShapeStyles} styleOptions
         * @returns {undefined}
         */
        setTextShape (text, styleOptions) {
            this.setShapeStyle(styleOptions);
            this.shapeText = text;
        }

        /**
         *
         * @param {string} imageUrl
         * @param {ShapeStyles} styleOptions
         * @returns {undefined}
         */
        setImageShape (imageUrl, styleOptions) {
            this.setShapeStyle(styleOptions);
            this.shapeImageUrl = imageUrl;
        }

        /**
         *
         * @param {Coords} coords
         * @param {Url} linkUrl
         * @param {ShapeType} shapeType
         * @returns {undefined}
         */
        addShape (coords, linkUrl, shapeType) {
            if (shapeType) {
                this.setShapeType(shapeType);
            }
            this.createMaps(coords, linkUrl);
        }

        /**
         * @param {Integer} index
         * @returns {undefined}
         */
        removeShape (index) {
            if (!this.shapeEl) {
                return;
            }

            if (typeof index === 'undefined') {
                index = this.shapeEl.data('index');
            }

            const areaEl = this.mapEl.find('area[data-index="' + index + '"]');
            const shapeEl = this.svgEl.find(
                '._shape_face[data-index="' + index + '"]'
            );

            this.detachEvents(shapeEl, [{
                type: 'click touchend'
            }]);

            shapeEl.parent().remove();
            areaEl.remove();

            this.removeShapeInfo(index);
        }

        /**
         *
         * @returns {undefined}
         */
        removeAllShapes () {
            if (!this.shapeEl) {
                return;
            }

            const allShapeEls = this.svgEl.find('._shape_face');

            allShapeEls.each((i, shapeEl) => {
                this.removeShape($(shapeEl).data('index'));
            });

            this.allShapeInfo = {};
        }

        /**
         *
         * @returns {undefined}
         */
        removeImageMaps () {
            this.removeAllShapes();
            this.svgEl && this.svgEl.remove();
        }

        /**
        * @typedef {PlainObject} ShapeInfoOptions
        * @property {Integer} index
        * @property {ShapeCoords} coords
        * @property {ShapeType} type
        * @property {Url} url
        * @property {ShapeStyles} style
        */

        /**
        * @typedef {PlainObject} ShapeSecondaryOptions
        * @property {string} text
        * @property {HTMLImageElement|string} href
        */

        /**
         *
         * @param {Integer} index
         * @param {ShapeInfoOptions} shapeOptions
         * @param {ShapeSecondaryOptions} shapeSecondaryOptions
         * @returns {undefined}
         */
        updateShapeInfo (index, shapeOptions, shapeSecondaryOptions) {
            const shapeInfo = this.allShapeInfo;

            shapeOptions.index = index;
            if (!shapeInfo['shape' + index]) {
                shapeInfo['shape' + index] = $.extend(
                    true, shapeOptions, shapeSecondaryOptions
                );
            } else {
                shapeInfo['shape' + index] = $.extend(
                    true,
                    {},
                    shapeInfo['shape' + index],
                    shapeOptions,
                    shapeSecondaryOptions
                );
            }
        }

        /**
         * @param {Integer} index
         * @returns {undefined}
         */
        removeShapeInfo (index) {
            delete this.allShapeInfo['shape' + index];
        }

        /**
         *
         * @param {Integer} index
         * @returns {ShapeInfoOptions|ShapeSecondaryOptions}
         */
        getShapeInfo (index) {
            return this.allShapeInfo['shape' + index];
        }

        /**
        * @typedef {PlainObject} AllShapeInfo
        * @property {ShapeType} type
        * @property {Coords} coords
        * @property {Integer} index
        * @property {ShapeInfoOptions|ShapeSecondaryOptions} shape<num>
        */
        /**
         *
         * @returns {AllShapeInfo}
         */
        getAllShapesInfo () {
            return $.extend(true, {}, this.allShapeInfo);
        }

        /**
         *
         * @param {Float[]} percentages
         * @returns {undefined}
         */
        zoom (percentages) {
            zoom.call(this, percentages);
        }

        /**
         *
         * @returns {undefined}
         */
        enableClick () {
            this.attachEvents(this.svgEl.find('._shape_face'), [{
                type: 'touchstart', handler: onTouchStart
            }, {
                type: 'click touchend', handler: onClickShapeFace
            }]);
        }

        /**
         *
         * @returns {undefined}
         */
        disableClick () {
            this.detachEvents(this.svgEl.find('._shape_face'), [{
                type: 'touchstart', handler: onTouchStart
            }, {
                type: 'click touchend', handler: onClickShapeFace
            }]);
        }

        /**
         *
         * @param {ShapeCoords} coords
         * @returns {undefined}
         */
        setShapeCoords (coords) {
            this.shapeCoords = coords;
        }

        /**
         *
         * @param {VertexCoords} coords
         * @returns {undefined}
         */
        setVertexCoords (coords) {
            this.vertexCoords = coords;
        }

        /**
         *
         * @param {ShapeElement} element
         * @returns {undefined}
         */
        setShapeElement (element) {
            this.shapeEl = element;
        }

        /**
        * @typedef {Element} VertexElement
        */
        /**
         *
         * @param {VertexElement} element
         * @returns {undefined}
         */
        setVertexElement (element) {
            this.vertexEl = element;
        }

        /**
         *
         * @param {VertexElements} elements
         * @returns {undefined}
         */
        setVertexElements (elements) {
            this.vertexEls = elements;
        }

        /**
        * @typedef {PlainObject} TypeHandler
        * @property {string} type
        * @property {function} handler
        */
        /**
         * ImageMaps: 이미지맵 이벤트 할당.
         * @param {Node|jQuery} element
         * @param {TypeHandler[]} eventOptions
         * @returns {undefined}
         */
        attachEvents (element, eventOptions) {
            element = $(element);

            eventOptions.forEach(({type, handler}) => {
                element.on(
                    type + '.area',
                    $.proxy(handler, this)
                );
            });
        }

        /**
         * ImageMaps: 이미지맵 이벤트 해제.
         * @param {jQuery} element
         * @param {TypeHandler[]} eventOptions
         * @returns {undefined}
         */
        detachEvents (element, eventOptions) {
            element = $(element);

            eventOptions.forEach(({type, handler}) => {
                const eventType = type || '';
                const eventHandler = handler
                    ? $.proxy(handler, this)
                    : '';

                if (eventHandler) {
                    element.off(eventType + '.area', eventHandler);
                } else {
                    element.off(eventType + '.area');
                }
            });
        }
    }
    ImageMaps.getCoordsByRatio = getCoordsByRatio;

    /**
     * @this ImageMaps
     * @param {Coords} coords
     * @param {Url} linkUrl
     * @returns {undefined}
     */
    function createMaps (coords, linkUrl) {
        // 최초 맵영역을 만드는 순간에 map 엘리먼트를 만들고 하위에 area 엘리먼트 생성.
        const uid = guid();
        if (!this.container.attr('usemap')) {
            this.mapEl = $(
                '<map name=' + uid + '></map>'
            ).insertAfter(this.container);
            this.container.attr('usemap', '#' + uid);
        } else {
            const usemapName = this.container.attr('usemap').replace('#', '');
            this.mapEl = $('body').find('map[name=' + usemapName + ']');
        }

        this.containerWidth = this.container.width();
        this.containerHeight = this.container.height();

        const imageWidth = this.containerWidth;
        const imageHeight = this.containerHeight;
        const centerX = imageWidth / 2;
        const centerY = imageHeight / 2;

        // 파라미터로 좌표값을 받으면 좌표에 해당하는 영역을 함께 그려준다.
        const {shapeType} = this;

        let shapeCoords = [];
        let isDefaultTextCoords = false;

        coords = convertStringToNumber(coords);
        if (!(Array.isArray(coords))) {
            // default 편집영역의 사이즈는 이미지의 0.1배로 계산. (내 맘대로..)
            let defaultShapeX = imageWidth * 0.1,
                defaultShapeY = imageHeight * 0.1;
            const defaultRadius = (defaultShapeX >= defaultShapeY)
                ? defaultShapeY
                : defaultShapeX;
            // invalid 좌표값이거나 배열이 아닌 타입일 경우는 디폴트 좌표로 그린다.
            if (shapeType === SHAPE.RECT) {
                shapeCoords = $.extend([], defaultShapeOptions.rect, [
                    centerX - defaultShapeX,
                    centerY - defaultShapeY,
                    centerX + defaultShapeX,
                    centerY + defaultShapeY
                ]);
            } else if (shapeType === SHAPE.CIRCLE) {
                shapeCoords = $.extend([], defaultShapeOptions.circle, [
                    centerX,
                    centerY,
                    defaultRadius
                ]);
            } else if (shapeType === SHAPE.ELLIPSE) {
                shapeCoords = $.extend([], defaultShapeOptions.ellipse, [
                    centerX,
                    centerY,
                    defaultRadius,
                    defaultRadius
                ]);
            } else if (shapeType === SHAPE.IMAGE) {
                const imageSize = getNaturalImageSize(this.shapeImageUrl);
                defaultShapeX = imageSize.width / 2;
                defaultShapeY = imageSize.height / 2;
                shapeCoords = [
                    centerX - defaultShapeX,
                    centerY - defaultShapeY,
                    centerX + defaultShapeX,
                    centerY + defaultShapeY
                ];
            } else if (shapeType === SHAPE.POLY) {
                // Todo
            }
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
            } else if (shapeType === SHAPE.POLY) {
                // Todo
            }
        }

        const index = this.mapEl.find('._shape_face').length;
        let areaType = shapeType;
        let shapeSecondaryOptions = {};

        if (shapeType === SHAPE.TEXT || shapeType === SHAPE.IMAGE) {
            areaType = SHAPE.RECT;

            if (shapeType === SHAPE.TEXT) {
                shapeSecondaryOptions = {text: this.shapeText};
            } else {
                shapeSecondaryOptions = {href: this.shapeImageUrl};
            }
        }

        createOverlay.call(this, shapeCoords, uid, linkUrl, index);
        this.setShapeCoords(shapeCoords);
        this.updateShapeInfo(index, {
            coords: shapeCoords,
            type: shapeType,
            url: linkUrl,
            style: this.shapeStyle
        }, shapeSecondaryOptions);

        if (isDefaultTextCoords && this.isEditMode &&
            shapeType === SHAPE.TEXT
        ) {
            adjustTextShape.call(this);
        }

        if (shapeType === SHAPE.ELLIPSE) {
            areaType = SHAPE.CIRCLE;
            shapeCoords = [
                shapeCoords[0],
                shapeCoords[1],
                defaultShapeOptions.ellipse[2],
                defaultShapeOptions.ellipse[2]
            ];
        }

        createArea.call(this, areaType, shapeCoords, linkUrl, index);
    }

    /**
     * @this ImageMaps
     * @param {ShapeCoords} shapeCoords
     * @param {string} uid
     * @param {Url} linkUrl
     * @param {Integer} index
     * @returns {undefined}
     */
    function createOverlay (shapeCoords, uid, linkUrl, index) {
        const containerWidth = this.container.width(),
            containerHeight = this.container.height();

        if (typeof document.createElementNS !== 'undefined') {
            let svgNativeEl = this.mapEl.find('svg').get(0);
            let svgEl = $(svgNativeEl);
            const {shapeType} = this;

            if (!svgNativeEl) {
                svgNativeEl = document.createElementNS(NS_SVG, 'svg');
                svgEl = $(svgNativeEl);
                this.svgEl = svgEl;

                if (this.isEditMode) {
                    this.attachEvents(svgEl, [{
                        type: 'mousedown', handler: onMouseDown
                    }]);
                } else {
                    this.attachEvents(this.mapEl, [{
                        type: 'touchstart', handler: onTouchStart
                    }, {
                        type: 'click touchend', handler: onClickShapeFace
                    }]);
                }
                this.attachEvents(window, [{
                    type: 'resize', handler: onResize
                }]);
            }

            // svgEl.get(0).setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            // svg의 width, height는 DOM API로 처리해야 사이즈가 제대로 나옴.
            svgNativeEl.setAttribute('width', containerWidth);
            svgNativeEl.setAttribute('height', containerHeight);

            // container의 부모에 대한 상대좌표에 따라 svg의 좌표값이 결정된다.
            const containerPos = this.container.position();
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

            const shapeGroupEl = createShape.call(
                this,
                shapeType,
                shapeCoords,
                linkUrl,
                index
            );
            svgEl.append(shapeGroupEl);
            this.mapEl.append(svgEl);
        }
    }

    /**
     * @this ImageMaps
     * @param {string} areaType
     * @param {ShapeCoords} shapeCoords
     * @param {Url} linkUrl
     * @param {string|Integer} index
     * @returns {undefined}
     */
    function createArea (areaType, shapeCoords, linkUrl, index) {
        $(
            '<area shape=' + areaType +
                ' coords=' + shapeCoords.join(',') +
                ' href=' + (linkUrl || '#') +
                ' data-index=' + index + ' ' +
                (linkUrl ? 'target="_blank"' : '') +
                '>'
        ).appendTo(this.mapEl);
    }

    /**
     * @this ImageMaps
     * @param {ShapeType} shapeType
     * @param {ShapeCoords} shapeCoords
     * @param {Url} linkUrl
     * @param {string|Integer} index
     * @returns {undefined}
     */
    function createShape (shapeType, shapeCoords, linkUrl, index) {
        if (shapeType === SHAPE.POLY) {
            shapeType = SHAPE.POLYLINE;
        }

        const shapeEl = $(document.createElementNS(NS_SVG, shapeType));
        const gEl = $(document.createElementNS(NS_SVG, 'g'));

        drawShape.call(this, shapeCoords, shapeEl);

        let cursor = 'default';
        if (this.isEditMode) {
            cursor = 'move';
        } else if (linkUrl !== '') {
            cursor = 'pointer';
        }
        this.setShapeStyle({cursor});
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
            const vertexEls = createVertex(shapeType, shapeCoords, index);
            gEl.append(...vertexEls);
            this.setVertexElements(vertexEls);
        }

        return gEl;
    }

    /**
    * @typedef {PlainObject} ShapeOptions
    * @property {string} text
    * @property {string} href
    * @property {ShapeType} type
    */

    /**
     * @this ImageMaps
     * @param {ShapeCoords} shapeCoords
     * @param {ShapeElement} shapeEl
     * @param {ShapeOptions} shapeOptions
     * @returns {undefined}
     */
    function drawShape (shapeCoords, shapeEl, shapeOptions) {
        shapeEl = shapeEl || this.shapeEl;
        const shapeType = shapeOptions ? shapeOptions.type : this.shapeType;

        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            shapeEl.attr({
                x: shapeCoords[0],
                y: shapeCoords[1],
                class: '_shape_face'
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
                shapeEl.get(0).setAttributeNS(
                    NS_XLINK,
                    'href',
                    (shapeOptions ? shapeOptions.href : this.shapeImageUrl)
                );
                // image 엘리먼트의 width, height를 고정 비율로 변경되는 걸 해제해주기 위한 속성 셋팅.
                shapeEl.get(0).setAttribute('preserveAspectRatio', 'none');
            }
        } else if (shapeType === SHAPE.CIRCLE) {
            shapeEl.attr({
                cx: shapeCoords[0],
                cy: shapeCoords[1],
                class: '_shape_face'
            });
            if (shapeCoords[2]) {
                shapeEl.attr('r', shapeCoords[2]);
            }
        } else if (shapeType === SHAPE.ELLIPSE) {
            shapeEl.attr({
                cx: shapeCoords[0],
                cy: shapeCoords[1],
                class: '_shape_face'
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
                class: '_shape_face'
            });
            shapeEl.text((shapeOptions && shapeOptions.text) || this.shapeText);
        } else if (shapeType === SHAPE.POLY) {
            // Todo
        }
    }

    /**
     * @this ImageMaps
     * @returns {undefined}
     */
    function adjustTextShape () {
        const {shapeEl} = this;
        const shapeSize = shapeEl.get(0).getBBox();
        const centerX = shapeSize.width / 2;
        const centerY = parseFloat(
            shapeEl.attr('font-size')
        ) * FONT_SIZE_RATIO / 2;
        const bottomRightX = parseInt(shapeEl.attr('x'));
        const bottomRightY = parseInt(shapeEl.attr('y'));
        const resultX = bottomRightX - centerX;
        const resultY = bottomRightY + centerY;

        this.updateShapeInfo(shapeEl.data('index'), {
            coords: [resultX, resultY, shapeEl.attr('font-size')]
        });

        shapeEl.attr({
            x: resultX,
            y: resultY
        });
    }

    /**
    * @typedef {SVGRect[]} VertexElements One `SVGRect` element for each
    *     vertex coordinate
    */

    /**
     * @static
     * @param {ShapeType} shapeType
     * @param {ShapeCoords} shapeCoords
     * @param {Integer} index
     * @returns {VertexElements}
     */
    function createVertex (shapeType, shapeCoords, index) {
        const vertexCoords = calculateVertexCoords(shapeType, shapeCoords);

        const vertexTemp = vertexCoords.map(() => {
            const vertexEl = $(document.createElementNS(NS_SVG, 'rect'));
            vertexEl.attr('data-index', index).css({
                fill: '#ffffff',
                stroke: '#000000',
                'stroke-width': 2
            });
            return vertexEl;
        });

        drawVertex(vertexCoords, vertexTemp, shapeType);

        return vertexTemp;
    }

    /**
    * @typedef {PlainObject} VertexCoords
    * @property {Float} x
    * @property {Float} y
    * @property {CursorType} type
    */

    /**
     * @static
     * @param {VertexCoords} vertexCoords
     * @param {VertexElements} vertexEls
     * @param {ShapeType} shapeType
     * @returns {undefined}
     */
    function drawVertex (vertexCoords, vertexEls, shapeType) {
        vertexCoords.forEach((eachCoords, i) => {
            $(vertexEls[i]).attr({
                x: eachCoords.x - 3,
                y: eachCoords.y - 3,
                width: 7,
                height: 7,
                'data-direction': eachCoords.type,
                class: '_shape_vertex'
            }).css('cursor', getCursor(eachCoords.type));
        });
    }

    /**
    * @typedef {Coords} ShapeCoords
    */

    /**
     * @static
     * @param {ShapeType} shapeType
     * @param {ShapeCoords} shapeCoords
     * @returns {VertexCoords}
     */
    function calculateVertexCoords (shapeType, shapeCoords) {
        let vertexArr = [];

        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            // 좌상, 좌하, 우상, 우하, 상, 하, 좌, 우 순
            // 개별 vertex의 좌표값이므로 좌표의 순서는 크게 상관 없지만 참고로...
            vertexArr = [{
                x: shapeCoords[0], y: shapeCoords[1], type: 'nw'
            }, {
                x: shapeCoords[0], y: shapeCoords[3], type: 'sw'
            }, {
                x: shapeCoords[2], y: shapeCoords[1], type: 'ne'
            }, {
                x: shapeCoords[2], y: shapeCoords[3], type: 'se'
            }, {
                x: (shapeCoords[2] - shapeCoords[0]) / 2 + shapeCoords[0],
                y: shapeCoords[1], type: 'n'
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
                x: shapeCoords[0], y: shapeCoords[1] - shapeCoords[2], type: 'n'
            }, {
                x: shapeCoords[0], y: shapeCoords[1] + shapeCoords[2], type: 's'
            }, {
                x: shapeCoords[0] - shapeCoords[2], y: shapeCoords[1], type: 'w'
            }, {
                x: shapeCoords[0] + shapeCoords[2], y: shapeCoords[1], type: 'e'
            }];
        } else if (shapeType === SHAPE.ELLIPSE) {
            // 상, 하, 좌, 우
            vertexArr = [{
                x: shapeCoords[0], y: shapeCoords[1] - shapeCoords[3], type: 'n'
            }, {
                x: shapeCoords[0], y: shapeCoords[1] + shapeCoords[3], type: 's'
            }, {
                x: shapeCoords[0] - shapeCoords[2], y: shapeCoords[1], type: 'w'
            }, {
                x: shapeCoords[0] + shapeCoords[2], y: shapeCoords[1], type: 'e'
            }];
        } else if (shapeType === SHAPE.POLY) {
            // Todo
        }

        return vertexArr;
    }

    /**
     * @this ImageMaps
     * @param {ShapeCoords} shapeCoords
     * @param {Element} areaEl
     * @param {ShapeType} shapeType
     * @returns {undefined}
     */
    function drawArea (shapeCoords, areaEl, shapeType) {
        const shapeEl = this.svgEl.find(
            '._shape_face[data-index="' + areaEl.data('index') + '"]'
        );
        shapeType = shapeType || this.shapeType;

        if (shapeType === SHAPE.TEXT) {
            shapeCoords = convertTextToRectCoords(shapeEl);
        } else if (shapeType === SHAPE.ELLIPSE) {
            shapeCoords = [
                shapeCoords[0],
                shapeCoords[1],
                defaultShapeOptions.ellipse[2]
            ];
        }
        areaEl.attr('coords', shapeCoords.join(','));
    }

    /**
    * @typedef {"col"|"row"|Direction|"ew"|"ns"|"nesw"|"nwse"} CursorType
    */
    /**
     * @static
     * @param {CursorType} type
     *     CSS cursor resize type
     * @returns {string}
     */
    function getCursor (type) {
        return type + '-resize';
    }

    /**
     * @this ImageMaps
     * @param {Event} e
     * @returns {undefined}
     */
    function onTouchStart (e) {
        const touchCoords = e.originalEvent.touches[0];
        this.touchStartCoords.x = touchCoords.pageX;
        this.touchStartCoords.y = touchCoords.pageY;
    }

    /**
     * @this ImageMaps
     * @param {Event} e
     * @returns {undefined}
     */
    function onClickShapeFace (e) {
        // IE8이 이외의 브라우저는 아래 계산 로직을 타지 않아도 된다.
        // IE8은 area 엘리먼트 클릭 시 href 속성의 url로 이동.
        let targetAreaEl;
        if (e.currentTarget.tagName.toLowerCase() !== 'area') {
            e.preventDefault();
            if ((this.dragInfo.face.x && this.dragInfo.face.x !== e.pageX) ||
                (this.dragInfo.face.y && this.dragInfo.face.y !== e.pageY) ||
                e.target.tagName.toLowerCase() === 'svg' ||
                (e.type === 'touchend' &&
                    e.originalEvent.changedTouches[0].pageX !==
                      this.touchStartCoords.x &&
                    e.originalEvent.changedTouches[0].pageY !==
                      this.touchStartCoords.y)
            ) {
                return;
            }

            // 클릭하거나 마우스엔터, 마우스다운 된 shape를 현재 타겟으로 저장.
            // 타겟이 되는 shape의 좌표 정보를 가지고 모든 로직이 수행되도록 한다.
            const targetEl = $(e.target);
            const index = targetEl.attr('data-index');
            targetAreaEl = this.mapEl.find('area[data-index="' + index + '"]');
            const url = targetAreaEl.attr('href');

            (url !== '#') && window.open(targetAreaEl.attr('href'));
        }

        this.options.onClick.call(this, e, targetAreaEl.attr('href'));
    }

    // drag & drop

    /**
     * @this ImageMaps
     * @param {Event} e
     * @returns {undefined}
     */
    function onMouseDown (e) {
        e.preventDefault();

        if (e.target.tagName.toLowerCase() === 'svg') {
            return;
        }

        const targetEl = $(e.target);
        const index = targetEl.attr('data-index');
        const shapeInfo = this.getShapeInfo(index);
        const groupEl = targetEl.parent();
        const shapeEl = groupEl.find(':first-child');
        let coords = [];
        let shapeType = shapeEl.get(0).tagName.toLowerCase();

        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            const targetX = parseInt(shapeEl.attr('x'));
            const targetY = parseInt(shapeEl.attr('y'));
            coords = [
                targetX,
                targetY,
                targetX + parseInt(shapeEl.attr('width')),
                targetY + parseInt(shapeEl.attr('height'))
            ];
            if (shapeType === SHAPE.IMAGE) {
                this.setImageShape(shapeEl.attr('href'));
            }
        } else if (shapeType === SHAPE.CIRCLE) {
            const targetX = parseInt(shapeEl.attr('cx'));
            const targetY = parseInt(shapeEl.attr('cy'));
            coords = [targetX, targetY, parseInt(shapeEl.attr('r'))];
        } else if (shapeType === SHAPE.ELLIPSE) {
            const targetX = parseInt(shapeEl.attr('cx'));
            const targetY = parseInt(shapeEl.attr('cy'));
            coords = [
                targetX, targetY,
                parseInt(shapeEl.attr('rx')),
                parseInt(shapeEl.attr('ry'))
            ];
        } else if (shapeType === SHAPE.TEXT) {
            const targetX = parseFloat(shapeEl.attr('x'));
            const targetY = parseFloat(shapeEl.attr('y'));
            const fontSize = parseFloat(shapeEl.attr('font-size'));
            coords = [targetX, targetY, fontSize];
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

            const vertexTemp = [];
            const vertexEls = this.mapEl.find(
                '._shape_vertex[data-index="' + index + '"]'
            );
            vertexEls.each(function () {
                vertexTemp.push($(this));
            });
            this.setVertexElements(vertexTemp);
        }

        if (targetEl.is('._shape_face')) {
            this.grabType = 'face';
            declareShape.call(this, targetEl, e.pageX, e.pageY);
        } else if (targetEl.is('._shape_vertex')) {
            this.grabType = 'vertex';
            declareVertex.call(this, targetEl, index);
        }

        this.attachEvents(this.mapEl.parent(), [{
            type: 'mouseup', handler: onMouseUp
        }, {
            type: 'mousemove', handler: onMouseMove
        }]);

        this.options.onSelect.call(this, e, shapeInfo);
        this.options.onMouseDown.call(this, e, shapeType, coords);
    }

    /**
     * @this ImageMaps
     * @param {Event} e
     * @returns {undefined}
     */
    function onMouseUp (e) {
        const targetEl = $(e.target);
        const {shapeEl} = this;

        shapeEl.css('fill', shapeEl.attr('data-fill'));
        targetEl.attr('data-movable', false);

        const updatedCoords = determineShape.call(this);
        this.setShapeCoords(updatedCoords);
        this.updateShapeInfo(shapeEl.data('index'), {coords: updatedCoords});

        this.detachEvents(this.mapEl.parent(), [{
            type: 'mouseup', handler: onMouseUp
        }, {
            type: 'mousemove', handler: onMouseMove
        }]);

        this.options.onMouseUp.call(this, e, this.shapeType, updatedCoords);
    }

    /**
     * @this ImageMaps
     * @param {Event} e
     * @returns {undefined}
     */
    function onMouseMove (e) {
        const targetEl = $(e.target);
        const [x, y] = this.shapeCoords;
        const {grabType, shapeType} = this;
        let coords = {};

        // 좌표 계산 시 e.offsetX, offsetY값은 이벤트 발생 대상(e.currentTarget)
        //   기준 좌표 값이므로
        // 이벤트 발생 도중(특히 mousemove) 겹치는 이벤트 타겟이 생기면 해당 타겟 기준
        //    좌표로 변경되어 좌표가 튀는 현상 발생.
        // 그러므로 브라우저에서 drag & drop 구현 시 웬만하면 브라우저의 절대 좌표값인
        //    e.pageX, pageY를 사용하도록 한다.
        if (grabType === 'face' || grabType === 'vertex') {
            if (grabType === 'face') {
                const movedX = x + e.pageX;
                const movedY = y + e.pageY;

                coords = getMovedShapeCoords.call(
                    this,
                    movedX - this.dragInfo.face.x,
                    movedY - this.dragInfo.face.y
                );
            } else if (grabType === 'vertex') {
                coords = getMovedVertexCoords.call(
                    this,
                    e.pageX - this.svgEl.offset().left,
                    e.pageY - this.svgEl.offset().top
                );
            }
            if (!coords) {
                return;
            }

            if (shapeType !== SHAPE.TEXT) {
                this.setVertexCoords(coords.vertexCoords);
                drawVertex(coords.vertexCoords, this.vertexEls, this.shapeType);
            }
            const index = parseInt(coords.grabEl.attr('data-index'));
            drawShape.call(
                this,
                coords.movedCoords,
                this.svgEl.find('._shape_face[data-index="' + index + '"]')
            );
            drawArea.call(
                this,
                coords.movedCoords,
                this.mapEl.find('area[data-index="' + index + '"]')
            );

            // svg 내 엘리먼트들은 z-index 영향을 받지 않고 document 순서에 영향을 받는다.
            // 그래서 drag 시 다른 요소들보다 최상위에 두려면 엘리먼트 순서를 부모의 가장 하위에 두어야 한다.
            // mousedown에서 이 로직을 넣을 경우,
            // 외부에서 click 이벤트를 할당했을 때 mousedown 핸들러에서 dom 우선순위 조정하는 과정에서
            //    click 이벤트가 해제되는 이슈로 mousemove 안에 둠.
            if (
                (
                    targetEl.is('._shape_face') ||
                    targetEl.is('._shape_vertex')
                ) &&
                (Math.abs(this.dragInfo.face.x - e.pageX) <= 1 ||
                    Math.abs(this.dragInfo.face.y - e.pageY) <= 1)
            ) {
                this.svgEl.append(targetEl.parent());
            }

            this.options.onMouseMove.call(
                this,
                e,
                shapeType,
                coords.movedCoords
            );
        }
    }

    /**
     * @this ImageMaps
     * @param {Event} e
     * @returns {undefined}
     */
    function onResize (e) {
        const containerWidth = this.container.width();
        const containerHeight = this.container.height();

        if (this.containerWidth !== containerWidth ||
            this.containerHeight !== containerHeight
        ) {
            redraw.call(this, containerWidth, containerHeight);
        }
    }

    /**
     * @this ImageMaps
     * @param {Float[]} percentages
     * @returns {undefined}
     */
    function zoom (percentages) {
        const widthPercentage = percentages[0];
        const heightPercentage = (percentages.length < 2)
            ? widthPercentage
            : percentages[1];
        const containerWidth = widthPercentage * 0.01 * this.container.width();
        const containerHeight = heightPercentage * 0.01 *
            this.container.height();

        this.container.css({
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        });

        setTimeout(() => {
            if (this.svgEl && this.svgEl.length > 0) {
                redraw.call(this, containerWidth, containerHeight);
            }
        });
    }

    /**
     * @this ImageMaps
     * @param {Float} containerWidth
     * @param {Float} containerHeight
     * @returns {undefined}
     */
    function redraw (containerWidth, containerHeight) {
        const {allShapeInfo} = this;
        const widthRatio = containerWidth / this.containerWidth;
        const heightRatio = containerHeight / this.containerHeight;
        const containerPos = this.container.position();

        this.svgEl.get(0).setAttribute('width', containerWidth);
        this.svgEl.get(0).setAttribute('height', containerHeight);
        this.svgEl.css({
            top: containerPos.top,
            left: containerPos.left
        });

        $.each(allShapeInfo, (index, item) => {
            item.coords = getCoordsByRatio(
                item.coords, item.type, widthRatio, heightRatio
            );

            drawVertex(
                calculateVertexCoords(item.type, item.coords),
                this.svgEl.find(
                    '._shape_vertex[data-index="' + item.index + '"]'
                ),
                item.type
            );
            drawShape.call(
                this,
                item.coords,
                this.svgEl.find(
                    '._shape_face[data-index="' + item.index + '"]'
                ),
                item
            );
            drawArea.call(
                this,
                item.coords,
                this.mapEl.find('area[data-index="' + item.index + '"]'),
                item.type
            );
        });

        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
    }

    /**
    * @typedef {Element} ShapeElement
    */

    /**
     * @this ImageMaps
     * @param {ShapeElement} shapeEl
     * @param {Float} x
     * @param {Float} y
     * @returns {undefined}
     */
    function declareShape (shapeEl, x, y) {
        this.dragInfo.face.x = x;
        this.dragInfo.face.y = y;

        shapeEl.attr('data-movable', true);
    }

    /**
    * @typedef {PlainObject} MovedCoords
    * @property {Coords} movedCoords,
    * @property {VertexCoords} vertexCoords,
    * @property {ShapeElement} grabEl
    */

    /**
     * @this ImageMaps
     * @param {Float} x
     * @param {Float} y
     * @returns {MovedCoords|undefined}
     */
    function getMovedShapeCoords (x, y) {
        const {shapeEl} = this;
        if (shapeEl.attr('data-movable') === 'false') {
            return undefined;
        }

        let movedCoords = [];
        let vertexCoords = [];
        const {shapeType} = this;

        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            const width = parseInt(shapeEl.attr('width'));
            const height = parseInt(shapeEl.attr('height'));
            const movedBottomRightX = x + width;
            const movedBottomRightY = y + height;

            movedCoords = [x, y, movedBottomRightX, movedBottomRightY];
            vertexCoords = calculateVertexCoords(SHAPE.RECT, movedCoords);
        } else if (shapeType === SHAPE.CIRCLE) {
            movedCoords = [x, y, parseInt(shapeEl.attr('r'))];
            vertexCoords = calculateVertexCoords(SHAPE.CIRCLE, movedCoords);
        } else if (shapeType === SHAPE.ELLIPSE) {
            movedCoords = [
                x,
                y,
                parseInt(shapeEl.attr('rx')),
                parseInt(shapeEl.attr('ry'))
            ];
            vertexCoords = calculateVertexCoords(SHAPE.ELLIPSE, movedCoords);
        } else if (shapeType === SHAPE.TEXT) {
            movedCoords = [x, y];
        } else if (shapeType === SHAPE.POLY) {
            // Todo
        }

        return {
            movedCoords,
            vertexCoords,
            grabEl: shapeEl
        };
    }

    /**
    * @typedef {GenericArray} Coords
    * @property {Float} 0
    * @property {Float} 1
    * @property {Float} 2
    * @property {Float} 3
    */

    /**
     * @this ImageMaps
     * @returns {Coords}
     */
    function determineShape () {
        const {shapeEl, shapeType} = this;
        let updatedCoords = [];

        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            const x = parseInt(shapeEl.attr('x'));
            const y = parseInt(shapeEl.attr('y'));
            updatedCoords = [
                x,
                y,
                x + parseInt(shapeEl.attr('width')),
                y + parseInt(shapeEl.attr('height'))
            ];
        } else if (shapeType === SHAPE.CIRCLE) {
            updatedCoords = [
                parseInt(shapeEl.attr('cx')),
                parseInt(shapeEl.attr('cy')),
                parseInt(shapeEl.attr('r'))
            ];
        } else if (shapeType === SHAPE.ELLIPSE) {
            updatedCoords = [
                parseInt(shapeEl.attr('cx')),
                parseInt(shapeEl.attr('cy')),
                parseInt(shapeEl.attr('rx')),
                parseInt(shapeEl.attr('ry'))
            ];
        } else if (shapeType === SHAPE.TEXT) {
            updatedCoords = [
                parseInt(shapeEl.attr('x')),
                parseInt(shapeEl.attr('y'))
            ];
        } else if (shapeType === SHAPE.POLY) {
            // Todo
        }

        return updatedCoords;
    }

    /**
     * @this ImageMaps
     * @param {jQuery} vertexEl
     * @param {Integer} index
     * @returns {undefined}
     */
    function declareVertex (vertexEl, index) {
        this.setVertexElement(vertexEl);

        let vertexIndex = 0;
        this.vertexEls.forEach((item, idx) => {
            if (vertexEl.get(0) === item.get(0)) {
                vertexIndex = idx;
            }
        });

        const coords = this.vertexCoords[vertexIndex];
        this.dragInfo.vertex.x = coords.x;
        this.dragInfo.vertex.y = coords.y;

        vertexEl.attr('data-movable', true);
    }

    /**
     * @this ImageMaps
     * @param {Float} x
     * @param {Float} y
     * @returns {undefined|MovedVertexCoords}
     */
    function getMovedVertexCoords (x, y) {
        if (this.vertexEl.attr('data-movable') === 'false') {
            return undefined;
        }

        let movedCoords = [];
        let vertexCoords = [];

        const {shapeType} = this;
        const direction = this.vertexEl.attr('data-direction');
        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            switch (direction) {
            default:
                // eslint-disable-next-line no-console
                console.warn('Unexpected direction', direction);
                break;
            // 좌상
            case 'nw':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [x, y, this.shapeCoords[2], this.shapeCoords[3]],
                    direction
                );
                break;
            // 좌하
            case 'sw':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [x, this.shapeCoords[1], this.shapeCoords[2], y],
                    direction
                );
                break;
            // 우상
            case 'ne':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [this.shapeCoords[0], y, x, this.shapeCoords[3]],
                    direction
                );
                break;
            // 우하
            case 'se':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [this.shapeCoords[0], this.shapeCoords[1], x, y],
                    direction
                );
                break;
            // 상
            case 'n':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [
                        this.shapeCoords[0],
                        y,
                        this.shapeCoords[2],
                        this.shapeCoords[3]
                    ],
                    direction
                );
                break;
            // 하
            case 's':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [
                        this.shapeCoords[0],
                        this.shapeCoords[1],
                        this.shapeCoords[2],
                        y
                    ],
                    direction
                );
                break;
            // 좌
            case 'w':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [
                        x,
                        this.shapeCoords[1],
                        this.shapeCoords[2],
                        this.shapeCoords[3]
                    ],
                    direction
                );
                break;
            // 우
            case 'e':
                movedCoords = getValidCoordsForRect.call(
                    this,
                    [
                        this.shapeCoords[0],
                        this.shapeCoords[1],
                        x,
                        this.shapeCoords[3]
                    ],
                    direction
                );
                break;
            }
        } else if (shapeType === SHAPE.CIRCLE) {
            switch (direction) {
            default:
                // eslint-disable-next-line no-console
                console.warn('Unexpected direction', direction);
                break;
            case 'n':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    getValidCoordsForCircle.call(
                        this,
                        this.shapeCoords[1] - y
                    )
                ];
                break;
            case 's':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    getValidCoordsForCircle.call(this, y - this.shapeCoords[1])
                ];
                break;
            case 'w':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    getValidCoordsForCircle.call(this, this.shapeCoords[0] - x)
                ];
                break;
            case 'e':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    getValidCoordsForCircle.call(this, x - this.shapeCoords[0])
                ];
                break;
            }
        } else if (shapeType === SHAPE.ELLIPSE) {
            switch (direction) {
            default:
                // eslint-disable-next-line no-console
                console.warn('Unexpected direction', direction);
                break;
            case 'n':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    this.shapeCoords[2],
                    getValidCoordsForCircle.call(this, this.shapeCoords[1] - y)
                ];
                break;
            case 's':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    this.shapeCoords[2],
                    getValidCoordsForCircle.call(this, y - this.shapeCoords[1])
                ];
                break;
            case 'w':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    getValidCoordsForCircle.call(this, this.shapeCoords[0] - x),
                    this.shapeCoords[3]
                ];
                break;
            case 'e':
                movedCoords = [
                    this.shapeCoords[0],
                    this.shapeCoords[1],
                    getValidCoordsForCircle.call(this, x - this.shapeCoords[0]),
                    this.shapeCoords[3]
                ];
                break;
            }
        } else if (shapeType === SHAPE.POLY) {
            // polygon의 경우, 드래그 되는 좌표에 따라 이벤트 대상 vertex의 x, y 좌표가 자유롭게 변경.
        }

        vertexCoords = calculateVertexCoords(shapeType, movedCoords);

        return {
            movedCoords,
            vertexCoords,
            grabEl: this.vertexEl
        };
    }

    /**
    * @typedef {"se"|"sw"|"ne"|"nw"|"w"|"s"|"n"|"e"} Direction
    */

    /**
     * @this ImageMaps
     * @param {RectCoords} coords
     * @param {Direction} direction
     * @returns {RectCoords}
     */
    function getValidCoordsForRect (coords, direction) {
        let [topLeftX, topLeftY, bottomRightX, bottomRightY] = coords;

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
     * @this ImageMaps
     * @param {Float} coordsDiff
     * @returns {Float}
     */
    function getValidCoordsForCircle (coordsDiff) {
        let radius;

        if (coordsDiff <= this.shapeLimitCoords.radius) {
            ({radius} = this.shapeLimitCoords);
        } else {
            radius = coordsDiff;
        }

        return radius;
    }

    /**
     * @static
     * @param {Coords} coords
     * @param {ShapeType} shapeType
     * @param {Float} widthRatio
     * @param {Float} heightRatio
     * @returns {Coords}
     */
    function getCoordsByRatio (coords, shapeType, widthRatio, heightRatio) {
        let adjustCoords = [];

        if (shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE ||
            shapeType === SHAPE.ELLIPSE
        ) {
            adjustCoords = [
                coords[0] * widthRatio,
                coords[1] * heightRatio,
                coords[2] * widthRatio,
                coords[3] * heightRatio
            ];
        } else if (shapeType === SHAPE.CIRCLE) {
            let radiusRatio = 1;

            if (widthRatio >= heightRatio) {
                radiusRatio = heightRatio;
            } else {
                radiusRatio = widthRatio;
            }

            if (widthRatio === 1) {
                radiusRatio = heightRatio;
            }

            if (heightRatio === 1) {
                radiusRatio = widthRatio;
            }

            adjustCoords = [
                coords[0] * widthRatio,
                coords[1] * heightRatio,
                coords[2] * radiusRatio
            ];
        } else if (shapeType === SHAPE.TEXT) {
            adjustCoords = [
                coords[0] * widthRatio,
                coords[1] * heightRatio,
                coords[2] * widthRatio
            ];
        } else if (shapeType === SHAPE.POLY) {
            // Todo
        }

        return adjustCoords;
    }

    /**
    * @typedef {GenericArray} RectCoords
    * @property {Float} 0
    * @property {Float} 1
    * @property {Float} 2
    * @property {Float} 3
    */

    /**
     * @static
     * @param {ShapeElement} shapeEl
     * @returns {RectCoords}
     */
    function convertTextToRectCoords (shapeEl) {
        const bottomLeftX = parseFloat(shapeEl.attr('x'));
        const bottomLeftY = parseFloat(shapeEl.attr('y'));
        const shapeSize = shapeEl.get(0).getBBox();
        const {width} = shapeSize;
        const height = parseFloat(shapeEl.attr('font-size')) *
            FONT_SIZE_RATIO / 2;

        return [
            bottomLeftX,
            bottomLeftY - height,
            bottomLeftX + width,
            bottomLeftY
        ];
    }

    /**
     * @static
     * @param {string} coords
     * @returns {?(Float[])}
     */
    function convertStringToNumber (coords) {
        if (!coords) {
            return null;
        }

        return [...coords].map((ch) => parseFloat(ch));
    }

    //   UTIL FUNCTIONS

    /**
     * GUID: img의 usemap 속성, map의 name 속성을 unique id로 생성.
     * @static
     * @see <http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript>.
     * @returns {string}
     */
    function guid () {
        /**
         * @static
         * @returns {string}
         */
        function s4 () {
            return Math.floor(
                (1 + Math.random()) * 0x10000
            ).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() +
            '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
    * @typedef {PlainObject} Dimensions
    * @property {Float} width
    * @property {Float} height
    */

    /**
     * @static
     * @param {HTMLImageElement|string} imageElOrUrl
     * @todo If this is to handle an image element, other contexts which use
     *    the passed in URL should also
     * @returns {Dimensions}
     */
    function getNaturalImageSize (imageElOrUrl) {
        const imageObj = new Image();
        if (('naturalWidth' in imageObj) && typeof imageElOrUrl !== 'string') {
            return {
                width: imageElOrUrl.naturalWidth,
                height: imageElOrUrl.naturalHeight
            };
        }
        imageObj.src = imageElOrUrl.src || imageElOrUrl;
        return {
            width: imageObj.width,
            height: imageObj.height
        };
    }

    $.fn.extend({
        /**
         *
         * @param {Coords} coords
         * @param {Url} linkUrl
         * @returns {jQuery}
         */
        createMaps (coords, linkUrl) {
            this.data('image_maps_inst').createMaps(coords, linkUrl);
            return this;
        },

        /**
         *
         * @param {Coords} coords
         * @param {Url} linkUrl
         * @param {ShapeType} shapeType
         * @returns {jQuery}
         */
        addShape (coords, linkUrl, shapeType) {
            this.data('image_maps_inst').addShape(coords, linkUrl, shapeType);
            return this;
        },

        /**
         *
         * @param {Integer} index
         * @returns {jQuery}
         */
        removeShape (index) {
            this.data('image_maps_inst').removeShape(index);
            return this;
        },

        /**
         *
         * @returns {jQuery}
         */
        removeAllShapes () {
            this.data('image_maps_inst').removeAllShapes();
        },

        /**
         *
         * @returns {jQuery}
         */
        destroy () {
            const imageMapsObj = this.data('image_maps_inst');
            if (!imageMapsObj) {
                return;
            }

            imageMapsObj.removeImageMaps();
            this.data('image_maps_inst', null);
        },

        /**
         *
         * @param {ShapeStyles} styleOptions
         * @returns {jQuery}
         */
        setShapeStyle (styleOptions) {
            this.data('image_maps_inst').setShapeStyle(styleOptions);
            return this;
        },

        /**
         *
         * @param {Url} linkUrl
         * @param {Integer} index
         * @returns {jQuery}
         */
        setUrl (linkUrl, index) {
            this.data('image_maps_inst').setUrl(linkUrl, index);
            return this;
        },

        /**
         *
         * @param {string} text
         * @param {ShapeStyles} styleOptions
         * @returns {jQuery}
         */
        setTextShape (text, styleOptions) {
            this.data('image_maps_inst').setTextShape(text, styleOptions);
            return this;
        },

        /**
         *
         * @param {Url} imageUrl
         * @param {ShapeStyles} styleOptions
         * @returns {jQuery}
         */
        setImageShape (imageUrl, styleOptions) {
            this.data('image_maps_inst').setImageShape(imageUrl, styleOptions);
            return this;
        },

        /**
         *
         * @returns {undefined}
         */
        enableClick () {
            this.data('image_maps_inst').enableClick();
        },

        /**
         *
         * @returns {undefined}
         */
        disableClick () {
            this.data('image_maps_inst').disableClick();
        },

        /**
         *
         * @returns {AllShapeInfo}
         */
        getAllShapes () {
            return this.data('image_maps_inst').getAllShapesInfo();
        },

        /**
         *
         * @param {Coords} coords
         * @param {ShapeType} shapeType
         * @param {Float} widthRatio
         * @param {Float} heightRatio
         * @returns {Coords}
         */
        getCoordsByRatio (coords, shapeType, widthRatio, heightRatio) {
            return ImageMaps.getCoordsByRatio(
                coords, shapeType, widthRatio, heightRatio
            );
        },

        /**
         *
         * @param {Float[]} percentages
         * @returns {undefined}
         */
        zoom (percentages) {
            this.data('image_maps_inst').zoom(percentages);
        }
    });

    /**
     * @this jQuery
     * @param {ImageMapOptions} options
     * @throws {Error}
     * @returns {ImageMaps|undefined}
     */
    $.fn.imageMaps = function (options) {
        if (this.length === 1) {
            if (!this.data('image_maps_inst')) {
                const imageMapsInst = new ImageMaps(this, options);
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
