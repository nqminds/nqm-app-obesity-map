/* the main file for obesity map */

// TODO: CHECK DEPENDENCIES USED, RECYCLE REST.

var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();
//var aMapStyles = require("./public/stylesheets/styledMap.json");

var oTopoLA = require("./data/topoCTYUA.json");
var oGeoMSOA = require("./data/geoMSOA_onested.json"); 
var oLookUps = require("./data/LAtoMSOAdictionary.json");
var oMSOAData = require("./data/MSOA_object.json");
var oSchoolsData = require("./data/objSchools_basic_info.json");
var oExtendedSchoolsData = require("./data/objSchools_extended_info.json");

app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));

/* here comes the code */

var oBucket = {};

function createBuckets (oSchoolData) {
    var totalIndexArray = [];
    var ruralIndexArray = [];
    var urbanIndexArray = [];

	
    //loop for appending indices & urbanRural
	for (var key in oSchoolData) {
		if (oSchoolData.hasOwnProperty(key)) {
			var schoolEntry = oSchoolData[key];
			var index = parseFloat(schoolEntry.index.fastfoods);
			
			var urbanRural = schoolEntry.schoolInfo.urbanRural
			totalIndexArray.push(index);//chng
			if (~urbanRural.indexOf("Urban") || ~urbanRural.indexOf("Town")) {
				if (index != 0.){
					urbanIndexArray.push(index);
				}
			} else if (~urbanRural.indexOf("Village") || ~urbanRural.indexOf("Hamlet")){
				if (index != 0.){
					ruralIndexArray.push(index);
				}
				
			};
		};
	};
    //loop for three indexes bucket boundary values:
    oBucket.total = getBoundaryValues(totalIndexArray);
    oBucket.rural = getBoundaryValues(ruralIndexArray);
    oBucket.urban = getBoundaryValues(urbanIndexArray);
	
}

function getBoundaryValues (indexArray) {

    indexArray.sort();
	
    var singleBinLength = Math.floor((indexArray.length)/5);

    var boundaryValArr = [];
    var previousBoundary = 0;
    for (var i = 0; i < 4; i++){
        var boundaryValID = previousBoundary + singleBinLength;

        var boundary = indexArray[boundaryValID];
        boundaryValArr.push(boundary);
		previousBoundary = boundaryValID;
    } //the last value in the array will be ~maximum value

    return boundaryValArr;
}

//do a function watching for changes from dropdown

app.get('/references', function(req, res){
    res.render('references');
})

app.get("/marker/:schID", function(req, res) {
	var schID = req.params["schID"];
	
	res.json(oExtendedSchoolsData[schID]);
})

app.get("/MSOA_map/:idLA/", function(req, res){
    
    var idLA = req.params["idLA"];

    res.json(oGeoMSOA[idLA]);
});

app.get("/", function(req, res) {
	res.render("welcome");
});

app.get('/explore', function(req, res){
	//var parsedSchoolsData = JSON.parse(oSchoolsData);
	createBuckets(oExtendedSchoolsData);
	
    res.render('index', {
                        title: "Housing"
						, topoLA: oTopoLA
						//, geoMSOA: oGeoMSOA
						, LookUps: oLookUps
						, msoaData: oMSOAData
						, schoolsData: oSchoolsData
						, indexBucket: oBucket
                        }
    );
});


app.listen(3000);