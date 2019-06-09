const color_array =
	["", "#800000", "#e6194B", "#fabebe", "#9A6324", "#f58231", "#ffd8b1", "#808000", "#ffe119", "#bfef45", "#3cb44b",
		"#aaffc3", "#469990", "#42d4f4", "#000075", "#4363d8", "#911eb4", "#e6beff", "#f032e6", "#000000", "#a9a9a9"];
const width = 750;
const height = 750;
const rad = 2 * Math.PI;

d3.json("data-point.json", function (d) {
	start(d);
});

function start(d) {

	var axes_values = (d[0].map(function (v) {
		return v;
	}));

	var svg_global = d3.select("div")
		.append("svg")
		.attr("width", width * 2)
		.attr("height", height);

	var global_g = svg_global.append("g")
		.attr("transform", "translate(" + (width / 2) + "," + 50 + ")");

	var marker_arrow = global_g.append("defs")
		.append("marker")
		.attr("id", "arrow")
		.attr("viewbox", "0 0 100 100")
		.attr("refX", 5)
		.attr("refY", 5)
		.attr("markerWidth", 11)
		.attr("markerHeight", 11)
		.attr("orient", "auto-start-reverse")
		.append("path")
		.attr("d", "M 0 0 L 10 5 L 0 10 z");

	var axes_g = global_g.append("g")
		.attr("class", "axes")
		.selectAll(".axes")
		.data(axes_values)
		.enter()
		.append("line")
		.attr("x1", width / 2)
		.attr("y1", height / 2)
		.attr("x2", function (d, i) {
			return (((1 - Math.sin((i / 5) * rad)) / 2) * width);
		})
		.attr("y2", function (d, i) {
			return (((1 - Math.cos((i / 5) * rad)) / 2) * height);
		})
		.style("stroke", "#000000")
		.style("stroke-width", "2px")
		.attr("class", "line")
		.attr("marker-end", "url(#arrow)");


	var graph_g = global_g.append("g")
		.attr("class", "graph");

	var i = 1;
	d.forEach(function (d) {
		var json_values = [];
		global_g.selectAll(".lines")
			.data(d, function (x, i) {
				json_values.push([
					(((1 - (parseFloat(x.value / 77) * Math.sin(i * rad / 5))) / 2) * width),
					(((1 - (parseFloat(x.value / 77) * Math.cos(i * rad / 5))) / 2) * height)
				]);
			});

		var last_x2 = width / 2;
		var last_y2 = height / 2;
		var currentLineGroup = graph_g.append("g")
			.attr("class", "line-" + i);

		json_values.forEach(function (d) {
			currentLineGroup.append("line")
				.attr("x1", last_x2)
				.attr("y1", last_y2)
				.attr("x2", d[0] - ((width / 2) - last_x2))
				.attr("y2", d[1] - ((height / 2) - last_y2))
				.attr("class", "line-" + i)
				.style("stroke-width", 5)
				.style("stroke", color_array[i]);
			last_x2 = d[0] - ((width / 2) - last_x2);
			last_y2 = d[1] - ((height / 2) - last_y2);
		});

		var circles = currentLineGroup.append("circle")
			.attr("cx", last_x2)
			.attr("cy", last_y2)
			.attr("r", 8)
			.attr("fill", color_array[i])
			.on("click", function () {
				global_g.select(".graph")
					.selectAll("g")
					.selectAll("line")
					.transition()
					.duration(1000)
					.style("stroke-width", 1);
				currentLineGroup.selectAll("line")
					.transition()
					.duration(1000)
					.style("stroke-width", 8);

			});

		i++;
	});
	i = 1;
};
