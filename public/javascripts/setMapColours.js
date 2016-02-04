function addPolygonColors(map, idLA, dropdownChoice){

    map.data.setStyle(function (feature) {
        var msoaName = String(feature.getProperty('MSOA11NM'));
        //console.log(msoaName);
        if (!oMSOAData.hasOwnProperty(msoaName)) {
            return {
                fillColor: selectKeyColor("NA"),
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        } else {

            var n = oMSOAData[msoaName]["children"]["percObeseYr6"];

            if(dropdownChoice == "5yr"){
                n = oMSOAData[msoaName]["children"]["percObeseReception"];

            } else if (dropdownChoice == "adult"){
                n = oMSOAData[msoaName]["adults"]["percObese"];
            } 
            
            //console.log(n);
            var color = selectKeyColor(n);
            return {
                fillColor: color,
                fillOpacity: 0.7,
                strokeWeight: 0.5,
                strokeOpacity: 0.7,
                strokeColor: "black"
            }
        }
    })

}

function polygonColors(map, dropdownChoice){
    var idLA = map.idLA;
    $('.loading').show();
    //if(oMSOAData.hasOwnProperty(oMSOAData)) {
        addPolygonColors(map, idLA, dropdownChoice)
        $('.loading').hide();
}