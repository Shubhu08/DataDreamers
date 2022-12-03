// import data from '../data/faceted_chart.json' assert {type: 'json'};

// const options = {
//     config: {
//       // vega-lite default configuration
//     },
//     init: (view) => {
//       // initialize tooltip handler
//       view.tooltip(new vegaTooltip.Handler().call);
//       // enable horizontal scrolling for large plots
//       if (view.container()) view.container().style["overflow-x"] = "auto";
//     },
//     view: {
//       // view constructor options
//       loader: vega.loader({
//         baseURL: "https://cdn.jsdelivr.net/npm/vega-datasets@1/",
//       }),
//       renderer: "canvas",
//     },
//   };

// vl.register(vega, vegaLite, options);

// vl.markBar().data(data).encode(
//     vl.x().fieldO('gender').title('Gender'),
//     vl.y().fieldQ('migrant_count').title("Number of Migrants"),
//     vl.color().fieldO('region').sort(['Low-income countries', 'Middle-income countries', 'High-income countries']).title('Region'),
//     vl.tooltip(["region", "migrant_count", "year"]),
//     vl.column().fieldO('age').title('Age Group'),
// )
// // .title("Distribution of migrants for year 2020 by age and gender for countries of different income-level")
// .render()
// .then((chart) => {
//     document.getElementById("faceted_bar_chart").appendChild(chart);
// });
