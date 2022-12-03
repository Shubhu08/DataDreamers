d3.csv("../data/origin_continent_data.csv").then(data => {

    var width = 500;
    var height = 350;
    var thickness = 30;

    var radius = Math.min(width, height) /2;
    var color = d3.scaleOrdinal(d3.schemeTableau10);

    var svg = d3.select("#overview_chart")
        .attr('class', 'pie')
        .attr("viewBox", [0, 0, 500, 350])
        .append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

    var continents = [...new Set(data.map(d => d.Continent))].sort()
    // console.log(continents)

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.migrant_count; })
        .sort(function (a, b) {
            return b.migrant_count
              .localeCompare(a.migrant_count);
          });

    updateOverview(d3.select("#overview-year").property('value'))
    //console.log("Overview pi year ",d3.select("#overview-year").property('value'))

    function updateOverview(input) {
        // console.log(input)
        var new_data = data.filter(f => f.Year == input)

        var region_total = d3.sum(new_data, d=> d.migrant_count);
        new_data.forEach(function(d) {
            d.percentage = parseFloat(d.migrant_count  / region_total).toFixed(2) * 100;
        });

        // console.log(new_data)

        // if (input == 1990) {
        //     new_data[0].percentage_change=8
        //     new_data[1].percentage_change=15
        //     new_data[2].percentage_change=11
        //     new_data[3].percentage_change=9
        //     new_data[4].percentage_change=1
        //     new_data[5].percentage_change=1
        // } else {
        //     var prev = data.filter(f => f.Year == input - 5)
        //     new_data.map(function (d, i) {
        //         d.percentage_change = parseFloat((d.migrant_count - prev[i].migrant_count) / prev[i].migrant_count).toFixed(2) * 100;
        //     });
        // }
        // console.log(new_data)
        
        var asia_p = new_data.filter(f => f.Continent == 'Asia')[0]['percentage']
        var europe_p = new_data.filter(f => f.Continent == 'Europe')[0]['percentage']
        var latin_p = new_data.filter(f => f.Continent == 'Latin America and the Caribbean')[0]['percentage']
        var africa_p = new_data.filter(f => f.Continent == 'Africa')[0]['percentage']
        var us_p = new_data.filter(f => f.Continent == 'Northern America')[0]['percentage']
        var oceania_p = new_data.filter(f => f.Continent == 'Oceania')[0]['percentage']

        document.getElementById("asia_span").innerHTML = asia_p.toFixed(0).toString()+"%"
        document.getElementById("europe_span").innerHTML = europe_p.toFixed(0).toString()+"%"
        document.getElementById("latin_span").innerHTML = latin_p.toFixed(0).toString()+"%"
        document.getElementById("africa_span").innerHTML = africa_p.toFixed(0).toString()+"%"
        document.getElementById("us_span").innerHTML = us_p.toFixed(0).toString()+"%"
        document.getElementById("oceania_span").innerHTML = oceania_p.toFixed(0).toString()+"%"

        var pie = d3.pie()
        .value(function (d) { return d.migrant_count; });
        
        var path = svg.selectAll("path")
            .data(pie(new_data))

        path
            .exit()
            .remove()

        const formatValue = d3.format('s')

        path
            .enter()
            .append('path')
            .merge(path)
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .append('title').style("font-size", "20px").text(d=>{return `${d.data.Continent}\n${formatValue(d.data.migrant_count)}` })
    }

    d3.select("#overview-year")
        .on("input", function () {
            updateOverview(this.value)
            val = this.value
            var event = new Event('input');

            document.getElementById('overview-year-title').innerHTML = val; 
            document.getElementById('overview-year-scroll-title').innerHTML = "Year " + val;

            document.getElementById('sankey-title-year').innerHTML= "Year " + val;
            
            document.getElementById('sankey-title').value = val; 
            document.getElementById('sankey-title').dispatchEvent(event);
        
            document.getElementById('choropleth-title').innerHTML= "Showing the migration trends for the year " + val; 
            document.getElementById('choropleth-year').value = val; 
            document.getElementById('choropleth-year').dispatchEvent(event);
        
            document.getElementById('year_span').innerHTML= "Year " + val; 
            document.getElementById('year').value = val; 
            document.getElementById('year').dispatchEvent(event);
        })
});