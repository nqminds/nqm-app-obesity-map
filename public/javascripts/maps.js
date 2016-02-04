//
var mapArray = [];

var nqmMapType = new google.maps.StyledMapType([
      {
        stylers: [
          {hue: '#7f7f7f'},
          {visibility: 'simplified'},
          {gamma: 0.9},
          {saturation: -100},
          {weight: 0.5}
        ]
      },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
        ]
      }, {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [
         { visibility: "off" }
        ]
       }, {
         featureType: 'poi',
         elementType: 'geometry',
         stylers: [
            { visibility: "off" }
         ]
        }
        ], {
            name: 'Custom Style'
  });

var nqmMapTypeId = 'custom_style';

function loadGeoData(map, input){
    $('.loading').show();
    map.data.addGeoJson(input)
    $('.loading').hide();
    zoom(map);
}

function initialize() {
    var mapIndex = 1;
    var map;

    var latlng = new google.maps.LatLng(52.5, -1.2);
    cacheCenter = latlng;
    var mapOptions = {
        zoom: 7,
        center: latlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT

        },
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, nqmMapTypeId]
        }
    };
    var canvasAddress = String("#mapCanvas" + mapIndex);
    map = new google.maps.Map($(canvasAddress)[0], mapOptions);
    mapArray[mapIndex] = map;

    var styledMapOptions = {map: map, name: 'county'};
    //var styledMapOptionsLocal = {map: map, name: 'local'};

    /*var sMapType = new google.maps.StyledMapType(mapStyles,styledMapOptions);
    map.mapTypes.set('county', sMapType);
    map.setMapTypeId('county');

    var sMapTypeLocal = new google.maps.StyledMapType(mapStylesLocal,styledMapOptionsLocal);
    map.mapTypes.set('local', sMapTypeLocal);

    google.maps.event.addListener(map, 'zoom_changed', function() {
        zoomChanged()
    });*/

    mapArray[mapIndex].data.addListener('click', function (event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        featureClick(event, mapArray[mapIndex], mapIndex);
    });    
    
    loadGeoData(mapArray[mapIndex], topojson.feature(oTopoLA, oTopoLA.objects.geoLAplus));

	//setting map style:
    mapArray[mapIndex].mapTypes.set(nqmMapTypeId, nqmMapType);
    mapArray[mapIndex].setMapTypeId(nqmMapTypeId);

    /*setYearOptions()*/
    //polygonColors(mapArray[mapIndex], );
    zoom(mapArray[mapIndex]);
    //addKeyD3(mapIndex);
}

function addMap(mapIndex) {
    var map;

    var latlng = new google.maps.LatLng(52.5, -1.2);
    cacheCenter = latlng;
    var mapOptions = {
        zoom: 7,
        center: latlng,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT

        },
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, nqmMapTypeId]
        }
    };
    var canvasAddress = "#mapCanvas" + mapIndex;
    map = new google.maps.Map($(canvasAddress)[0], mapOptions);
    mapArray[mapIndex] = map;

    var styledMapOptions = {map: map, name: 'county'};

    mapArray[mapIndex].data.addListener('click', function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        featureClick(event, mapArray[mapIndex], mapIndex)
    });    

    	//setting map style:
    mapArray[mapIndex].mapTypes.set(nqmMapTypeId, nqmMapType);
    mapArray[mapIndex].setMapTypeId(nqmMapTypeId);
    
    loadGeoData(mapArray[mapIndex], topojson.feature(oTopoLA, oTopoLA.objects.geoLAplus));
    //addKeyD3(mapIndex);
    zoom(mapArray[mapIndex]);
}


/**
 * Update a map's viewport to fit each geometry in a dataset
 * @param {google.maps.Map} map The map to adjust
 */
function zoom(map) {
  var bounds = new google.maps.LatLngBounds();
  map.data.forEach(function(feature) {
    processPoints(feature.getGeometry(), bounds.extend, bounds);
  });
  map.fitBounds(bounds);
  var currentZoom = map.getZoom();
  var newZoom = currentZoom + 1;
  map.setZoom( newZoom );
}

/**
 * Process each point in a Geometry, regardless of how deep the points may lie.
 * @param {google.maps.Data.Geometry} geometry The structure to process
 * @param {function(google.maps.LatLng)} callback A function to call on each
 *     LatLng point encountered (e.g. Array.push)
 * @param {Object} thisArg The value of 'this' as provided to 'callback' (e.g.
 *     myArray)
 */
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function(g) {
      processPoints(g, callback, thisArg);
    });
  }
}


google.maps.event.addDomListener(window, 'load', initialize);