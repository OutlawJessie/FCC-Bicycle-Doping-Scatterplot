// Stuff for FCC tests.
var projectName = "scatter-plot";
localStorage.setItem('example_project', 'D3: Scatter Plot');

// URL for cycling doping data.
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


// Set global variables for visualization.
var width = 800;
var height = 400;
var marginLeft = 60;

// Add an h1 title.
var section = d3.select(".header-info")
	        .append("h1")
	        .attr("id","title")
	        .text("Bicycle Doping Incidents on Alpe d'Huez");


// Declare svg d3 object.
var svgStuff = d3.select(".d3-div")
            .append("svg")
            .attr("width", width*1.15)
            .attr("height", height*1.15);



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
	    .domain([xMin, xMax + 1]) // add one so last tick label appears
	    .range([0, width]);
	let xAxis = d3.axisBottom(yearScale)
	              .tickFormat(d3.format("d")); // remove comma in thousands

	// Plot x-axis.
	let xAxisPlot = svgStuff.append("g")
	    .call(xAxis)
	    .attr("id","x-axis")
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
	    .attr("transform", "translate(60, 0)");
	

	

	
  })
  // Log error if promise on loading data not fulfilled.
  .catch(function(error) {
      console.log(error);
  });
