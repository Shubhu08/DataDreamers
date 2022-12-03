// var res = data.map(function(d){ return d.Continent });
// res  = Array.from(new Set(res));
const res = ['Asia', 'Europe', 'Africa', 'Oceania', 'Americas'];
const ContinentColor = d3.scaleOrdinal()
  .domain(res)
  .range(['#7fc97f', '#beaed4', '#fdc086', '#bf5b17', '#386cb0'])

const colors = { 'Asia': '#7fc97f', 'Europe': '#beaed4', 'Africa': '#fdc086', 'Oceania': '#bf5b17', 'Americas': '#386cb0' }


var parseTime = d3.timeParse("%Y")

var promises_multiline = []

promises_multiline.push(d3.csv("data/stacekd_area.csv", function(d) {
  //d.Time = d.Time;
  d.war = +d.n;
  d.Time = parseTime(d.Time);
  // d.NetMigrations = +d.NetMigrations;
  return d;
}))

promises_multiline.push(d3.csv("data/multiline_chart.csv", function(d) {
// promises_multiline.push(d3.csv("data/data_country_specific.csv", function(d) {
  d.Time = parseTime(d.Time);
  d.NetMigrations = +d.NetMigrations;
  return d;
}))

Promise.all(promises_multiline).then(function (values) {
  data = values[1]
  stacked_data = values[0]

  //console.log(stacked_data)

  selector_continent = "Asia"
  if (selector_continent) {
    //console.log('selector_continent', selector_continent)
    new_data = selector_continent == "All" ?
      stacked_data :
      stacked_data.filter(d => d.Continent.includes(selector_continent));
  }

  chart = StackedAreaChart(new_data, {
    x: d => d.Time,
    y: d => d.war,
    z: d => d.WarType,
    yLabel: "War Death",
    width: 800,
    height: 400,
    yFormat: "s",
    svg_id: "#stacked_area"

  });

  var new_data = data;

  if (selector_continent) {
    new_data = selector_continent == "All" ?
      new_data :
      new_data.filter(d => d.Continent.includes(selector_continent));
  }
  
  var selector_amount = 5
  if (selector_amount != "All") {
    var sorted_data = d3.groups(
      new_data,
      o => o.Location,
    ).sort((a, b) => d3.descending(+a.NetMigrations, +b.NetMigrations));

    var selected_countries =  d3.rollups(
          new_data,
          xs => d3.sum(xs, x => x.NetMigrations),
          d => d.Location
        )
        .map(([k, v]) => ({ Country: k, Value: v }))
        .sort((a, b) => d3.descending(+a.Value, +b.Value)).slice(0, selector_amount)
        .map((d) => (d.Country));
    //console.log('selectot_amount', selector_amount, 'selected_countries', selected_countries);

    // var sorted_countries = [];
    // sorted_data.forEach(elem => sorted_countries.push(elem[0]));
    // console.log('sorted_countries', sorted_countries);
    // var selected_countries = sorted_countries.slice(0, selector_amount);
    new_data = new_data.filter(d => selected_countries.includes(d.Location));
    //console.log(new_data);
  }
  // End to sort from top 

  chart = LineChart(new_data, {
    x: d => d.Time,
    y: d => d.NetMigrations,
    z: d => d.Location,
    yLabel: "Migration",
    width: 800,
    height: 400,
    yFormat: "s",
    color: d => colors[d.Continent],
    // color: "steelblue",
    voronoi: false, // if true, show Voronoi overlay
    svg_id: "#multiline-chart"
  });

  // Filtering Options: Continent
  d3.select("#multiline-continent")
    .on("change", function () {
      var new_data = data;

      // Start to filter from continent
      var selector_continent = document.getElementById('multiline-continent').value;
      if (selector_continent) {
        new_data = selector_continent == "All" ?
          new_data :
          new_data.filter(d => d.Continent.includes(selector_continent));
      }
      // End of filter from continent

      // Start to sort from top
      var selector_amount = document.getElementById('multiline-amount').value;
      if (selector_amount != "All") {
        var sorted_data = d3.groups(
          new_data,
          o => o.Location,
        ).sort((a, b) => d3.descending(+a.NetMigrations, +b.NetMigrations));

        var selected_countries =  d3.rollups(
              new_data,
              xs => d3.sum(xs, x => x.NetMigrations),
              d => d.Location
            )
            .map(([k, v]) => ({ Country: k, Value: v }))
            .sort((a, b) => d3.descending(+a.Value, +b.Value)).slice(0, selector_amount)
            .map((d) => (d.Country));
        //console.log('selectot_amount', selector_amount, 'selected_countries', selected_countries);
  
        // var sorted_countries = [];
        // sorted_data.forEach(elem => sorted_countries.push(elem[0]));
        // console.log('sorted_countries', sorted_countries);
        // var selected_countries = sorted_countries.slice(0, selector_amount);
        new_data = new_data.filter(d => selected_countries.includes(d.Location));
        //console.log(new_data);
      }
      // End to sort from top 

      //console.log(selector_continent, selector_amount)

      old_svg = d3.select("#multiline-chart")
        .selectAll("g")
        .remove()

      var line_color = colors[selector_continent];
      LineChart(new_data, {
        x: d => d.Time,
        y: d => d.NetMigrations,
        z: d => d.Location,
        yLabel: "Migration",
        width: 800,
        height: 400,
        yFormat: "s",
        color: d => colors[d.Continent],
        voronoi: false, // if true, show Voronoi overlay
        svg_id: "#multiline-chart"
      });

      //Update stacked area chart

      var selector_continent = document.getElementById('multiline-continent').value;
      if (selector_continent) {
        //console.log('selector_continent', selector_continent)
        new_data = selector_continent == "All" ?
          stacked_data :
          stacked_data.filter(d => d.Continent.includes(selector_continent));
      }
      //console.log(new_data);

      old_svg = d3.select("#stacked_area")
        .selectAll("g")
        .remove()

      chart_new = StackedAreaChart(new_data, {
        x: d => d.Time,
        y: d => d.war,
        z: d => d.WarType,
        yLabel: "War Death",
        width: 800,
        height: 400,
        yFormat: "s",
        svg_id: "#stacked_area"
      });


    });


  // Filtering Options: Country Amount
  d3.select("#multiline-amount")
    .on("change", function () {
      var new_data = data;

      // Start to filter from continent
      var selector_continent = document.getElementById('multiline-continent').value;
      if (selector_continent) {
        new_data = selector_continent == "All" ?
          new_data :
          new_data.filter(d => d.Continent.includes(selector_continent));
      }
      // End of filter from continent

      // Start to sort from top
      var selector_amount = document.getElementById('multiline-amount').value;
      if (selector_amount != "All") {
        var sorted_data = d3.groups(
          new_data,
          o => o.Location,
        ).sort((a, b) => d3.descending(+a.NetMigrations, +b.NetMigrations));

        var selected_countries =  d3.rollups(
              new_data,
              xs => d3.sum(xs, x => x.NetMigrations),
              d => d.Location
            )
            .map(([k, v]) => ({ Country: k, Value: v }))
            .sort((a, b) => d3.descending(+a.Value, +b.Value)).slice(0, selector_amount)
            .map((d) => (d.Country));
        //console.log('selectot_amount', selector_amount, 'selected_countries', selected_countries);
  
        // var sorted_countries = [];
        // sorted_data.forEach(elem => sorted_countries.push(elem[0]));
        // console.log('sorted_countries', sorted_countries);
        // var selected_countries = sorted_countries.slice(0, selector_amount);
        new_data = new_data.filter(d => selected_countries.includes(d.Location));
        //console.log(new_data);
      }
      // End to sort from top 

      old_svg = d3.select("#multiline-chart")
        .selectAll("g")
        .remove()

      LineChart(new_data, {
        x: d => d.Time,
        y: d => d.NetMigrations,
        z: d => d.Location,
        yLabel: "Migration",
        width: 800,
        height: 400,
        yFormat: "s",
        color: d => colors[d.Continent],
        voronoi: false, // if true, show Voronoi overlay
        svg_id: "#multiline-chart"
      });

    });

})
