// Stuff for FCC tests.
var projectName = "scatter-plot";
localStorage.setItem('example_project', 'D3: Scatter Plot');

// URL for cycling doping data.
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


// Set global variables for visualization.
var width = 800;
var height = 400;

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


	

	
  })
  // Log error if promise on loading data not fulfilled.
  .catch(function(error) {
      console.log(error);
  });
