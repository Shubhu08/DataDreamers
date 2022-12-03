const options = {
    config: {
      // vega-lite default configuration
    },
    init: (view) => {
      // initialize tooltip handler
      view.tooltip(new vegaTooltip.Handler().call);
      // enable horizontal scrolling for large plots
      if (view.container()) view.container().style["overflow-x"] = "auto";
    },
    view: {
      // view constructor options
      loader: vega.loader({
        baseURL: "https://cdn.jsdelivr.net/npm/vega-datasets@1/",
      }),
      renderer: "canvas",
    },
  };

  vl.register(vega, vegaLite, options);

  d3.csv("../data/stacked_bar_data.csv").then(csv => {

    var year = [...new Set(csv.map(d => d.year))]

    d3.select("#year").selectAll("option")
      .data(year)
      .enter().append("option")
      .text(d => d)

    update(d3.select("#year").property("value"), 1)

    function update(input, flag) {

      var data = csv.filter(f => f.year == input)
      // console.log(data)

      vl.markBar().data(data).encode(
      vl.x().fieldO('age').title('Age Group'),
      vl.y().fieldQ('migrant_count').title("Number of Migrants"),
      vl.color().fieldO('gender'),
      vl.tooltip(["migrant_count", "gender", "age"])
    )
      // .title("Distribution of migrants for year 2020 by age and gender for countries of different income-level")
      .render()
      .then((chart) => {
        if (flag==1){
          document.getElementById("faceted_bar_chart").appendChild(chart)
        }
        else{
          document.getElementById("faceted_bar_chart").replaceChild(chart, document.getElementById("faceted_bar_chart").childNodes[0]);
        }
      });
    }

    var select = d3.select("#year")
		.on("change", function() {
			update(this.value)
		})

  });
