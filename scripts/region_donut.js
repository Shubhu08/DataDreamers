// d3.csv("../data/region_donut_chart_data.csv").then(data => {

//     var width = 400;
//     var height = 260;
//     var thickness = 30;

//     var radius = Math.min(width, height) / 5;
//     var color = d3.scaleOrdinal(d3.schemeCategory10);

//     var svg = d3.select("#region_chart")
//         .append('svg')
//         .attr('class', 'pie')
//         .attr('width', width)
//         .attr('height', height)
//         .append('g')
//         .attr('transform', 'translate(' + (width / 4) + ',' + (height / 4) + ')');


//     var regions = [...new Set(data.map(d => d.region))]

//     //legend
//     svg.selectAll('circle')
//         .data(regions)
//         .enter()
//         .append("circle")
//         .attr("cx", 100)
//         .attr("cy", (d, i) => (i-1) * -20)
//         .attr("r", 6)
//         .attr('fill', (d, i) => color(i))

//     svg.selectAll('text')
//         .data(regions)
//         .enter()
//         .append("text")
//         .attr("x", 120)
//         .attr("y", (d, i) => (i-1) * -20)
//         .text(d => d)
//         .style("font-size", "12px")
//         .style("font-weight", 'bold')
//         .attr("alignment-baseline", "middle")

//     var arc = d3.arc()
//         .innerRadius(radius - thickness)
//         .outerRadius(radius);

//     var pie = d3.pie()
//         .value(function (d) { return d.migrant_count; })
//         .sort(null);

//     var path = svg.selectAll('path')
//         .data(pie(data))
//         .enter()
//         .append("g")
//         .append('path')
//         .attr('d', arc)
//         .attr('fill', (d, i) => color(i))

//     var year = [...new Set(data.map(d => d.year))]

//     d3.select("#new_year").selectAll("option")
//         .data(year)
//         .enter().append("option")
//         .text(d => d)


//     new_update(d3.select("#new_year").property('value'))
//     function new_update(input) {

//         var new_data = data.filter(f => f.year == input)

//         var path = svg.selectAll("path")
//             .data(pie(new_data))

//         path
//             .exit()
//             .remove()

//         path
//             .enter()
//             .append('path')
//             .merge(path)
//             .attr('d', arc)
//             .attr('fill', (d, i) => color(i))
//             .attr("stroke", "white")
//             .style("stroke-width", "1px")

//     }

//     d3.select("#new_year")
//         .on("change", function () {
//             //console.log(this.value)
//             new_update(this.value)
//         })

// });