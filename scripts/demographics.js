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

var promises_demo = [];

promises_demo.push(d3.csv("../data/stacked_bar_data.csv"));
promises_demo.push(d3.csv("../data/region_donut_chart_data.csv"));
promises_demo.push(d3.csv("../data/gender_donut_data.csv"));

Promise.all(promises_demo).then(function (values) {  //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    var stacked_bar_data = values[0];
    var donut_data = values[1];
    var gender_data = values[2];

    var year = [...new Set(stacked_bar_data.map(d => d.year))]

    // d3.select("#year").selectAll("option")
    //     .data(year)
    //     .enter().append("option")
    //     .text(d => d)

    //document.getElementById("year_span").innerHTML = d3.select("#year").property('value')

    update_stacked_bar(d3.select("#year").property("value"), 1)

    function update_stacked_bar(input, flag) {

        var data = stacked_bar_data.filter(f => f.year == input)

        vl.markBar().data(data).encode(
            vl.x().fieldO('age').title('Age Group'),
            vl.y().fieldQ('migrant_count').title("Number of Migrants"),
            vl.color().fieldN('gender').title('Gender'),
            vl.tooltip(["migrant_count", "gender", "age"])
        )
            // .title("Distribution of migrants for year 2020 by age and gender for countries of different income-level")
            .render()
            .then((chart) => {
                if (flag == 1) {
                    document.getElementById("faceted_bar_chart").appendChild(chart)
                }
                else {
                    document.getElementById("faceted_bar_chart").replaceChild(chart, document.getElementById("faceted_bar_chart").childNodes[0]);
                }
            });
    }

    var width = 200;
    var height = 200;
    var thickness = 50;

    var radius = Math.min(width, height) /2;
    var color = d3.scaleOrdinal(d3.schemeAccent);

    var svg = d3.select("#region_chart")
        .attr('class', 'pie')
        .attr("viewBox", [0, 0, width, height])
        .append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

    var regions = [...new Set(donut_data.map(d => d.region))].sort()

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.migrant_count; })

    update_donut(d3.select("#year").property('value'))

    function update_donut(input) {
        var new_data = donut_data.filter(f => f.year == input)

        var region_total = d3.sum(new_data, d=> d.migrant_count);
        new_data.forEach(function(d) {
            d.percentage = parseFloat(d.migrant_count  / region_total).toFixed(2) * 100;
        });
        
        var high_p = new_data.filter(f => f.region == 'High-income countries')[0]['percentage']
        var middle_p = new_data.filter(f => f.region == 'Middle-income countries')[0]['percentage']
        var low_p = new_data.filter(f => f.region == 'Low-income countries')[0]['percentage']

        document.getElementById("Hregion_span").innerHTML = high_p.toString()+"%"
        document.getElementById("Mregion_span").innerHTML = middle_p.toString()+"%"
        document.getElementById("Lregion_span").innerHTML = low_p.toString()+"%"

        var path = svg.selectAll("path")
            .data(pie(new_data))

        path
            .exit()
            .remove()

        path
            .enter()
            .append('path')
            .merge(path)
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .attr("stroke", "white")
            .style("stroke-width", "1px")
    }

    var gender_svg = d3.select("#gender_chart")
        .attr('class', 'pie')
        .attr("viewBox", [0, 0, width, height])
        .append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

    var gender = [...new Set(gender_data.map(d => d.gender))].sort()

    var gender_color = d3.scaleOrdinal(d3.schemeCategory10);

    update_gender(d3.select("#year").property('value'))

    function update_gender(input) {
        var pie_data = gender_data.filter(f => f.year == input)

        var gender_total = d3.sum(pie_data, d=> d.migrant_count);
        pie_data.forEach(function(d) {
            d.percentage = parseFloat(d.migrant_count  / gender_total).toFixed(2) * 100;
        });
        // console.log(pie_data)

        var m_p = pie_data.filter(f => f.gender == 'male')[0]['percentage']
        var f_p = pie_data.filter(f => f.gender == 'female')[0]['percentage']

        // console.log(m_p, f_p)
        document.getElementById("male_span").innerHTML = m_p.toString()+"%"
        document.getElementById("female_span").innerHTML = f_p.toString()+"%"

        var new_path = gender_svg.selectAll("path")
            .data(pie(pie_data))

        new_path
            .exit()
            .remove()

        new_path
            .enter()
            .append('path')
            .merge(new_path)
            .attr('d', arc)
            .attr('fill', (d, i) => gender_color(i))
            .attr("stroke", "white")
            .style("stroke-width", "1px")
    }


    d3.select("#year")
        .on("input", function () {
            document.getElementById("year_span").innerHTML = "Year" + " " + d3.select("#year").property('value')
            //console.log("Demographic ",this.value)
            update_stacked_bar(this.value)
            update_donut(this.value)
            update_gender(this.value)
        })

});