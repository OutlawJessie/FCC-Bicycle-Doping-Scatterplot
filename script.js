// Stuff for FCC tests.
var projectName = "scatter-plot";
localStorage.setItem('example_project', 'D3: Scatter Plot');

// URL for cycling doping data.
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


// Set global variables for visualization.
var width = 800;
var height = 400;
var marginLeft = 60;
var marginTop = 0;

// Add an h1 title.
var section = d3.select(".header-info")
	        .append("h1")
	        .attr("id","title")
	        .text("Bicycle Doping Incidents on Alpe d'Huez");

// Tooltip for mouseover inside json function.
var tooltip = d3.select("body") // Doesn't work if you select d3-div
    .append("div")
    .attr("id","tooltip")
    .style("display","none"); // will set display of tooltip for each circle


// Declare svg d3 object.
var svgStuff = d3.select(".d3-div")
            .append("svg")             // will append svg to this!
            .attr("width", width*1.15)
            .attr("height", height*1.15);


// Create a simple legend following this example: https://www.d3-graph-gallery.com/graph/custom_legend.html.
var legendColors = ["green", "red"];
var legend = d3.select("svg")
    .append("g")
    .attr("id", "legend");

// Legend background box.
//legend.select("#legend").append("circle").attr("cx", width + marginLeft).attr("cy",130).attr("r", 6).style("fill", legendColors[0]);
legend.append("circle").attr("cx", width + marginLeft).attr("cy",130).attr("r", 6).style("fill", legendColors[0]);
legend.append("circle").attr("cx",width + marginLeft).attr("cy",160).attr("r", 6).style("fill", legendColors[1]);
legend.append("text").attr("x", width + marginLeft +  20).attr("y", 130).text("Doping Accusation").style("font-size", "15px").attr("alignment-baseline","middle");
legend.append("text").attr("x", width + marginLeft + 20).attr("y", 160).text("No Accusation").style("font-size", "15px").attr("alignment-baseline","middle");



/* Function for coloring each data point based on legend colors. */
function setColor(desc){
    return (desc.length === 0) ? (legendColors[0]) : (legendColors[1]);
}

// Get json data using D3 fetch method.
d3.json(url)
  // Promise as function of data...
    .then(function(data) {

	// Add future y-label
	svgStuff.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('x', -300)
	.attr('y', 10)
	.text('Ascent Time (Minutes)');
	
	// Add future x-label.
	svgStuff.append('text')
	.attr('x', width / 2 )
	.attr('y', height + 50)
        .text('Year')
        .attr('class', 'info');


	// Extract information.
	let year = data.map( obj => parseInt(obj["Year"]));
	let ascentTime = data.map( obj => obj["Time"]);
	let name = data.map( obj => obj["Name"]);
	let description = data.map( obj => obj["Doping"]);

	// Parse the ascent time for easier plotting on y axis
	let minutes = ascentTime.map( (timeStr) => {
	    let parsedMinSec = timeStr.split(":");
	    return new Date(1984, 0, 1, 0, parsedMinSec[0], parsedMinSec[1]);// year month day hour minute second
	}); 

	// Assemble x-axis.
	let xMin = d3.min(year);
	let xMax = d3.max(year);
	let yearScale = d3.scaleLinear()
	    .domain([xMin - 1, xMax + 1]) // add/subtract one so last tick label appear and data points in graph
	    .range([0, width]);
	let xAxis = d3.axisBottom(yearScale)
	              .tickFormat(d3.format("d")); // remove comma in thousands

	// Plot x-axis.
	let xAxisPlot = svgStuff.append("g")
	    .call(xAxis)
	    .attr("id", "x-axis")
	    .attr("transform", "translate(" + marginLeft + ","  + height + ")"); //"translate(60, 400)");


	// Assemble y-axis using slightly altered dates so we can see all data points.
	let yMin = d3.min(minutes);
	let yMax = d3.max(minutes);
	let yMinFixAxis = new Date(yMin);
	let yMaxFixAxis = new Date(yMax);
	yMinFixAxis.setSeconds(yMinFixAxis.getMinutes() - 1); // use this minima for domain so can see ticks
	yMaxFixAxis.setSeconds(yMaxFixAxis.getMinutes() + 1); // use this maxima for domain so can see ticks

	// Assemble y-axis.
	let timeFormat = d3.timeFormat("%M:%S");
	let minutesScale = d3.scaleLinear()
	    .domain([yMinFixAxis, yMaxFixAxis]) // Use altered domain so can see ticks
	    .range([height, 0]);	
	let yAxis = d3.axisLeft(minutesScale)
	              .tickFormat(timeFormat); // show minutes:seconds as tick marks


	// Plot y-axis.
	let yAxisPlot = svgStuff.append("g")
	    .call(yAxis)
	    .attr("id", "y-axis")
	    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

	// Add scalable vector graphic for creating scatter plot.
	d3.select("svg")
	    .selectAll("circle")
	    .data(data)
	    .enter()
	    .append("circle")
	    .attr("class", "dot")
	    .attr("cx", (d, i) => yearScale( year[i] )  )
	    .attr("cy", (d, i) => minutesScale( minutes[i] ) )//height - minutes[i] )
	    .attr("r", 3)
            .attr("transform", "translate(" + marginLeft + "," + marginTop + ")") // Move the circles to the right to lign up with x-axis.
	    .attr("fill", (d, i) => setColor( description[i] ) )
	    .attr("data-xvalue", (d, i) => year[i] ) // Pass test 5
	    .attr("data-yvalue", (d, i) => minutes[i] ) // Pass test 5
	    .on("mouseover", (d, i) => {
		tooltip.attr("data-year",year[i])
		.style('display', 'inline-block')		
		    .style("left", d3.event.pageX - 120 + "px") // Position x coordinate of tooltip relative to current bar
	        .style("top", d3.event.pageY - 120 + "px") // Position y coordinate of tooltip relative to current bar
	        .style('transform', 'translateX(60px)')
	               .html(d.Name);
	})
	.on("mouseout", (d) => {
	    tooltip.style("display","none");
	});


	/*legend.selectAll("g")
	    .data(data)
	    .enter()
	    .append("g")
            .style("position", "absolute")
	    .attr("x", 0.7*width)
	    .attr("y", 0.5*height)
	    .attr("width", 175 )
	    .attr("height", 100);*/

	
  })
  // Log error if promise on loading data not fulfilled.
  .catch(function(error) {
      console.log(error);
  });
