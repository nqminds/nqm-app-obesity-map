//var aKeyValues = ["           NA", "    < 100%", "100-105%", "105-110%", "110-120%", "120-130%", "130-150%", "    > 150%"]
//var aKeyValues = [">35%", "30-35%", "25-30%", "20-25%", "<20%"]
var aKeyValues = ["<20%", "20-25%", "25-30%", "30-35%", ">35%"]
var oKeyColors = [];
var legendFlag = false;
var divName_obesity = "#obesityLegendContainer";

var textArray_obesity = aKeyValues;

var divName_index = "#indexLegendContainer";

var colorArray_index = ["#9999EB", 
        "#6666E0", 
        "#1919D1", 
        "#0000B8", 
        "#000066"];
var textArray_index = ["Lowest", "", "", "", "Highest"];



function setKeyColors(){
    
    //oKeyColors["color1"] = "hsla(120, 100%, 70%, 1)";
    var hue = 60;
    var hueMin = 0;
    var hueStep = (hue - hueMin) /  (aKeyValues.length-1);
    /*var lightness = 80;
    var lightnessMin = 65;
    var lightnessStep = (lightness - lightnessMin) /  (aKeyValues.length - 3);*/
    for(i = 0; i < aKeyValues.length; i++){
        name = "color" + i;
        value = "hsla(" + hue + " ,100%, 50%, 0.8)";
        oKeyColors[i] = value
        hue -= hueStep;
        //lightness -=lightnessStep;
    }
    return oKeyColors
}

function selectKeyColor(n){
    var oKeyColors = setKeyColors();
    var noData = "hsla(60, 16%, 50%, 1)"
    if (isNaN(n)){return noData};
    if(n < 20.0){return oKeyColors[0]};
    if(n < 25.0 && n >= 20.0){return oKeyColors[1]};
    if(n < 30.0 && n >= 25.0){return oKeyColors[2]};
    if(n < 35.0 && n >= 30.0){return oKeyColors[3]};
    if(n >= 35.0){return oKeyColors[4]}
}

function addKeyD3 (mapIndex) {

    var containerAddress = String("#panel-body" + mapIndex);

    var oKeyColors = setKeyColors();

    var h = 100;
    var w = 50;

    var svg = d3.select(containerAddress)
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .attr("id", String("keyContainer"+mapIndex))
        .append("svg")
        .attr("id", String("keyCanvas"+mapIndex))
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + w + " " + (h) )
        //class to make it responsive
        .classed("svg-content-responsive", true);

    var rectPadding = 1;
    var keyPadding = 5;
    var boxh = (h / aKeyValues.length - rectPadding - 2)


    svg.selectAll("rect")
        .data(aKeyValues)
        .enter()
        .append("rect")
        .attr("rx", boxh / 2)
        .attr("ry", boxh / 2)

        .attr("y", function(d, i){
                return i * (h / aKeyValues.length);
        })
        .attr("height", boxh)

        .attr("x", 0)
        .attr("width", w)
        .attr("fill", "white");

    var r = boxh / 2

    svg.selectAll("circle")
        .data(aKeyValues)
        .enter()
        .append("circle")
        .attr("cx", w - r)
        .attr("cy", function(d, i) {
            return i * (h / aKeyValues.length) + boxh / 2;
        })
        .attr("r", r)
        .attr("fill", function(d, i){
            name = "color" + (aKeyValues.length - i - 1)
            return oKeyColors[name]
        })
        .attr("opacity", "0.7")

    var fontSize = Math.round(boxh * 0.5)
    svg.selectAll("text")
        .data(aKeyValues)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        
        .attr("x", 5)
        .attr("y", function(d, i) {
            return i * (h / aKeyValues.length) + boxh / 2 + fontSize / 3;
        })
        .attr("font-family", "Arial")
        .attr("font-size", fontSize + "px")
        .attr("fill", "darkslategrey");
}


/***** NEW LEGEND  */

function addLegend(divName, colorArray, textArray){
    var r = 57;
        var padding = 0.5;
        var heightpadding = 3;
        //var fontsize = 18;

        var w =  (r * 2 + 2 * padding) + (aKeyValues.length * r);
        var h = 48;

    var svg = d3.select(divName)
            .append("div")
            .classed("svg-container", true)
            .append("svg")
            .attr("width", w)
            .attr("height", h + 5)
    .attr("fill", "red")

        svg.selectAll("rect")
            .data(colorArray)
            .enter()
            .append("rect")
            .attr("y", heightpadding)
            .attr("x", function(d, i){
                return (padding) + (i * r);
            })
            .attr("width", r  - padding)
            .attr("height", h - heightpadding)
            .attr("fill", function(d){
                return d
            })
            .attr("stroke", "black");
    var fontSize = 14
        svg.selectAll("text")
            .data(textArray)
            .enter()
            .append("text")
            .text(function(d) {
                return d;
            })
            //.attr("text-anchor", "middle")
    .attr("x", function(d, i){
                return 10 + (i * r);
            })
    .attr("y", 30)
            .attr("font-family", "Arial")
            .attr("font-size", fontSize + "px")
            .attr("fill", "darkslategrey");
}


$(function () {
    $("#legendButton").click(function () {
        if (legendFlag == false) {
            setKeyColors();
            var colorArray_obesity = oKeyColors;
            addLegend(divName_obesity, colorArray_obesity, textArray_obesity)
            addLegend(divName_index, colorArray_index, textArray_index)
            legendFlag = true;
        }
        $(".legendModal").modal("show");
    })
})
