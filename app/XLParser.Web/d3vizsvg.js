﻿var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width = 500 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

var i;
var tree;
var root;

var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.x, d.y]; });

var vis;

function newTree(formula) {

    d3.json("Parse.json?formula=" + encodeURI(formula), function (json) {
        var tw = treeWidth(json);
        var th = treeHeight(json);
        console.log("W: " + tw + " H: " + th);
        console.log(json);
        var w = Math.max(tw*75, width);
        var h = Math.max(10+th*60, height);

        tree = d3.layout.tree().size([w, h]);
        i = 0;

        if (vis != undefined) {
            vis.remove();
        }

        vis = d3.select("#d3viz")
        .append("svg")
        .attr("width", w + margin.right + margin.left)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root = json;
        update(root);
    });
}

//newTree("1+1");
//newTree("SUM(1-1-1-1,2)");
newTree("BLAH(1-1-1-1,2)");


function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();
    var links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = 10 + d.depth * 60;
    });

    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        //.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    //.on("click", function(d) { toggle(d); update(d); });

    nodeEnter.append("circle")
        //.attr("r", 1e-6)
        .attr("r", 8)
        //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .style("fill", "#fff");

    nodeEnter.append("text")
        //.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("y", function (d) { return d.children || d._children ? -18 : 18; })
        .attr("dy", ".35em")
        //.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        //.attr("text-anchor", function (d) { return d.children || d._children ? "middle" : "bottom"; })
        .attr("text-anchor", "middle")
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1);

    nodeEnter.append("text")
          .attr("y", function (d) {
              return d.children || d._children ? -18 : 18;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function (d) { return d.name; })
          .style("fill-opacity", 1);

    // Declare the links…
    var link = vis.selectAll("path.link")
        .data(links, function (d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);
    // Transition nodes to their new position.
}

function treeWidth(node) {
    if (node.children == undefined) return 1;
    var sum = 0;
    for (var i = 0; i < node.children.length; i++) {
        sum += treeWidth(node.children[i]);
    }
    return sum;
}

function treeHeight(node) {
    if (node.children == undefined) return 1;
    var max = 0;
    for (var i = 0; i < node.children.length; i++) {
        max = Math.max(max, treeHeight(node.children[i]));
    }
    return max + 1;
}