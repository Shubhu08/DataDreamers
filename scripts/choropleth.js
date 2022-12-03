var promises = [];

promises.push(d3.json("data/countries-110m.json"));
promises.push(d3.csv("data/data_country_specific_GDP(per capita).csv"));

Promise.all(promises).then(function (values) {  //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  var world = values[0];
  var data = values[1];

  countries = topojson.feature(world, world.objects.countries)


  data.forEach(d => {
    country = countries.features.find(f => f.properties.name === d.Location)
    //console.log(countries.features.find(f => f.properties.name === d.Location), d.Location)
    if (country === void 0);
    else d.id = country.id
  });

  countrymap = new Map(countries.features.map(d => [d.id, d]))

  countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b)



  first_data = data.filter(d => d.Time === '2020')

  chart = Choropleth(first_data, {
    id: d => d.id,
    value: d => d.NetMigrations, //thresholdScale(d.NetMigrations),
    scale: d3.scaleThreshold,
    domain: [-100,-5,0,5,100],//thresholdScale(d3.extent(data, d => +d.NetMigrations)),
    range: d3.schemeRdBu[5],
    title: (f, d) => `${f.properties.name}, ${d?.NetMigrations}%`,
    features: countries,
    borders: countrymesh,
    strokeWidth: 1,
    svg_id: "#choropleth-chart"
  })

  res_data = first_data.sort((a, b) => d3.descending(+a.NetMigrations, +b.NetMigrations))
  res_data1 = res_data.slice(0, 3)
  res_data2 = res_data.slice(-3)

  chart = BarChart(res_data1, {
    x: d => d.Location,
    y: d => d.GDP,
    xDomain: d3.map(res_data1, d => d.Location), // sort by descending frequency
    yDomain: [0,d3.max(res_data1, d => +d.GDP)],
    yFormat: "s",
    yLabel: "GDP",
    color: "rgb(33, 102, 172)",//"steelblue",
    svg_id: "#choropleth-kpi-gdp",
    height: 200,
    width: 400
  })

  chart = BarChart(res_data1, {
    x: d => d.Location,
    y: d => +d.TotalMigrants,
    xDomain: d3.map(res_data1, d => d.Location), // sort by descending frequency
    yDomain: [0, d3.max(res_data1, d => +d.TotalMigrants)],
    yFormat: "s",
    yLabel: "Net Migrations",
    color: "rgb(33, 102, 172)",//"steelblue",
    svg_id: "#choropleth-kpi-nm",
    height: 200,
    width: 400
  })


  //d3.select("#choropleth-chart").append(chart)
  d3.select("#choropleth-year")
    .on("input", function () {
      new_data = data.filter(d => d.Time === this.value)
      res_data = new_data.sort((a, b) => d3.descending(+a.NetMigrations, +b.NetMigrations))
      res_data1 = res_data.slice(0, 3)

      old_svg = d3.select("#choropleth-chart")
        .selectAll("g")
        .remove()

      old_svg = d3.select("#choropleth-kpi-nm")
        .selectAll("g")
        .remove()
      
      old_svg = d3.select("#choropleth-kpi-gdp")
        .selectAll("g")
        .remove()
      
      Choropleth(new_data, {
        id: d => d.id,
        value: d => d.NetMigrations, //thresholdScale(d.NetMigrations),
        scale: d3.scaleThreshold,
        domain: [-100,-5,0,5,100],//thresholdScale(d3.extent(data, d => +d.NetMigrations)),
        range: d3.schemeRdBu[5],
        title: (f, d) => `${f.properties.name}, ${d?.NetMigrations}%`,
        features: countries,
        borders: countrymesh,
        strokeWidth: 1,
        svg_id: "#choropleth-chart"
      })

      chart = BarChart(res_data1, {
        x: d => d.Location,
        y: d => d.NetMigrations,
        xDomain: d3.map(res_data1, d => d.Location), // sort by descending frequency
        yDomain: [0, d3.max(res_data1, d => +d.NetMigrations)],
        yFormat: "s",
        yLabel: "Net Migrations",
        color: "rgb(33, 102, 172)",//"steelblue",
        svg_id: "#choropleth-kpi-nm",
        height: 200,
        width: 400
      })

      chart = BarChart(res_data1, {
        x: d => d.Location,
        y: d => d.GDP,
        xDomain: d3.map(res_data1, d => d.Location), // sort by descending frequency
        yDomain: [0,d3.max(res_data1, d => +d.GDP)],
        yFormat: "s",
        yLabel: "GDP",
        color: "rgb(33, 102, 172)",//"steelblue",
        svg_id: "#choropleth-kpi-gdp",
        height: 200,
        width: 400
      })

    });

});