// If you're adding a number of markers, you may want to drop them on the map
// consecutively rather than all at once. This example shows how to use
// window.setTimeout() to space your markers' animation.

var schoolIMGurl = "/images/school1_24px.png";
var aPNGSchoolMarkers = [
    "/images/school1_24px_0.png",
    "/images/school1_24px_1.png",
    "/images/school1_24px_2.png",
    "/images/school1_24px_3.png",
    "/images/school1_24px_4.png",
    "/images/school1_24px.png"
]; 
/*var aLatLong = [
  {lat: 52.511, lng: 13.447},
  {lat: 52.549, lng: 13.422},
  {lat: 52.497, lng: 13.396},
  {lat: 52.517, lng: 13.394}
];*/

function selectMarkerColor(n, colourBoundaries){ //this neeeds tuuuuning!!!!
    if (isNaN(n)){return aPNGSchoolMarkers[5]};
    if(n < colourBoundaries[0]){return aPNGSchoolMarkers[0]};
    if(n < colourBoundaries[1] && n >= colourBoundaries[0]){return aPNGSchoolMarkers[1]};
    if(n < colourBoundaries[2] && n >= colourBoundaries[1]){return aPNGSchoolMarkers[2]};
    if(n < colourBoundaries[3] && n >= colourBoundaries[2]){return aPNGSchoolMarkers[3]};
    if(n >= colourBoundaries[3]){return aPNGSchoolMarkers[4]};
}

function createSchoolMarkers(map, indexSelected) {
    var idLA = map.idLA;
    var colourBoundaries = oBucket[indexSelected];
    clearSchoolsMarkers(map);
    map.schoolMarkers = [];
    var aSchoolLatLong = [];
    var aSchoolID = oLookUps[idLA]["schools"];

    for (var a = 0; a < aSchoolID.length; a++ ) {

        var schID = aSchoolID[a];
        var schoolDoc = oSchoolsData[schID];
        var urbanRural = schoolDoc.schoolInfo.urbanRural;
        var address = {};
        address.lat = schoolDoc.coordinates.lat;
        address.lng = schoolDoc.coordinates.lng;
        address.schID = schID;

        if(indexSelected == "total"){
           aSchoolLatLong.push(address);
        } else if (indexSelected == "urban"){
            if (~urbanRural.indexOf("Urban") || ~urbanRural.indexOf("Town")){
                aSchoolLatLong.push(address);
            }
        } else if (indexSelected == "rural"){
            if (~urbanRural.indexOf("Village") || ~urbanRural.indexOf("Hamlet")){
                aSchoolLatLong.push(address);
            }            
        }  
    }
    drop(map, aSchoolLatLong, colourBoundaries);
}

function createFastfoodMarkers(schID, map) {
    map.ffMarkers = [];
    var aFastfoodLatLong = [];
        $.ajax("/marker/" + schID).done(function (res) {
            var aSchoolID = res["nearby_fastfoods"];

            for (var a = 0; a < aSchoolID.length; a++) {
                var ffID = aSchoolID[a]["_id"];
                if (aSchoolID[a].geoCode.mDistance2school < 1000) {
                    var address = {};
                    address.lat = aSchoolID[a].geoCode.lat;
                    address.lng = aSchoolID[a].geoCode.lng;
                    address.ffID = ffID;

                    aFastfoodLatLong.push(address);
                }
            }
            drop(map, aFastfoodLatLong);
        });
}



function drop(map, aLatLong, colourBoundaries) {
  var schoolMarkers = [];
  for (var i = 0; i < aLatLong.length; i++) {
      if(aLatLong[i].schID){ //for schools
          var schID = aLatLong[i].schID;
           var ffIndex = oSchoolsData[schID].index.fastfoods;
            addMarkerWithTimeout(aLatLong[i], i * 15, map, ffIndex, colourBoundaries);
      } else { //for fastfoods
        var ffID = aLatLong[i].ffID;
        addMarkerWithTimeout(aLatLong[i], i * 15, map, 9999, colourBoundaries);
      }
      
  }
}

function addMarkerWithTimeout(position, timeout, map, ffIndex, colourBoundaries) {
    
    if(ffIndex == 9999){
        var schoolIMG = {
            url: "/images/fastfood.png"
        };
        var objectName = "fastfood";
        var id = position.ffID;

    } else {
       var pngURL = selectMarkerColor(ffIndex, colourBoundaries);
        var schoolIMG = {
            url: pngURL
        };
        var id = position.schID;
        var objectName = oSchoolsData[id].name;
         
    }

    window.setTimeout(function () {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: schoolIMG,
            animation: google.maps.Animation.DROP,
            title: objectName,
            schID: id
        });

        if (ffIndex != 9999) {
            google.maps.event.addListener(marker, 'click', function () {
                displaySchoolInfo(map, marker);
            });
            map.schoolMarkers.push(marker);
        } else {
            map.ffMarkers.push(marker);
        }

    }, timeout);
}

function displaySchoolInfo(map, marker) {
    var schID = marker.schID;

    $.ajax("/marker/" + schID).done(function (res) {
        var schInfo = res;
        var infoString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h2 id="firstHeading" class="firstHeading">' + schInfo.name + '</h2>' +
        '<div id="bodyContent">' +
        '<p><b>Address: </b>' + schInfo.address.street + ', ' + schInfo.address.postcode + ', ' + schInfo.address.city +
        '<br>Number of pupils: ' + schInfo.schoolInfo.numberOfPupils +
        '<br>Percentage of Free School Meals: ' + schInfo.schoolInfo.percentageFreeSchoolMeals +
        '</p>' +
        '<p>Webiste: <a href=' + schInfo.schoolInfo.websiteURL + '>' +
        schInfo.schoolInfo.websiteURL + '</a> </p>' +
        '</div>' +
        '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: infoString
        });

        infowindow.open(map, marker);
        map.setCenter(marker.getPosition());

        setTimeout(function () { infowindow.close(); }, 5000);
        //console.log(marker.getPosition());
        clearffMarkers(map);
        createFastfoodMarkers(schID, map);
    });
    //show nearby fastfoods.    
}

function clearffMarkers(map) {
    if (map.ffMarkers) {

        for (var i = 0; i < map.ffMarkers.length; i++) {
            map.ffMarkers[i].setMap(null);
        }
    }
    map.ffMarkers = [];
}

function clearSchoolsMarkers(map) {
    if (map.schoolMarkers) {

        for (var i = 0; i < map.schoolMarkers.length; i++) {
            map.schoolMarkers[i].setMap(null);
        }
    }
    map.schoolMarkers = [];
}
