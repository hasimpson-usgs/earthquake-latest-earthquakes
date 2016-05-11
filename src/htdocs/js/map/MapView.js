/* global L */
'use strict';

require('leaflet/control/MousePosition');
require('leaflet/control/ZoomToControl');
require('map/LegendControl');

var EarthquakeLayer = require('map/EarthquakeLayer'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
    locations: [
      {
        title:'Alaska',
        id: 'alaska',
        bounds: [[72,-175], [50,-129]]
      },
      {
        title:'California',
        id: 'california',
        bounds: [[42,-125], [32,-113]]
      },
      {
        title:'Central U.S.',
        id: 'central_us',
        bounds:[[32,-104],[40,-88]]
      },
      {
        title:'Hawaii',
        id: 'hawaii',
        bounds: [[22,-160], [18,-154]]
      },
      {
        title:'Puerto Rico',
        id: 'puerto_rico',
        bounds: [[20,-70], [16,-62]]
      },
      {
        title:'U.S.',
        id: 'us',
        bounds:[[50,-125], [24.6,-65]]
      },
      {
        title:'World',
        id: 'world',
        bounds:[[70,20],[-70,380]]
      }
    ]
};


/**
 * Class info and constructor parameters.
 */
var MapView = function (options) {
  var _this,
      _initialize,

      _basemap,
      _earthquakes,
      _changedMapPosition,
      _triggeredMapPosition;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<div class="map"></div>';

    _basemap = null;
    _changedMapPosition = false;
    _triggeredMapPosition = false;

    _this.config = options.config;

    _this.map = L.map(
      el,
      {attributionControl: false}
    ).setView([34, -118], 3);

    _earthquakes = EarthquakeLayer({
      collection: options.catalog,
      model: _this.model
    });

    _this.map.addLayer(_earthquakes);
    if (!Util.isMobile()) {
      el.classList.add('desktop');
      L.control.mousePosition().addTo(_this.map);
    }
    L.control.legendControl().addTo(_this.map);
    L.control.scale().addTo(_this.map);
    L.control.zoomToControl({locations:options.locations}).addTo(_this.map);

    _this.model.on('change:basemap', 'renderBasemap', _this);
    _this.map.on('moveend', _this.onMoveEnd);

    _this.map.invalidateSize();
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:basemap', 'renderBasemap', _this);
    _this.map.off('moveend', _this.onMoveEnd);

    _this.map.removeLayer(_earthquakes);
    _earthquakes.destroy();
    _earthquakes = null;

    _this = null;
  }, _this.destroy);

  _this.onMoveEnd = function () {
    _earthquakes.render();
  };

  _this.renderBasemap = function () {
    if (_basemap) {
      _this.map.removeLayer(_basemap.layer);
    }
    _basemap = _this.model.get('basemap');
    if (_basemap) {
      _this.map.addLayer(_basemap.layer);
    }
  };

  _this.render = function () {
    _this.map.invalidateSize();
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MapView;
