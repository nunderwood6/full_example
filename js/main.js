function loadData(){
    Promise.all([
      d3.json("data/aoi_extent_wgs84.geojson"),
      d3.json("data/raster_extent_wgs84.geojson"),
      d3.json("data/land.geojson")
    ])
    .then(function([aoiExtentJSON,rasterExtentJSON,landJSON]){
        var aoiExtent = aoiExtentJSON;
        var rasterExtent = rasterExtentJSON;
        var land = landJSON.features;
        positionMap(aoiExtent,rasterExtent,land);

    });
}

loadData();

function positionMap(aoiExtent,rasterExtent,land){

	var screenRatio = window.innerWidth/window.innerHeight;
    //reset based on ratio
    var focusAreaRatio = .46586;

    var w = document.querySelector("div.map").getBoundingClientRect().width;
    var h = document.querySelector("div.map").getBoundingClientRect().height;

    var margin = {top: 0, right: 0, bottom: 0, left: 0}

    //create che projection
	const centerLocation = {
	  "longitude": -64.5,
	  "latitude": -36.5
	};
	//albers centered on chile/argentina
	const albersChe = d3.geoConicEqualArea()
	                  .parallels([-43,-30]) 
	                  .rotate([centerLocation["longitude"]*-1,0,0])
	                  .center([0,centerLocation["latitude"]])
	                  .fitExtent([[margin.left,margin.top],[w-margin.right,h-margin.bottom]], aoiExtent);
;

	//path generator
    const pathChe = d3.geoPath()
             .projection(albersChe);

    var svg = d3.select("div.map")
              .append("svg")
              .attr("viewBox", `0 0 ${w} ${h}`)
              .attr("overflow", "visible")
              .style("position","relative");

    //calculate raster extent percentages
    var rasterBounds = pathChe.bounds(rasterExtent);
    var rasterWidth = (rasterBounds[1][0] - rasterBounds[0][0])/w*100;
    var rasterOrigin = [rasterBounds[0][0]/w*100,rasterBounds[0][1]/h*100];

    //append raster background
    svg.append("image")
            .attr("href", "data/backdrop.jpg")
            .attr("x", rasterOrigin[0]+"%")
            .attr("y", rasterOrigin[1]+"%")
            .attr("width", rasterWidth + "%")
            .attr("transform", "translate(-0.5,2)");

    // svg.selectAll(".land")
    // 		.data(land)
    // 		.enter()
    // 		.append("path")
    // 			.attr("d", pathChe)
    // 			.attr("fill", "rgba(0,0,0,0.2")
    // 			.attr("stroke", "none");
																			                                                                                                                                                                                                                                                                            

}





