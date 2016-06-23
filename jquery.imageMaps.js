// The MIT License (MIT)

// Copyright (c) 2016 NAVER Corp.

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


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var SHAPE = {
        'RECT' : 'rect',
        'CIRCLE' : 'circle',
        'ELLIPSE' : 'ellipse',
        'TEXT' : 'text',
        'IMAGE' : 'image',
        'POLY' : 'poly',
        'POLYLINE' : 'polyline',
        'POLYGON' : 'polygon'
    }
    
    var defaults = {
        'isEditMode': false,
        'shape': SHAPE.RECT, // select map area shape type - rect, circle, text, image, poly
        'shapeText': 'press on link', // shape 옵션이 text일 때 적용된다.
        'shapeStyle': {
            'fill': '#ffffff',
            'fill-opacity': 0.2,
            'stroke': '#ffffff',
            'stroke-width': 3
        },
        'onClick': $.noop,
        'onMouseDown': $.noop,
        'onMouseMove': $.noop,
        'onMouseUp': $.noop,
        'onSelect': $.noop
    };
    
    var defaultShapeOptions = {
        'rect': [0, 0, 20, 20], // top-left-x, top-left-y, bottom-right-x, botton-right-y
        'circle': [0, 0, 10], // center-x, center-y, radius
        'ellipse': [0, 0, 5, 5], // center-x, center-y, radius-x, radius-y
        'text': [0, 0, 12] // bottom-right-x, bottom-right-y, font-size
    };
    
    var FONT_SIZE_RATIO = 0.5;
    
    var NS_SVG = 'http://www.w3.org/2000/svg';
    var NS_XLINK = 'http://www.w3.org/1999/xlink';
    
    // The actual plugin constructor
    function ImageMaps(container, options) {
        
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
            face: { x: null, y: null },
            vertex: { x: null, y: null }
        };
        
        this.shapeLimitCoords = {
            x: 30,
            y: 30,
            radius: 15
        };
        
        this.allShapeInfo = {};
    }
    
    // 이미지 엘리먼트 하단에 map, area 엘리먼트 생성 및 속성 부여
    ImageMaps.prototype.createMaps = function(coords, linkUrl) {
        var imageWidth = this.container.width();
        
        if(isNaN(imageWidth) || !imageWidth) {
            this.container.one('load', $.proxy(createMaps, this, coords, linkUrl));
        } else {
            createMaps.call(this, coords, linkUrl);
        }
    };
    
    ImageMaps.prototype.setShapeType = function(shape) {
        this.shapeType = shape;
    };
    
    ImageMaps.prototype.setShapeStyle = function(styleOptions) {
        styleOptions = styleOptions || {};
        this.shapeStyle = $.extend({}, true, this.shapeStyle, styleOptions);
    };
    
    // TODO
    ImageMaps.prototype.setUrl = function(linkUrl, index) {
        
    };
    
    ImageMaps.prototype.setTextShape = function(text, styleOptions) {
        this.setShapeStyle(styleOptions);
        this.shapeText = text;
    };
    
    ImageMaps.prototype.setImageShape = function(imageUrl, styleOptions) {
        this.setShapeStyle(styleOptions);
        this.shapeImageUrl = imageUrl;
    };
    
    ImageMaps.prototype.addShape = function(coords, linkUrl, shapeType) {
        !!shapeType && this.setShapeType(shapeType);
        this.createMaps(coords, linkUrl);
    };
    
    ImageMaps.prototype.removeShape = function(index) {
        if(!this.shapeEl) {
            return;
        }
        
        if(typeof(index) === 'undefined') {
            index = this.shapeEl.data('index');
        }
        
        var areaEl = this.mapEl.find('area[data-index="' + index + '"]');
        var shapeEl = this.svgEl.find('._shape_face[data-index="' + index + '"]');
        
        this.detachEvents(shapeEl, [{ 
            type: 'click touchend'
        }]);
        
        shapeEl.parent().remove();
        areaEl.remove();
        
        this.removeShapeInfo(index);
    };
    
    ImageMaps.prototype.removeAllShapes = function() {
        if(!this.shapeEl) {
            return;
        }
        
        var allShapeEls = this.svgEl.find('._shape_face');
        
        for(var i = 0, len = allShapeEls.length; i < len; i++) {
            this.removeShape($(allShapeEls[i]).data('index'));
        }
        
        this.allShapeInfo = {};
    };
    
    ImageMaps.prototype.removeImageMaps = function() {
        this.removeAllShapes();
        this.svgEl && this.svgEl.remove();
    };
    
    ImageMaps.prototype.updateShapeInfo = function(index, shapeOptions, shapeSecondaryOptions) {
        var shapeInfo = this.allShapeInfo;
        
        shapeOptions.index = index;
        if(!shapeInfo['shape' + index]) {
            shapeInfo['shape' + index] = $.extend(true, shapeOptions, shapeSecondaryOptions);
        } else {
            shapeInfo['shape' + index] = $.extend(true, {}, shapeInfo['shape' + index], shapeOptions, shapeSecondaryOptions);
        }
    };
    
    ImageMaps.prototype.removeShapeInfo = function(index) {
        delete this.allShapeInfo['shape' + index];
    };
    
    ImageMaps.prototype.getShapeInfo = function(index) {
        return this.allShapeInfo['shape' + index];
    };
    
    ImageMaps.prototype.getAllShapesInfo = function() {
        return $.extend(true, {}, this.allShapeInfo);
    };
    
    ImageMaps.prototype.getCoordsByRatio = function(coords, shapeType, widthRatio, heightRatio) {
        return getCoordsByRatio(coords, shapeType, widthRatio, heightRatio);
    };
    
    ImageMaps.prototype.enableClick = function() {
        this.attachEvents(this.svgEl.find('._shape_face'), [{
            'type': 'touchstart', handler: onTouchStart
        }, { 
            'type': 'click touchend', handler: onClickShapeFace
        }]);
    };
    
    ImageMaps.prototype.disableClick = function() {
        this.detachEvents(this.svgEl.find('._shape_face'), [{
            'type': 'touchstart', handler: onTouchStart
        }, { 
            'type': 'click touchend', handler: onClickShapeFace
        }]);
    };
    
    ImageMaps.prototype.setShapeCoords = function(coords) {
        this.shapeCoords = coords;
    };
    
    ImageMaps.prototype.setVertexCoords = function(coords) {
        this.vertexCoords = coords;
    };
    
    ImageMaps.prototype.setShapeElement = function(element) {
        this.shapeEl = element;
    };
    
    ImageMaps.prototype.setVertexElement = function(element) {
        this.vertexEl = element;
    };
    
    ImageMaps.prototype.setVertexElements = function(elements) {
        this.vertexEls = elements;    
    };
    
    // 이미지맵 이벤트 할당
    ImageMaps.prototype.attachEvents = function(element, eventOptions) {
        element = $(element);
        
        for(var i = 0, len = eventOptions.length; i < len; i++) {
            element.on(eventOptions[i].type + '.area', $.proxy(eventOptions[i].handler, this));
        }
    };
    
    // 이미지맵 이벤트 해제
    ImageMaps.prototype.detachEvents = function(element, eventOptions) {
        element = $(element);
        
        for(var i = 0, len = eventOptions.length; i < len; i++) {
            var eventType = eventOptions[i].type || '';
            var eventHandler = eventOptions[i].handler ? $.proxy(eventOptions[i].handler, this) : '';
            
            if(eventHandler) {
                element.off(eventType + '.area', eventHandler);
            } else {
                element.off(eventType + '.area');
            }
        }
    };
    
    function createMaps(coords, linkUrl) {
        // 최초 맵영역을 만드는 순간에 map 엘리먼트를 만들고 하위에 area 엘리먼트 생성.
      	var uid = guid();
        if(!this.container.attr('usemap')) {
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
        var centerY = imageHeight / 2;
        
        // 파라미터로 좌표값을 받으면 좌표에 해당하는 영역을 함께 그려준다.
        var shapeType = this.shapeType;
        var shapeCoords = [];
        
        var isDefaultTextCoords = false;
        
        coords = convertStringToNumber(coords);
        if(!(coords instanceof Array)) {
            // default 편집영역의 사이즈는 이미지의 0.1배로 계산. (내 맘대로..)
            var defaultShapeX = imageWidth * 0.1, defaultShapeY = imageHeight * 0.1;
            var defaultRadius = (defaultShapeX >= defaultShapeY) ? defaultShapeY : defaultShapeX;
            // invalid 좌표값이거나 배열이 아닌 타입일 경우는 디폴트 좌표로 그린다.
            if(shapeType === SHAPE.RECT) {
                shapeCoords = $.extend([], defaultShapeOptions.rect, [
                    centerX - defaultShapeX,
                    centerY - defaultShapeY,
                    centerX + defaultShapeX,
                    centerY + defaultShapeY
                ]);
            } else if(shapeType === SHAPE.CIRCLE) {
                shapeCoords = $.extend([], defaultShapeOptions.circle, [
                    centerX,
                    centerY,
                    defaultRadius
                ]);
            } else if(shapeType === SHAPE.ELLIPSE) {
                shapeCoords = $.extend([], defaultShapeOptions.ellipse, [
                    centerX,
                    centerY,
                    defaultRadius,
                    defaultRadius
                ]);
            } else if(shapeType === SHAPE.IMAGE) {
                var imageSize = getNaturalImageSize(this.shapeImageUrl);
                defaultShapeX = imageSize.width / 2, defaultShapeY = imageSize.height / 2;
                shapeCoords = [
                    centerX - defaultShapeX,
                    centerY - defaultShapeY,
                    centerX + defaultShapeX,
                    centerY + defaultShapeY
                ];
            } else if(shapeType === SHAPE.POLY) {
                
            }
        } else {
            // 타입별로 정상적으로 좌표값을 받았다면 해당 좌표로 그린다.
            if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
                shapeCoords = $.extend([], defaultShapeOptions.rect, coords);
            } else if(shapeType === SHAPE.CIRCLE) {
                shapeCoords = $.extend([], defaultShapeOptions.circle, coords);
            } else if(shapeType === SHAPE.ELLIPSE) {
                shapeCoords = $.extend([], defaultShapeOptions.ellipse, coords);
            } else if(shapeType === SHAPE.TEXT) {
                if(!coords[0]) {
                    coords[0] = centerX;
                    isDefaultTextCoords = true;
                }
                if(!coords[1]) {
                    coords[1] = centerY;
                    isDefaultTextCoords = true;
                }
                if(!coords[2]) {
                    coords[2] = 20;
                }
                shapeCoords = $.extend([], defaultShapeOptions.text, coords);
            } else if(shapeType === SHAPE.POLY) {
                
            }
        }
        
        var index = this.mapEl.find('._shape_face').length;
        var areaType = shapeType;
        var shapeSecondaryOptions = {};
        
        if(shapeType === SHAPE.TEXT || shapeType === SHAPE.IMAGE) {
            areaType = SHAPE.RECT;
            
            if(shapeType === SHAPE.TEXT) {
                shapeSecondaryOptions = { 'text': this.shapeText };
            } else {
                shapeSecondaryOptions = { 'href': this.shapeImageUrl };
            }
        }
        
        createOverlay.call(this, shapeCoords, uid, linkUrl, index);
        this.setShapeCoords(shapeCoords);
        this.updateShapeInfo(index, { coords: shapeCoords, type: shapeType, url: linkUrl, style: this.shapeStyle }, shapeSecondaryOptions);
        
        if(isDefaultTextCoords && this.isEditMode && shapeType === SHAPE.TEXT) {
            adjustTextShape.call(this);
        }
        
        if(shapeType === SHAPE.ELLIPSE) {
            areaType = SHAPE.CIRCLE;
            shapeCoords = [shapeCoords[0], shapeCoords[1], defaultShapeOptions.ellipse[2], defaultShapeOptions.ellipse[2]];
        }
        
        createArea.call(this, areaType, shapeCoords, linkUrl, index);
    }
    
    function createOverlay(shapeCoords, uid, linkUrl, index) {
        var containerWidth = this.container.width(), containerHeight = this.container.height();
        
        if(typeof(document.createElementNS) !== 'undefined') {

            var svgNativeEl = this.mapEl.find('svg').get(0);
            var svgEl = $(svgNativeEl);
            var shapeType = this.shapeType;

            if(!svgNativeEl) {
                svgNativeEl = document.createElementNS(NS_SVG, 'svg');
                svgEl = $(svgNativeEl);
                this.svgEl = svgEl;

                if(this.isEditMode) {
                    this.attachEvents(svgEl, [{ 
                        'type': 'mousedown', handler: onMouseDown
                    }]);
                } else {
                    this.attachEvents(this.mapEl, [{
                        'type': 'touchstart', handler: onTouchStart
                    }, { 
                        'type': 'click touchend', handler: onClickShapeFace
                    }]);
                }
                this.attachEvents(window, [{ 
                    'type': 'resize', handler: onResize
                }]);
            }

            // svgEl.get(0).setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            // svg의 width, height는 DOM API로 처리해야 사이즈가 제대로 나옴.
            svgNativeEl.setAttribute('width', containerWidth);
            svgNativeEl.setAttribute('height', containerHeight);
            
            // container의 부모에 대한 상대좌표에 따라 svg의 좌표값이 결정된다.
            var containerPos = this.container.position();
            svgEl.attr({
                'xmlns': NS_SVG,
                'xmlns:xlink': NS_XLINK,
                'version': '1.1',
                'data-Id': uid
            }).css({
                'position': 'absolute',
                'zIndex': 1000,
                'overflow': 'hidden',
                'top': containerPos.top,
                'left': containerPos.left
            });

            var shapeGroupEl = createShape.call(this, shapeType, shapeCoords, linkUrl, index);
            svgEl.append(shapeGroupEl);
            this.mapEl.append(svgEl);
        }
    }
    
    function createArea(areaType, shapeCoords, linkUrl, index) {
        $('<area shape=' + areaType + ' coords=' + shapeCoords.join(',') + ' href=' + (linkUrl || '#') + ' data-index=' + index + ' ' + ((linkUrl) ? 'target="_blank"' : '') + '>').appendTo(this.mapEl);
    }
    
    function createShape(shapeType, shapeCoords, linkUrl, index) {
        
        if(shapeType === SHAPE.POLY) {
            shapeType = SHAPE.POLYLINE;
        }
        
        var shapeEl = $(document.createElementNS(NS_SVG, shapeType));
        var gEl = $(document.createElementNS(NS_SVG, 'g'));
        
        drawShape.call(this, shapeCoords, shapeEl);
        
        var cursor = 'default';
        if(this.isEditMode) {
            cursor = 'move';
        } else {
            if(linkUrl !== '') {
                cursor = 'pointer';
            }
        }
        this.setShapeStyle({ 'cursor': cursor });
        shapeEl.css(this.shapeStyle);
        
        if(shapeType === SHAPE.TEXT) {
            shapeEl.css({
                'fill-opacity': '',
                'stroke-opacity': ''
            });
        }

        shapeEl.attr('data-index', index);
        gEl.append(shapeEl);
        this.setShapeElement(shapeEl);
        
        if(this.isEditMode && shapeType !== 'text') {
            var vertexEls = createVertex(shapeType, shapeCoords, index);
            for(var i = 0, len = vertexEls.length; i < len; i++) {
                vertexEls[i].appendTo(gEl);
            }
            this.setVertexElements(vertexEls);
        }
        
        return gEl;
    }
    
    function drawShape(shapeCoords, shapeEl, shapeOptions) {
        shapeEl = shapeEl || this.shapeEl;
        var shapeType = shapeOptions ? shapeOptions.type : this.shapeType;
        
        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            shapeEl.attr({
                'x': shapeCoords[0],
                'y': shapeCoords[1],
                'class': '_shape_face'
            });
            if(shapeCoords[2]) {
                shapeEl.attr('width', shapeCoords[2] - shapeCoords[0]);
            }
            if(shapeCoords[3]) {
                shapeEl.attr('height', shapeCoords[3] - shapeCoords[1]);
            }
            if(shapeType === SHAPE.IMAGE) {
                // xlink 속성 설정 시에는 DOM api의 setAttributeNS를 사용해야 함.
                // svg 전용 속성은 무조건 DOM api를 사용해야 함.
                shapeEl.get(0).setAttributeNS(NS_XLINK, 'href', (shapeOptions ? shapeOptions.href : this.shapeImageUrl));
                // image 엘리먼트의 width, height를 고정 비율로 변경되는 걸 해제해주기 위한 속성 셋팅.
                shapeEl.get(0).setAttribute('preserveAspectRatio', 'none');
            }
        } else if(shapeType === SHAPE.CIRCLE) {
            shapeEl.attr({
                'cx': shapeCoords[0],
                'cy': shapeCoords[1],
                'class': '_shape_face'
            });
            if(shapeCoords[2]) {
                shapeEl.attr('r', shapeCoords[2]);
            }
        } else if(shapeType === SHAPE.ELLIPSE) {
            shapeEl.attr({
                'cx': shapeCoords[0],
                'cy': shapeCoords[1],
                'class': '_shape_face'
            });
            if(shapeCoords[2]) {
                shapeEl.attr('rx', shapeCoords[2]);
            }
            if(shapeCoords[3]) {
                shapeEl.attr('ry', shapeCoords[3]);
            }
        } else if(shapeType === SHAPE.TEXT) {
            shapeEl.attr({
                'x': shapeCoords[0],
                'y': shapeCoords[1],
                'font-size': shapeCoords[2],
                'class': '_shape_face'
            });
            shapeEl.text(this.shapeText);
        } else if(shapeType === SHAPE.POLY) {
            
        }
    }
    
    function adjustTextShape() {
        var shapeEl = this.shapeEl;
        var shapeSize = shapeEl.get(0).getBBox();
        var centerX = shapeSize.width / 2;
        var centerY = parseFloat(shapeEl.attr('font-size')) * FONT_SIZE_RATIO / 2;
        var bottomRightX = parseInt(shapeEl.attr('x'), 10);
        var bottomRightY = parseInt(shapeEl.attr('y'), 10);
        var resultX = bottomRightX - centerX;
        var resultY = bottomRightY + centerY;
        
        this.updateShapeInfo(shapeEl.data('index'), { coords: [resultX, resultY, shapeEl.attr('font-size') ] });
        
        shapeEl.attr({
            'x': resultX,
            'y': resultY
        });
    }
    
    function createVertex(shapeType, shapeCoords, index) {
        var vertexEl = null;
        var vertexTemp = [];
        var vertexCoords = calculateVertexCoords(shapeType, shapeCoords);
        
        for(var i = 0, len = vertexCoords.length; i < len; i++) {
            vertexEl = $(document.createElementNS(NS_SVG, 'rect'));
            vertexEl.attr('data-index', index).css({
                'fill': '#ffffff',
                'stroke': '#000000',
                'stroke-width': 2
            });
            
            vertexTemp.push(vertexEl);
        }
        
        drawVertex(vertexCoords, vertexTemp, shapeType);
        
        return vertexTemp;
    }
    
    function drawVertex(vertexCoords, vertexEls, shapeType) {
        for(var i = 0, len = vertexCoords.length; i < len; i++) {
            var eachCoords = vertexCoords[i];
            
            $(vertexEls[i]).attr({
                'x': eachCoords.x - 3,
                'y': eachCoords.y - 3,
                'width': 7,
                'height': 7,
                'data-direction': eachCoords.type,
                'class': '_shape_vertex'
            }).css('cursor', getCursor(eachCoords.type));
        }
    }
    
    function calculateVertexCoords(shapeType, shapeCoords) {
        var vertexArr = [];
        
        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
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
                x: (shapeCoords[2] - shapeCoords[0]) / 2 + shapeCoords[0], y: shapeCoords[1], type: 'n'
            }, {
                x: (shapeCoords[2] - shapeCoords[0]) / 2 + shapeCoords[0], y: shapeCoords[3], type: 's'
            }, {
                x: shapeCoords[0], y: (shapeCoords[3] - shapeCoords[1]) / 2 + shapeCoords[1], type: 'w'
            }, {
                x: shapeCoords[2], y: (shapeCoords[3] - shapeCoords[1]) / 2 + shapeCoords[1], type: 'e'
            }];
        } else if(shapeType === SHAPE.CIRCLE) {
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
        } else if(shapeType === SHAPE.ELLIPSE) {
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
        } else if(shapeType === SHAPE.POLY) {
            
        }
        
        return vertexArr;
    }
    
    function drawArea(shapeCoords, areaEl, shapeType) {
        var shapeEl = this.svgEl.find('._shape_face[data-index="' + areaEl.data('index') + '"]');
        shapeType = shapeType || this.shapeType;
        
        if(shapeType === SHAPE.TEXT) {
            shapeCoords = convertTextToRectCoords(shapeEl);
        } else if(shapeType === SHAPE.ELLIPSE) {
            shapeCoords = [shapeCoords[0], shapeCoords[1], defaultShapeOptions.ellipse[2]];
        }
        areaEl.attr('coords', shapeCoords.join(','));
    }
            
    function getCursor(type) {
        return type + '-resize';
    }
    
    function onTouchStart(event) {
        var touchCoords = event.originalEvent.touches[0];
        this.touchStartCoords.x = touchCoords.pageX;
        this.touchStartCoords.y = touchCoords.pageY;
    }
    
    function onClickShapeFace(event) {
        // IE8이 이외의 브라우저는 아래 계산 로직을 타지 않아도 된다.
        // IE8은 area 엘리먼트 클릭 시 href 속성의 url로 이동.
        if(event.currentTarget.tagName.toLowerCase() !== 'area') {
            event.preventDefault();
            if((this.dragInfo.face.x && this.dragInfo.face.x !== event.pageX) ||
                (this.dragInfo.face.y && this.dragInfo.face.y !== event.pageY) ||
                event.target.tagName.toLowerCase() === 'svg' ||
                (event.type === 'touchend' && event.originalEvent.changedTouches[0].pageX !== this.touchStartCoords.x && event.originalEvent.changedTouches[0].pageY !== this.touchStartCoords.y)) {
                return;
            }

            // 클릭하거나 마우스엔터, 마우스다운 된 shape를 현재 타겟으로 저장.
            // 타겟이 되는 shape의 좌표 정보를 가지고 모든 로직이 수행되도록 한다.
            var targetEl = $(event.target);
            var index = targetEl.attr('data-index');
            var targetAreaEl = this.mapEl.find('area[data-index="' + index + '"]');
            var url = targetAreaEl.attr('href');
            
            (url !== '#') && window.open(targetAreaEl.attr('href'));
        }
        
        this.options.onClick.call(this, event, targetAreaEl.attr('href'));
    }
    
    // drag & drop
    
    function onMouseDown(event) {
        event.preventDefault();
        
        if(event.target.tagName.toLowerCase() === 'svg') {
            return;
        }
        
        var targetEl = $(event.target);
        var index = targetEl.attr('data-index');
        var shapeInfo = this.getShapeInfo(index);
        var groupEl = targetEl.parent();
        var shapeEl = groupEl.find(':first-child');
        var coords = [];
        var shapeType = shapeEl.get(0).tagName.toLowerCase();
        
        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            var targetX = parseInt(shapeEl.attr('x'), 10);
            var targetY = parseInt(shapeEl.attr('y'), 10);
            coords = [
                targetX,
                targetY,
                targetX + parseInt(shapeEl.attr('width'), 10),
                targetY + parseInt(shapeEl.attr('height'), 10)
            ];
            if(shapeType === SHAPE.IMAGE) {
                this.setImageShape(shapeEl.attr('href'));
            }
        } else if(shapeType === SHAPE.CIRCLE) {
            var targetX = parseInt(shapeEl.attr('cx'), 10);
            var targetY = parseInt(shapeEl.attr('cy'), 10);
            coords = [targetX, targetY, parseInt(shapeEl.attr('r'), 10)];
        } else if(shapeType === SHAPE.ELLIPSE) {
            var targetX = parseInt(shapeEl.attr('cx'), 10);
            var targetY = parseInt(shapeEl.attr('cy'), 10);
            coords = [targetX, targetY, parseInt(shapeEl.attr('rx'), 10), parseInt(shapeEl.attr('ry'), 10)];
        } else if(shapeType === SHAPE.TEXT) {
            var targetX = parseFloat(shapeEl.attr('x'));
            var targetY = parseFloat(shapeEl.attr('y'));
            var fontSize = parseFloat(shapeEl.attr('font-size'));
            coords = [targetX, targetY, fontSize];
        } else if(shapeType === SHAPE.POLYGON) {
            shapeType = SHAPE.POLY;
        }

        this.setShapeType(shapeType);
        this.setShapeElement(shapeEl);
        this.setShapeCoords(coords);
        
        if(shapeType !== SHAPE.TEXT) {
            shapeEl.attr('data-fill', shapeEl.css('fill'));
            shapeEl.css('fill', '#ffffff');
            
            this.setVertexCoords(calculateVertexCoords(shapeType, coords));

            var vertexTemp = [];
            var vertexEls = this.mapEl.find('._shape_vertex[data-index="' + index + '"]');
            vertexEls.each(function() {
                vertexTemp.push($(this));
            });
            this.setVertexElements(vertexTemp);
        }
        
        if(targetEl.is('._shape_face')) {
            this.grabType = 'face';
            declareShape.call(this, targetEl, event.pageX, event.pageY);    
        } else if(targetEl.is('._shape_vertex')){
            this.grabType = 'vertex';
            declareVertex.call(this, targetEl, index);
        }
        
        this.attachEvents(this.mapEl.parent(), [{
            'type': 'mouseup', handler: onMouseUp
        }, {
            'type': 'mousemove', handler: onMouseMove
        }]);
        
        this.options.onSelect.call(this, event, shapeInfo);
        this.options.onMouseDown.call(this, event, shapeType, coords);
    }
    
    function onMouseUp(event) {
        var targetEl = $(event.target);
        var shapeEl = this.shapeEl;
        
        shapeEl.css('fill', shapeEl.attr('data-fill'));
        targetEl.attr('data-movable', false);
        
        var updatedCoords = determineShape.call(this);
        this.setShapeCoords(updatedCoords);
        this.updateShapeInfo(shapeEl.data('index'), { 'coords': updatedCoords });
        
        this.detachEvents(this.mapEl.parent(), [{
            'type': 'mouseup', handler: onMouseUp
        }, {
            'type': 'mousemove', handler: onMouseMove
        }]);
        
        this.options.onMouseUp.call(this, event, this.shapeType, updatedCoords);
    }
    
    function onMouseMove(event) { 
        var targetEl = $(event.target);
        var x = this.shapeCoords[0];
        var y = this.shapeCoords[1];
        var grabType = this.grabType;
        var shapeType = this.shapeType;
        var coords = {};
        
        // 좌표 계산 시 event.offsetX, offsetY값은 이벤트 발생 대상(event.currentTarget) 기준 좌표 값이므로
        // 이벤트 발생 도중(특히 mousemove) 겹치는 이벤트 타겟이 생기면 해당 타겟 기준 좌표로 변경되어 좌표가 튀는 현상 발생.
        // 그러므로 브라우저에서 drag & drop 구현 시 웬만하면 브라우저의 절대 좌표값인 event.pageX, pageY를 사용하도록 한다.
        if(grabType === 'face' || grabType === 'vertex') {
            if(grabType === 'face') {
                var movedX = x + event.pageX;
                var movedY = y + event.pageY;
                
                coords = getMovedShapeCoords.call(this, movedX - this.dragInfo.face.x, movedY - this.dragInfo.face.y);
            } else if(grabType === 'vertex') {
                coords = getMovedVertexCoords.call(this, event.pageX - this.svgEl.offset().left, event.pageY - this.svgEl.offset().top);
            }
            
            if(shapeType !== SHAPE.TEXT) {
                this.setVertexCoords(coords.vertexCoords);
                drawVertex(coords.vertexCoords, this.vertexEls, this.shapeType);    
            }
            var index = parseInt(coords.grabEl.attr('data-index'), 10);
            drawShape.call(this, coords.movedCoords, this.svgEl.find('._shape_face[data-index="' + index + '"]'));
            drawArea.call(this, coords.movedCoords, this.mapEl.find('area[data-index="' + index + '"]'));
            
            // svg 내 엘리먼트들은 z-index 영향을 받지 않고 document 순서에 영향을 받는다.
            // 그래서 drag 시 다른 요소들보다 최상위에 두려면 엘리먼트 순서를 부모의 가장 하위에 두어야 한다.
            // mousedown에서 이 로직을 넣을 경우, 
            // 외부에서 click 이벤트를 할당했을 때 mousedown 핸들러에서 dom 우선순위 조정하는 과정에서 click 이벤트가 해제되는 이슈로 mousemove 안에 둠.
            if((targetEl.is('._shape_face') || targetEl.is('._shape_vertex')) &&
                (Math.abs(this.dragInfo.face.x - event.pageX) <= 1 || Math.abs(this.dragInfo.face.y - event.pageY) <= 1)) {
                this.svgEl.append(targetEl.parent());
            }
            
            this.options.onMouseMove.call(this, event, shapeType, coords.movedCoords);
        }
    }
    
    function onResize(event) {
        var containerWidth = this.container.width();
        var containerHeight = this.container.height();
        
        if(this.containerWidth !== containerWidth || this.containerHeight !== containerHeight) {
            redraw.call(this, containerWidth, containerHeight);
            
            this.containerWidth = containerWidth;
            this.containerHeight = containerHeight;
        }
    }
    
    function redraw(containerWidth, containerHeight) {
        var _this = this;
        var allShapeInfo = this.allShapeInfo;
        var widthRatio = containerWidth / this.containerWidth;
        var heightRatio = containerHeight / this.containerHeight;
        
        this.svgEl.get(0).setAttribute('width', containerWidth);
        this.svgEl.get(0).setAttribute('height', containerHeight);
        
        $.each(allShapeInfo, function(index, item) {
            item.coords = getCoordsByRatio(item.coords, item.type, widthRatio, heightRatio);
            
            drawVertex(calculateVertexCoords(item.type, item.coords), _this.svgEl.find('._shape_vertex[data-index="' + item.index + '"]'), item.type);
            drawShape.call(_this, item.coords, _this.svgEl.find('._shape_face[data-index="' + item.index + '"]'), item);
            drawArea.call(_this, item.coords, _this.mapEl.find('area[data-index="' + item.index + '"]'), item.type);
            
        });
    }
    
    function declareShape(shapeEl, x, y) {
        
        this.dragInfo.face.x = x;
        this.dragInfo.face.y = y;

        shapeEl.attr('data-movable', true);
    }
    
    function getMovedShapeCoords(x, y) {
        var shapeEl = this.shapeEl;
        if(shapeEl.attr('data-movable') === 'false') {
            return;
        }
        
        var movedCoords = [];
        var vertexCoords = [];
        var shapeType = this.shapeType;

        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            var width = parseInt(shapeEl.attr('width'), 10);
            var height = parseInt(shapeEl.attr('height'), 10);
            var movedBottomRightX = x + width;
            var movedBottomRightY = y + height;

            movedCoords = [x, y, movedBottomRightX, movedBottomRightY];
            vertexCoords = calculateVertexCoords(SHAPE.RECT, movedCoords);
        } else if(shapeType === SHAPE.CIRCLE) {
            movedCoords = [x, y, parseInt(shapeEl.attr('r'), 10)];
            vertexCoords = calculateVertexCoords(SHAPE.CIRCLE, movedCoords);
        } else if(shapeType === SHAPE.ELLIPSE) {
            movedCoords = [x, y, parseInt(shapeEl.attr('rx'), 10), parseInt(shapeEl.attr('ry'), 10)];
            vertexCoords = calculateVertexCoords(SHAPE.ELLIPSE, movedCoords);
        } else if(shapeType === SHAPE.TEXT) {
            movedCoords = [x, y];
        } else if(shapeType === SHAPE.POLY) {

        }
        
        return {
            movedCoords: movedCoords,
            vertexCoords: vertexCoords,
            grabEl: shapeEl
        };
    }
    
    function determineShape() {
        var shapeEl = this.shapeEl;
        var shapeType = this.shapeType;
        var updatedCoords = [];
        
        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            var x = parseInt(shapeEl.attr('x'), 10);
            var y = parseInt(shapeEl.attr('y'), 10);
            updatedCoords = [
                x,
                y,
                x + parseInt(shapeEl.attr('width'), 10),
                y + parseInt(shapeEl.attr('height'), 10)
            ];
        } else if(shapeType === SHAPE.CIRCLE) {
            updatedCoords = [
                parseInt(shapeEl.attr('cx'), 10),
                parseInt(shapeEl.attr('cy'), 10),
                parseInt(shapeEl.attr('r'), 10),
            ];
        } else if(shapeType === SHAPE.ELLIPSE) {
            updatedCoords = [
                parseInt(shapeEl.attr('cx'), 10),
                parseInt(shapeEl.attr('cy'), 10),
                parseInt(shapeEl.attr('rx'), 10),
                parseInt(shapeEl.attr('ry'), 10)
            ];
        } else if(shapeType === SHAPE.TEXT) {
            updatedCoords = [
                parseInt(shapeEl.attr('x'), 10),
                parseInt(shapeEl.attr('y'), 10)
            ];
        } else if(shapeType === SHAPE.POLY) {

        }
        
        return updatedCoords;
    }
    
    function declareVertex(vertexEl, index) {
        this.setVertexElement(vertexEl);
        
        var vertexIndex = 0;
        this.vertexEls.forEach(function(item, index) {
            if(vertexEl.get(0) === item.get(0)) {
                vertexIndex = index;
            }
        });
        
        var coords = this.vertexCoords[vertexIndex];
        this.dragInfo.vertex.x = coords.x;
        this.dragInfo.vertex.y = coords.y;
        
        vertexEl.attr('data-movable', true);
    }
    
    function getMovedVertexCoords(x, y) {
        if(this.vertexEl.attr('data-movable') === 'false') {
            return;
        }
        
        var movedCoords = [];
        var vertexCoords = [];
        
        var shapeType = this.shapeType;
        var direction = this.vertexEl.attr('data-direction');
        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE) {
            switch(direction) {
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
            }
        } else if(shapeType === SHAPE.CIRCLE) {
            switch(direction) {
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
            }
            
        } else if(shapeType === SHAPE.ELLIPSE) {
            switch(direction) {
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
            }
            
        } else if(shapetype === SHAPE.POLY) {
            // polygon의 경우, 드래그 되는 좌표에 따라 이벤트 대상 vertex의 x, y 좌표가 자유롭게 변경.
        }
        
        vertexCoords = calculateVertexCoords(shapeType, movedCoords);
        
        return {
            movedCoords: movedCoords,
            vertexCoords: vertexCoords,
            grabEl: this.vertexEl
        };
    }
    
    function getValidCoordsForRect(coords, direction) {
        var topLeftX = coords[0];
        var topLeftY = coords[1];
        var bottomRightX = coords[2];
        var bottomRightY = coords[3];

        if(bottomRightX - topLeftX <= this.shapeLimitCoords.x) {
            if(direction === 'se' || direction === 'ne' || direction === 'e') {
                bottomRightX = topLeftX + this.shapeLimitCoords.x;
            }
            if(direction === 'nw' || direction === 'sw' || direction === 'w') {
                topLeftX = bottomRightX - this.shapeLimitCoords.x;
            }
        }

        if(bottomRightY - topLeftY <= this.shapeLimitCoords.y) {
            if(direction === 'se' || direction === 'sw' || direction === 's') {
                bottomRightY = topLeftY + this.shapeLimitCoords.y;
            }
            if(direction === 'nw' || direction === 'ne' || direction === 'n') {
                topLeftY = bottomRightY - this.shapeLimitCoords.y;
            }
        }

        return [topLeftX, topLeftY, bottomRightX, bottomRightY];
    }
        
    function getValidCoordsForCircle(coordsDiff) {
        var radius = this.shapeCoords[2];
        
        if(coordsDiff <= this.shapeLimitCoords.radius) {
            radius = this.shapeLimitCoords.radius;
        } else {
            radius = coordsDiff;
        }
        
        return radius;
    }
    
    function getCoordsByRatio(coords, shapeType, widthRatio, heightRatio) {
        var adjustCoords = [];
        
        if(shapeType === SHAPE.RECT || shapeType === SHAPE.IMAGE || shapeType === SHAPE.ELLIPSE) {
            adjustCoords = [coords[0] * widthRatio, coords[1] * heightRatio, coords[2] * widthRatio, coords[3] * heightRatio];
        } else if(shapeType === SHAPE.CIRCLE) {
            var radiusRatio = 1;
            
            if(widthRatio >= heightRatio) {
                radiusRatio = heightRatio;
            } else {
                radiusRatio = widthRatio;
            }
            
            if(widthRatio === 1) {
                radiusRatio = heightRatio;
            }
            
            if(heightRatio === 1) {
                radiusRatio = widthRatio;
            }
            
            adjustCoords = [coords[0] * widthRatio, coords[1] * heightRatio, coords[2] * radiusRatio];
        } else if(shapeType === SHAPE.TEXT) {
            adjustCoords = [coords[0] * widthRatio, coords[1] * heightRatio, coords[2] * widthRatio];
        } else if(shapeType === SHAPE.POLY) {
            
        }
        
        return adjustCoords;
    }
    
    function convertTextToRectCoords(shapeEl) {
        var bottomLeftX = parseFloat(shapeEl.attr('x'));
        var bottomLeftY = parseFloat(shapeEl.attr('y'));
        var shapeSize = shapeEl.get(0).getBBox();
        var width = shapeSize.width;
        var height = parseFloat(shapeEl.attr('font-size')) * FONT_SIZE_RATIO / 2;
        
        return [bottomLeftX, bottomLeftY - height, bottomLeftX + width, bottomLeftY];
    }
    
    function convertStringToNumber(coords) {
        if(!coords) {
            return null;
        }
        var coordsTemp = [];
        for(var i = 0, len = coords.length; i < len; i++) {
            coordsTemp.push(parseFloat(coords[i]));
        }
        
        return coordsTemp;
    }
    
    ///////////////////////
    //   Util Functions  //
    ///////////////////////
    
    // img의 usemap 속성, map의 name 속성을 unique id로 생성.
    // @see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    
    function getNaturalImageSize(imageElOrUrl) {
        var imageObj = new Image();
        if(('naturalWidth' in imageObj) && typeof(imageElOrUrl) !== 'string') {
            return {
                width: imageElOrUrl.naturalWidth,
                height: imageElOrUrl.naturalHeight
            };
        } else {
            imageObj.src = imageElOrUrl.src || imageElOrUrl;
            return {
                width: imageObj.width,
                height: imageObj.height
            };
        }
    }
    
    $.fn.extend({
        createMaps: function(coords, linkUrl) {
            this.data('image_maps_inst').createMaps(coords, linkUrl);
            return this;
        },
        
        addShape: function(coords, linkUrl, shapeType) {
            this.data('image_maps_inst').addShape(coords, linkUrl, shapeType);
            return this;
        },
        
        removeShape: function(index) {
            this.data('image_maps_inst').removeShape(index);
            return this;
        },
        
        removeAllShapes: function() {
            this.data('image_maps_inst').removeAllShapes();
        },
        
        destroy: function() {
            var imageMapsObj = this.data('image_maps_inst');
            if(!imageMapsObj) {
                return;
            }
            
            imageMapsObj.removeImageMaps();
            delete this.data('image_maps_inst');
            this.data('image_maps_inst', null);
        },
        
        setShapeStyle: function(styleOptions) {
            this.data('image_maps_inst').setShapeStyle(styleOptions);
            return this;
        },
        
        setUrl: function(linkUrl, index) {
            this.data('image_maps_inst').setUrl(linkUrl, index);
            return this;
        },
        
        setTextShape: function(text, styleOptions) {
            this.data('image_maps_inst').setTextShape(text, styleOptions);
            return this;
        },
        
        setImageShape: function(imageUrl, styleOptions) {
            this.data('image_maps_inst').setImageShape(imageUrl, styleOptions);
            return this;
        },
        
        enableClick: function() {
            this.data('image_maps_inst').enableClick();
        },
        
        disableClick: function() {
            this.data('image_maps_inst').disableClick();
        },
        
        getAllShapes: function() {
            return this.data('image_maps_inst').getAllShapesInfo();
        },
        
        getCoordsByRatio: function(coords, shapeType, widthRatio, heightRatio) {
            return this.data('image_maps_inst').getCoordsByRatio(coords, shapeType, widthRatio, heightRatio);
        }
    });

    $.fn.imageMaps = function(options) {
        if(this.length === 1) {
            if(!this.data('image_maps_inst')) {
                var imageMapsInst = new ImageMaps(this, options);
                this.data('image_maps_inst', imageMapsInst);
                return imageMapsInst;
            }
            return this.data('image_maps_inst');
        } else if(this.length > 1) {
            throw new Error('Already imageMaps instance has been created.');
        }
    };
}));
