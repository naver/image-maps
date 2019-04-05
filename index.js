/* globals jQuery, jqueryImageMaps */
/* eslint-disable import/unambiguous */
// import jqueryImageMaps from '../dist/index.esm.js';

const $ = jqueryImageMaps(jQuery);

/* const imageMaps = */ $('._image_maps').imageMaps({
    isEditMode: true,
    shape: 'rect',
    shapeStyle: {
        fill: '#ffffff',
        stroke: 'red',
        'stroke-width': 2
    },
    onSelect (e, data) {
        console.log(data); // eslint-disable-line no-console
    }
});

$('#rect').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').setShapeStyle({
        fill: $('a.color.selected').data('color'),
        stroke: $('a.color.selected').data('color'),
        'stroke-width': 2
    }).addShape(null, $('#link').val(), 'rect');
});

$('#circle').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').setShapeStyle({
        fill: $('a.color.selected').data('color'),
        stroke: $('a.color.selected').data('color'),
        'stroke-width': 2
    }).addShape(null, $('#link').val(), 'circle');
});

$('#ellipse').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').setShapeStyle({
        fill: $('a.color.selected').data('color'),
        stroke: $('a.color.selected').data('color'),
        'stroke-width': 2
    }).addShape(null, $('#link').val(), 'ellipse');
});

$('a.color').on('click', function (e) {
    e.preventDefault();
    $('a.color').removeClass('selected');
    $(this).addClass('selected');
});

$('#text').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').setTextShape($('#text_input').val(), {
        fill: $('a.color.selected').data('color'),
        stroke: '',
        'stroke-width': ''
    }).addShape([null, null, $('#size').val()], $('#link').val(), 'text');
});

$('#image').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').setImageShape(
        $('input.image_input:checked').data('image')
    ).addShape(null, $('#link').val(), 'image');
});

$('#remove').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').removeShape();
});

$('#remove_all').on('click', function (e) {
    e.preventDefault();
    $('._image_maps').removeAllShapes();
});

const viewEl = $('._image_maps_view');
viewEl.imageMaps();

$('#maps_zoom').on('click', function (e) {
    e.preventDefault();

    const zoomInput = $('#zoom');
    const val = Number(zoomInput.val() || 100);

    if (typeof val !== 'number' || isNaN(val) || val <= 0) {
        alert( // eslint-disable-line no-alert
            'You must enter a number and one greater than 0.'
        );
        return;
    }

    viewEl.zoom([val]);

    // for image resize
    $('._imageMaps_area_view').css({
        width: val * 0.01 * viewEl.width(),
        height: val * 0.01 * viewEl.height()
    });
});

$('#view').on('click', function (e) {
    e.preventDefault();

    const allShapes = $('._image_maps').getAllShapes();
    viewEl.removeAllShapes();
    $.each(allShapes, function (index, item) {
        viewEl.setShapeStyle(item.style);
        if (item.href) {
            viewEl.setImageShape(item.href);
        }
        if (item.text) {
            viewEl.setTextShape(item.text);
        }

        const originalImg = $('._imageMaps_area').find('img');
        const viewImage = $('._imageMaps_area_view').find('img');
        const widthRatio = originalImg.width();
        const heightRatio = originalImg.height();
        const newCoords = viewEl.getCoordsByRatio(
            item.coords,
            item.type,
            viewImage.width() / widthRatio,
            viewImage.height() / heightRatio
        );
        viewEl.addShape(newCoords, item.url, item.type);
    });
});
