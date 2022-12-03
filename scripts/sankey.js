var promises_sankey = [];

promises_sankey.push(d3.csv("./data/sankey_data.csv", function (d) {
  var formatYear = d3.timeFormat("%Y");
  var parseYear = d3.timeParse("%Y");
  d.value = +d.value;
  d.Year = formatYear(parseYear(+d.Year));
  return d;
})); //data_country_specific

promises_sankey.push(d3.csv("data/sankey_kpi.csv", function (d) {
  var parseTime = d3.timeParse("%Y")
  d.Year = parseTime(d.Year);
  d.value = +d.value;
  return d;
}));



Promise.all(promises_sankey).then(function (values) {
  data_1 = values[0]
  data_2 = values[1]
  //console.log(data_1)

  chart = SankeyChart({
    links: data_1.filter(d => d.Year == 2020 & d.origin.includes("ASIA")),
    svg_id: "#sankey-chart"
  }, {
    nodeGroup: d => d.id,//.split(/\W/)[0], // take first word for color
    linkSource: d => d.origin,
    linkTarget: d => d.destination,
    nodeAlign: 'justify', // e.g., d3.sankeyJustify; set by input above
    linkColor: 'source-target', // e.g., "source" or "target"; set by input above
    format: (f => d => `${f(d)} Migrants`)(d3.format(",.1~f")),
    width: 1200,
    height: 600
  })

  var parseTime = d3.timeParse("%Y")
  const res = ['ASIA', 'EUROPE', 'AFRICA', 'OCEANIA', 'NORTHERN AMERICA', 'LATIN AMERICA AND THE CARIBBEAN'];
  const ContinentColor = d3.scaleOrdinal()
    .domain(res)
    .range(['#7fc97f', '#beaed4', '#fdc086', '#bf5b17', '#386cb0', '#d62728'])

  const colors = { 'ASIA': '#7fc97f', 'EUROPE': '#beaed4', 'AFRICA': '#fdc086', 'OCEANIA': '#bf5b17', 'NORTHERN AMERICA': '#386cb0', 'LATIN AMERICA AND THE CARIBBEAN': '#d62728' }

  function formatLineTitle(entry){
    lineFormat = d3.format("s")
    lineCountry = titleCase(entry.destination.split('_')[0])
    return lineCountry + ": " + lineFormat(entry.value)
  }

  chart = LineChart(data_2.filter(d => d.origin.includes("ASIA") & d.destination != "WORLD_d"), {
    x: d => d.Year,
    y: d => d.value,
    z: d => d.destination.split('_')[0],
    yLabel: "Migration",
    width: 600,
    height: 300,
    yFormat: "s",
    title: d => formatLineTitle(d),
    color: d => colors[d.destination],
    // color: "steelblue",
    voronoi: false, // if true, show Voronoi overlay
    svg_id: "#sankey-chart-kpi"
  });

  //document.getElementById("sankey-chart").appendChild(chart)
  sel_year = 2020
  sel_origin = "ASIA"
  sel_destination = "WORLD_d"

  d3.select("#sankey-title")
    .on("input", function () {
      //console.log(+this.value);
      sel_year = this.value
      /*
      if(sel_origin == "All" & sel_destination =="All_d" & sel_year =="2020")
      {new_data = data.filter(d => d.Year == 2020)}

      else if (sel_origin == "All" & sel_destination =="All_d")
      {new_data = data.filter(d => d.Year.includes(sel_year))}

      else if (sel_origin == "All" & sel_year =="2020")
      {new_data = data.filter(d => d.destination.includes(sel_destination) & d.Year.includes(sel_year))}

      else if (sel_year == "2020" & sel_destination =="All_d")
      {new_data = data.filter(d => d.origin.includes(sel_origin) & d.Year.includes(sel_year))}


      else if (sel_year == "2020"){
      console.log(sel_year);
       new_data = data.filter(d => d.origin.includes(sel_origin) &  d.destination.includes(sel_destination) & d.Year.includes(sel_year))}
      
      
      else if (sel_origin == "All")
      {new_data = data.filter(d => d.Year.includes(sel_year) &  d.destination.includes(sel_destination))}
      
      else if (sel_destination == "All_d")
      {new_data = data.filter(d => d.Year.includes(sel_year) &  d.origin.includes(sel_origin))}
      
      else
      {new_data = data.filter(d => d.Year.includes(sel_year) &  d.origin.includes(sel_origin) &  d.destination.includes(sel_destination))}
      */

      new_data = data_1.filter(d => d.Year == sel_year & d.origin.includes(sel_origin))
      old_svg = d3.select("#sankey-chart")
        .selectAll("g")
        .remove()

      SankeyChart({
        links: new_data, //data1,
        svg_id: "#sankey-chart"
      }, {
        nodeGroup: d => d.id,//.split(/\W/)[0], // take first word for color
        linkSource: d => d.origin,
        linkTarget: d => d.destination,
        nodeAlign: 'justify', // e.g., d3.sankeyJustify; set by input above
        linkColor: 'source-target', // e.g., "source" or "target"; set by input above
        format: (f => d => `${f(d)} Migrants`)(d3.format(",.1~f")),
        width: 1200,
        height: 600
      })

    });


  d3.select("#alluvial-select")
    .on("change", function () {
      //console.log(this.value);
      // new_data1 = data.filter(d => d.origin.includes(this.value))
      sel_origin = this.value
      d3.select("#sankey-kpi-title").text("Net Migration from " + titleCase(sel_origin))
      d3.select("#sankey-chart-title").text("Migrants flow from " + titleCase(sel_origin))

      /*
      if(sel_origin == "All" & sel_destination =="All_d" & sel_year =="2020")
      {new_data1 = data.filter(d => d.Year.includes(sel_year))
     data_2_1 = data_2.filter(d => d.origin == "WORLD" & d.destination == "WORLD_d" )}

      else if (sel_year == "2020" & sel_destination =="All_d")
      {new_data1 = data.filter(d => d.origin.includes(sel_origin) &  d.Year.includes(sel_year))
       data_2_1 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination != "WORLD_d")}

      else if (sel_origin == "All" & sel_year =="2020")
     {new_data1 = data.filter(d => d.destination.includes(sel_destination) &  d.Year.includes(sel_year))
       data_2_1 = data_2.filter(d => d.origin != "WORLD" & d.destination.includes(sel_destination))}

     else if (sel_origin == "All" & sel_destination =="All_d")
     {new_data1 = data.filter(d => d.Year.includes(sel_year))
     data_2_1 = data_2.filter(d => d.origin == "WORLD" & d.destination == "WORLD_d")}


      else if (sel_origin == "All")
     {new_data1 = data.filter(d => d.destination.includes(sel_destination) &  d.Year.includes(sel_year))
       data_2_1 = data_2.filter(d => d.origin == "WORLD" & d.destination == sel_destination)
     console.log(data_2_1)}
     
     
      else if (sel_year == "2020")
      {new_data1 = data.filter(d => d.origin.includes(sel_origin) &  d.destination.includes(sel_destination) &  d.Year.includes(sel_year))
       data_2_1 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))}
     
      else if (sel_destination == "All_d")
     {new_data1 = data.filter(d => d.Year.includes(sel_year) &  d.origin.includes(sel_origin))
       data_2_1 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination == "WORLD_d")}
     
      else
     {new_data1 = data.filter(d => d.Year.includes(sel_year) &  d.origin.includes(sel_origin) &  d.destination.includes(sel_destination))
       data_2_1 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))}
     
       
      /**  var new_data1 = data.filter(d => d.origin.includes(this.value))
       var new_data2 = filter_data[filter_data.length - 1]
       var data2 = new_data1.filter(d => d.Year === new_data2.Year)
       filter_data.push({Year: data2.Year , origin: data2.origin ,destination: data2.destination})
     
       //console.log(this.value); */

       if (sel_destination === "WORLD_d"){
        new_data_sankey = data_1.filter(d => d.Year == sel_year & d.origin.includes(sel_origin))
        new_data_line = data_2.filter(d => d.origin.includes(sel_origin) & d.destination != "WORLD_d")
      }
      else{
        new_data_sankey = data_1.filter(d => d.Year == sel_year & d.origin.includes(sel_origin) & d.destination.includes(sel_destination))
        new_data_line = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))
      }


      old_svg = d3.select("#sankey-chart")
        .selectAll("g")
        .remove()

      old_svg = d3.select("#sankey-chart-kpi")
        .selectAll("g")
        .remove()


      SankeyChart({
        links: new_data_sankey, //data2,
        svg_id: "#sankey-chart"
      }, {
        nodeGroup: d => d.id,//.split(/\W/)[0], // take first word for color
        linkSource: d => d.origin,
        linkTarget: d => d.destination,
        nodeAlign: 'justify', // e.g., d3.sankeyJustify; set by input above
        linkColor: 'source-target', // e.g., "source" or "target"; set by input above
        format: (f => d => `${f(d)} Migrants`)(d3.format(",.1~f")),
        width: 1200,
        height: 600
      })

      chart = LineChart(new_data_line, {
        x: d => d.Year,
        y: d => d.value,
        z: d => d.destination.split('_')[0],
        yLabel: "Migration",
        width: 600,
        height: 300,
        color: d => colors[d.destination],
        title: d => formatLineTitle(d),
        yFormat: "s",
        // color: "steelblue",
        voronoi: false, // if true, show Voronoi overlay
        svg_id: "#sankey-chart-kpi"
      });


    });


  d3.select("#alluvial-select1")
    .on("change", function () {
      //console.log(this.value);
      // new_data2 = data.filter(d => d.destination.includes(this.value+ "_d"))
      sel_destination = this.value + "_d"

      /*
      if(sel_origin == "All" & sel_destination =="All_d" & sel_year =="2020")
      {new_data2 = data.filter(d => d.Year == 2020)
        data_2_2 = data_2.filter(d => d.origin == "WORLD" & d.destination == "WORLD_d" )}

      else if (sel_year == "2020" & sel_origin =="All")
    { new_data2 = data.filter(d => d.destination.includes(sel_destination) &  d.Year.includes(sel_year))
      //data_2_2 = data_2.filter(d => d.origin == "WORLD")
      data_2_2 = data_2.filter(d => d.origin != "WORLD" & d.destination.includes(sel_destination))}

    else if (sel_destination == "All_d" & sel_year =="2020")
  {new_data2 = data.filter(d => d.origin.includes(sel_origin) &  d.Year.includes(sel_year))
    data_2_2 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination != "WORLD_d")}
    

  else if (sel_origin == "All" & sel_destination =="All_d")
  {new_data2 = data.filter(d => d.Year.includes(sel_year))
    data_2_2 = data_2.filter(d => d.origin == "WORLD" & d.destination == "WORLD_d")}


    else if (sel_destination == "All_d"){
    console.log(sel_destination);
  new_data2 = data.filter(d => d.Year.includes(sel_year) &  d.origin.includes(sel_origin))
  data_2_2 = data_2.filter(d => d.origin.includes(sel_origin)  & d.destination == "WORLD_d")}
 // data_2_1 = data_2.filter(d => d.origin.includes(sel_origin))}
  
  
  
     else if (sel_year == "2020")
    {new_data2 = data.filter(d => d.origin.includes(sel_origin) &  d.destination.includes(sel_destination) &  d.Year.includes(sel_year))
      data_2_2 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))}
     // data_2_1 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))}
  
  
   else if (sel_origin == "All")
  {new_data2 = data.filter(d => d.destination.includes(sel_destination) &  d.Year.includes(sel_year))
    data_2_2 = data_2.filter(d => d.origin == "WORLD"  & d.destination == sel_destination)}
   // data_2_1 = data_2.filter(d => d.origin != "WORLD" & d.destination.includes(sel_destination))}
  
   else
  {new_data2 = data.filter(d => d.Year.includes(sel_year) &  d.origin.includes(sel_origin) &  d.destination.includes(sel_destination))
    data_2_2 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))}
    //data_2_1 = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))}
  
     */

      
      if (sel_destination === "WORLD_d"){
        new_data_sankey = data_1.filter(d => d.Year == sel_year & d.origin.includes(sel_origin))
        new_data_line = data_2.filter(d => d.origin.includes(sel_origin) & d.destination != "WORLD_d")
      }
      else{
        new_data_sankey = data_1.filter(d => d.Year == sel_year & d.origin.includes(sel_origin) & d.destination.includes(sel_destination))
        new_data_line = data_2.filter(d => d.origin.includes(sel_origin) & d.destination.includes(sel_destination))
      }


        //console.log(new_data_line)

      old_svg = d3.select("#sankey-chart")
        .selectAll("g")
        .remove()

      old_svg = d3.select("#sankey-chart-kpi")
        .selectAll("g")
        .remove()


        SankeyChart({
          links: new_data_sankey, //data2,
          svg_id: "#sankey-chart"
        }, {
          nodeGroup: d => d.id,//.split(/\W/)[0], // take first word for color
          linkSource: d => d.origin,
          linkTarget: d => d.destination,
          nodeAlign: 'justify', // e.g., d3.sankeyJustify; set by input above
          linkColor: 'source-target', // e.g., "source" or "target"; set by input above
          format: (f => d => `${f(d)} Migrants`)(d3.format(",.1~f")),
          width: 1200,
          height: 600
        })

      chart = LineChart(new_data_line, {
        x: d => d.Year,
        y: d => d.value,
        z: d => d.destination.split('_')[0],
        yLabel: "Migration",
        width: 600,
        height: 300,
        yFormat: "s",
        title: d => formatLineTitle(d),
        color: d => colors[d.destination],
        // color: "steelblue",
        voronoi: false, // if true, show Voronoi overlay
        svg_id: "#sankey-chart-kpi"
      });


    });


});

