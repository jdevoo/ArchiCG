tools=tools.concat(["GraphAsMatrix"]);
var toolbarGraphAsMatrix;
var globalLinesOrder="Name";
var globalColumnsOrder="Name";
var globalMatrixKind="BOR";
var globalValuesForCellColor="Number of relations"
var myGraphForMatrix;
var sizeSource;
var sizeTarget;
var matrix = [];
var nodes;
var n;
var sourceNodes;
var ns;
var targetNodes ;
var nt ;
var xMatrix, cMatrix, zMatrix, yMatrix;
var margin;
var svg;
var width;
var height;
var Tooltip2;
var includeNotRelatedLines=false;
var includeNotRelatedColumns=false;

var listMatrixKinds=["BOR"];
var matrixKinds="";
listMatrixKinds.forEach((kind) => {matrixKinds += '<option value="'+kind+'" />';})

var listLinesOrders=["Name", "Count"];
var linesOrders="";
listLinesOrders.forEach((order) => {linesOrders += '<option value="'+order+'" />';})

var listColumnsOrders=["Name","Count"];
var columnsOrders="Name";
listColumnsOrders.forEach((order) => {columnsOrders += '<option value="'+order+'" />';})

var listValuesForCellsColor=["Relations Number"];
var valuesForCellsColor="";
listValuesForCellsColor.forEach((value) => {valuesForCellsColor += '<option value="'+value+'" />';})


var toolbarGraphAsMatrixDefinition={
    name: 'GraphAsMatrixDefinition',
    style   : 'background-color: white',
    items: [
        { type: 'html',  id: 'matrixKind',  html: `<div style=" height: 20px;display: flex;
        align-items: center;">Matrix Kind: 
        <input id="globalMatrixKind" list="matrixKinds" value="BOR" style="color:blue;"size="20" >
        <datalist id="matrixKinds">${matrixKinds}</datalist>
        </div>` },
        { type: 'new-line' },
          {type: 'html',  id: 'lines-order',  html: `<div style=" height: 20px;display: flex;
          align-items: center;">Lines order: 
          <input id="globalLinesOrder" list="linesOrders" onchange='globalLinesOrder=this.value;'  style="color:blue;"size="20" >
          <datalist id="linesOrders">${linesOrders}</datalist>
          </div>` },
        { type: 'new-line' },  
          { type: 'check',  id: 'includeNotRelatedLines', text: 'Include leaves', checked: false}, 
        { type: 'new-line' },
          {type: 'html',  id: 'columns-order',  html: `<div style=" height: 20px;display: flex;
          align-items: center;">Columns order: 
          <input id="globalColumnsOrder" list="columnsOrders" onchange='globalColumnsOrder=this.value;' style="color:blue;"size="20" >
          <datalist id="columnsOrders">${columnsOrders}</datalist>
          </div>` },
          { type: 'new-line' },
          { type: 'check',  id: 'includeNotRelatedColumns', text: 'Include roots', checked: false},
          { type: 'new-line' },
          {type: 'html',  id: 'values-for-cells-color',  html: `<div style=" height: 20px;display: flex;
          align-items: center;">Cells color values: 
          <input id="globalValuesForCellColor" list="listValuesForCellsColor" value="Relations Number" style="color:blue;"size="20" >
          <datalist id="listValuesForCellsColor">${valuesForCellsColor}</datalist>
          </div>` }, 
          { type: 'new-line' },
          { type: 'button',  id: 'update',  text: 'Apply' },
          { type: 'button',  id: 'switch',  text: 'Switch' },
         // { type: 'new-line' },
         // { type: 'button',  id: 'saveSVG',  text: 'Save as SVG' },
    ]  ,
    onClick: function(event) {
      if (event.target=="includeNotRelatedLines"){
        includeNotRelatedLines = w2ui['GraphAsMatrixDefinition'].get(event.target).checked;
      }
      if (event.target=="includeNotRelatedColumns"){
        includeNotRelatedColumns = w2ui['GraphAsMatrixDefinition'].get(event.target).checked;
      }
      if (event.target=="switch"){
        if (document.getElementById("matrix").style.display == "block"){
          document.getElementById("matrix").style.display = "none";
          document.getElementById("cy").style.display = "block";
        }else{
          document.getElementById("matrix").style.display = "block";
          document.getElementById("cy").style.display = "none";
        };
      }
      
      if (event.target=="update"){
          myGraphForMatrix={nodes:[], links:[]};
          sizeSource=0
          sizeTarget=0
          let nodes=cy.nodes(':visible');
          let edges=cy.edges(':visible');
          let sources= edges.sources();   let targets= edges.targets()

   //       var rows2= nodes.diff(nodes.leaves()) ; var columns2= nodes.diff(nodes.roots())
          let leaves=nodes.leaves()
          let roots=nodes.roots()
          
          
          let diff1=nodes.diff(nodes.leaves())
          let diff2=nodes.diff(nodes.roots())
          let rows=sources;
          let columns=targets;
          
          if (includeNotRelatedColumns){columns=sources.union(leaves)}
          if (includeNotRelatedLines){rows=targets.union(roots)}
          
         
          
          let numLines=rows.length;
          let numColumns=columns.length;
          sizeSource=calculateMaxLengthFromLabel (rows);
          sizeTarget=calculateMaxLengthFromLabel (columns);
          myGraphForMatrix={nodes:[], links:[], sourceNodes:[], targetNodes:[]};
          nodes.forEach(function(node, i) {
            let matrixNode={};
            matrixNode["id"]=node.id();
            matrixNode["name"]=node.data("label");
            matrixNode["group"]=node.data("type");
            matrixNode["count"]=0;
            matrixNode["index"]=i;  
            myGraphForMatrix.nodes.push(matrixNode);
          })

          rows.forEach(function(node, i) {
            let matrixNode={};
            matrixNode["id"]=node.id();
            matrixNode["name"]=node.data("label");
            matrixNode["group"]=node.data("type");
            matrixNode["count"]=0;
            matrixNode["index"]=i;  
            myGraphForMatrix.sourceNodes.push(matrixNode);
          })

          columns.forEach(function(node, i) {
            let matrixNode={};
            matrixNode["id"]=node.id();
            matrixNode["name"]=node.data("label");
            matrixNode["count"]=0;
            matrixNode["group"]=node.data("type");
            matrixNode["index"]=i;  
            myGraphForMatrix.targetNodes.push(matrixNode);
          })

          edges.forEach(function(edge, i) {
            let matrixLink={};
            let sourceNode = myGraphForMatrix.sourceNodes.filter(obj => {
              return obj.id === edge.source().id()
            })
            let targetNode = myGraphForMatrix.targetNodes.filter(obj => {
              return obj.id === edge.target().id()
            })

            matrixLink["source"]=sourceNode[0].index;
            matrixLink["target"]=targetNode[0].index;
            matrixLink["value"]=1;
            matrixLink["edgeId"]=edge.id();
            matrixLink["sourceId"]=edge.source().id();
            matrixLink["targetId"]=edge.target().id();
            myGraphForMatrix.links.push(matrixLink);
           });

          document.getElementById("cy").style.display = "none";
          document.getElementById("matrix").style.display = "block";
          myMatrix(myGraphForMatrix);
        }
  }
}
config.toolbarGraphAsMatrixDefinition=toolbarGraphAsMatrixDefinition;

function myMatrix(graph) {
  matrix = [];
  nodes = graph.nodes;
  n = nodes.length;
  sourceNodes = graph.sourceNodes;
  ns = sourceNodes.length;
  targetNodes = graph.targetNodes;
  nt = targetNodes.length;
  let nombreSource=ns;
  let nombreTarget=nt;
  if(includeNotRelatedLines){nombreSource=n};
  if (includeNotRelatedColumns){nombreTarget=n};

  margin = {top: sizeTarget+100, right: 0, bottom: 0, left: sizeSource+100},
    width = nombreTarget*20,
    height = nombreSource*20,
    svg;

  xMatrix = d3.scaleBand().range([0, height]),
    yMatrix=d3.scaleBand().range([0, width]),
    zMatrix = d3.scaleLinear().domain([0, 8]).clamp(true),
    cMatrix = d3.scaleOrdinal(d3.schemeCategory10); 


  d3.select("#matrix").selectAll('*').remove();
    
  svg = d3.select("#matrix").append("svg")
    .attr("width", width + 2*margin.left + margin.right+100)
    .attr("height", height + margin.top + margin.bottom+10)
    .attr("id","mySVGMatrix");
   // .style("margin-left", margin.left + "px")
  svg_group=svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
  // Compute index per node.
  sourceNodes.forEach(function(node, i) {
    node.index = i;
    //console.log (node)
    //node.count = 0;
    matrix[i] = d3.range(nombreTarget).map(function(j) { return {x: j, y: i, z: 0,links:[]}; });
  });
 

  // Convert links to matrix; count character occurrences.
  graph.links.forEach(function(link) {
    if (link.source==link.target){// loop with node source and target of the relation
      matrix[link.source][link.source].z += link.value;
      nodes[link.source].count += link.value;
    }else{
      matrix[link.source][link.target].z += link.value;
      matrix[link.source][link.target].links.push(link["edgeId"]) ;
      nodes[link.target].count += link.value;
      nodes[link.source].count += link.value;
    }

  });
  // Precompute the orders.


  let predefinedOrders = {
    name: d3.range(n).sort(function(a, b) {return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[b].count , nodes[a].count); }),
 //   Group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; }),
    sourceName: d3.range(nombreSource).sort(function(a, b) { return d3.ascending(sourceNodes[a].name, sourceNodes[b].name); }),
    sourceCount: d3.range(nombreSource).sort(function(a, b) { return d3.ascending(sourceNodes[b].count , sourceNodes[a].count); }),
 //   sourceGroup: d3.range(ns).sort(function(a, b) { return sourceNodes[b].group - sourceNodes[a].group; }),
    targetName: d3.range(nombreTarget).sort(function(a, b) { return d3.ascending(targetNodes[a].name, targetNodes[b].name); }),   
    targetCount: d3.range(nombreTarget).sort(function(a, b) { return d3.ascending(targetNodes[b].count , targetNodes[a].count); }),
 //   targetGroup: d3.range(ns).sort(function(a, b) { return targetNodes[b].group - targetNodes[a].group; })
  };

  // The default sort order.
  let myLinesOrder;
  let myColumnsOrder;
  //if(includeNotRelatedLines){myLinesOrder=globalLinesOrder.toLowerCase();}else{
    myLinesOrder="source"+globalLinesOrder;
  //}
  //if(includeNotRelatedColumns) {myColumnsOrder=globalColumnsOrder.toLowerCase();} else {
    myColumnsOrder="target"+globalColumnsOrder;
  //}
  xMatrix.domain(predefinedOrders[myLinesOrder]);
  yMatrix.domain(predefinedOrders[myColumnsOrder]);

  svg_group.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
//console.log (matrix)

  var row = svg_group.selectAll(".row")
    .data(matrix)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) { 
   //   console.log(d)
      //console.log (`i:${i} and xMatrix(${i})=${xMatrix(i)}`)
      return "translate(0," + xMatrix(i)+ ")"; })
    .each(row);

  row.append("line").attr("x2", width).style("pointer-events", "none");

  row.append("text")
      .attr("x", -6)
      .attr("y", xMatrix.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .attr("id", function(d, i) { return cy.$id(sourceNodes[i].id).id(); })
     // .attr("label", function(d, i) { return cy.$id(sourceNodes[i].id).data("label"); })
      .text(function(d, i) { return cy.$id(sourceNodes[i].id).data("label"); })
      .on("mouseover", function(e,h) {mouseoverSource(e,h)})
      .on("mouseout", mouseoutSource)
      .on("mousemove", function(e,h) {mousemoveSource(e,h)})
      .on("click", function(e,h) {clickSource(e,h)});


  let column = svg_group.selectAll(".column")
    .data(matrix[0])
    .enter().append("g")
    .attr("class", "column")
    .attr("transform", function(d, i) { return "translate(" + yMatrix(i) + ")rotate(-90)"; });

  column.append("line").attr("x1", -width).style("pointer-events", "none");

  column.append("text")
      .attr("x", 6)
      .attr("y", yMatrix.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .attr("id", function(d, i) { return cy.$id(targetNodes[i].id).id(); })
      .text(function(d, i) { return  cy.$id(targetNodes[i].id).data("label"); })
      .on("mouseover", function(e,h) {mouseoverTarget(e,h)})
      .on("mouseout", mouseoutTarget)
      .on("mousemove", function(e,h) {mousemoveTarget(e,h)})
      .on("click", function(e,h) {clickTarget(e,h)});


      // create a tooltip
 Tooltip2= svg_group.append("text")
  .attr("class", "tooltip")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dy", ".32em")
  .attr("text-anchor", "start")
  .style("visibility", "hidden")
  // Without this the tooltip text follows the cursor and lands under it,
  // stealing the hover from the cell -> mouseout/mouseover flicker on every
  // pixel move. Letting pointer events pass through keeps the cell hovered.
  .style("pointer-events", "none")
  .text("");

  function row(row) {
    let cell = d3.select(this).selectAll(".cell")
      .data(row.filter(function(d) {
        //console.log(d)
        return d.z; }))
      .enter().append("rect")
      .attr("class", "cell")
    //  .attr("x", function(d) { return yMatrix(d.x); })
      .attr("width", yMatrix.bandwidth())
      .attr("height", xMatrix.bandwidth())
    //  .attr("number", "10")
      .style("fill-opacity", function(d) { return zMatrix(d.z); })
      .style("fill", function(d) { 
      return  cMatrix(zMatrix(d.z)) ;
})
      .on("mouseover", function(e,h) {mouseoverCell(e,h)})
      .on("mouseout", mouseoutCell)
      .on("mousemove", function(e,h) {mousemoveCell(e,h)})
      .on("click", function(e,h) {clickCell(e,h)})
  }

  let display=svg.append("g")
  .attr("class", "cell-content-diplay")
  .attr("x",10)
  .attr("y",10);

  display.append("foreignObject")
  .attr("x",10)
  .attr("y",10)
  .attr("width", sizeSource+100)
  .attr("height", sizeTarget+100)
  .attr("stroke", 2)
  .attr("fill", "blue")
.append("xhtml:div")
  .style("font", "14px 'Helvetica Neue'")
  .html(`<h1><b>Binary Oriented Relations matrix</b></h1>
  <b>Lines</b>: Model elements being relationship sources <br>
  <b>Column</b>:Model elements being relationship targets <br>
  <b>Considered relationships</b>: all types (let's filter though the palette)<br>
  <b>Values for cell colors</b>: ${globalValuesForCellColor} <br><br>
  No roots and no leaves displayed
   `);

  function clickSource(e,h) { w2alert(`The source node you clicked has identifier ${e.target.id}`)}
  function mouseoverSource(e,h) {
     // h is this row's cell array (the .row group's datum). Redden the hovered
     // row label plus every column label where this row actually has a value.
     d3.select(e.currentTarget).classed("active", true);
     let cols = new Set(h.filter(function(c) { return c.z; }).map(function(c) { return c.x; }));
     d3.selectAll(".column text").classed("active", function(d, i) { return cols.has(i); });}
  function mousemoveSource(e,h) {}
  function mouseoutSource() {d3.selectAll("text").classed("active", false);}

  function clickTarget(e,h) { w2alert(`The target node you clicked has identifier ${e.target.id}`)}
  function mouseoverTarget(e,h) {
     // h is a single cell whose x is this column's index. Redden the hovered
     // column label plus every row label that has a value in this column.
     d3.select(e.currentTarget).classed("active", true);
     let col = h.x;
     d3.selectAll(".row text").classed("active", function(d, i) {
       return matrix[i] && matrix[i][col] && matrix[i][col].z > 0; });}
  function mousemoveTarget(e,h) {}
  function mouseoutTarget() {d3.selectAll("text").classed("active", false);}

  function clickCell(e,h) {
  // not that useful; needs a valuable usage
  w2alert(`The cell you clicked on contains ${h.z} relations: (${h.links.toString()})`)
  
  }

  function mouseoverCell(e,h) {
    d3.selectAll(".row text").classed("active", function(d, i) {return i == h.y; });
    d3.selectAll(".column text").classed("active", function(d, i) { return i == h.x; });
    Tooltip2.style("visibility", "visible");
  }

  function mousemoveCell(e,h) {


    let mySvg = document.querySelector("svg");
    let pt = mySvg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    pt = pt.matrixTransform(mySvg.getScreenCTM().inverse());
    pt.x = pt.x-sizeSource-100;
    pt.y = pt.y-sizeTarget-100;

//Some difficulties at the beginning to make working properlty - if moving the whole application up, the calculated position doesn't correspond anymore to the coordinates in the web browser
// Was it due not mastering how how to translate coordinates from DOM to SVG and the reverse?
//cf. https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
// Or shoud it be considered another way: just by calculating the tooltip position from the mouse position
// cf. https://stackoverflow.com/questions/15702867/html-tooltip-position-relative-to-mouse-pointer
// In fact, it appeared that the used mouseover function is a jquery one, 
//   with as first parameter the event and second parameter an handler. So what was to be used was
//   e.ClientX and e.ClientY - and not PageX and PageY - initially used
// With this change, the matrixTranfrom usage is still needed


    let myTextX=pt.x;
    let myTextY=pt.y;
    Tooltip2.text(`${globalValuesForCellColor}:${h.z}`).attr("x", myTextX).attr("y", myTextY)
  }  

  function mouseoutCell() {
    d3.selectAll("text").classed("active", false);
    Tooltip2.style("visibility", "hidden")
  }

  // Applies the current line/column ordering (driven by the toolbar's
  // globalLinesOrder/globalColumnsOrder) and animates rows/columns/cells into
  // place. Called once after render to position the cells (created without x).
  function order() {
    let myLinesOrder="source"+globalLinesOrder;
    let myColumnsOrder="target"+globalColumnsOrder;
    xMatrix.domain(predefinedOrders[myLinesOrder]);
    yMatrix.domain(predefinedOrders[myColumnsOrder]);

    let t = svg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return yMatrix(i) * 4; })
        .attr("transform", function(d, i) {return "translate(0," + xMatrix(i)+ ")"; })
      .selectAll(".cell")
        .delay(function(d) { return yMatrix(d.x) * 4; })
        .attr("x", function(d) { return yMatrix(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return xMatrix(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + yMatrix(i) + ")rotate(-90)";  });
  }

  setTimeout(function() {
    order();
  }, 500);
};

function calculateMaxLengthFromLabel (nodes){
  let testwidth = 960
  let testheight = 960
  let maxLength=0

  let testsvg = d3.select('body').append('svg')
  .attr('width', testwidth)
  .attr('height', testheight)
  
  nodes.forEach(function(node, i) {  
     let testtext = testsvg.append('text')
     .text(node.data('label')+" "+i)
     .attr('x', 0)
     .attr('y', (i+1)*35)
     .attr('dy','0.32em') 
     bbox = testtext["_groups"][0][0].getBBox() 
     let thisLabelLength=bbox.width
     maxLength= (thisLabelLength>maxLength) ? thisLabelLength : maxLength
     testtext.remove();
    });

  testsvg.remove();
  return maxLength
  }

  // True when the matrix view (not the cytoscape graph) is the one on screen.
  // The main viewer's PNG/SVG export checks this to decide what to export.
  function isMatrixViewVisible(){
    if (!document.getElementById("mySVGMatrix")) return false;
    let m = document.getElementById("matrix");
    // Use the computed style, not the literal inline string, so this holds
    // regardless of how the matrix view was shown (inline style, class, etc.).
    return !!m && window.getComputedStyle(m).display !== "none";
  }

  // Clone #mySVGMatrix and inline the styles that come from the external
  // stylesheet, so the exported file renders standalone (the .css is not
  // present outside the app). The descriptive header foreignObject is dropped
  // so SVG and PNG match and the PNG rasterises reliably (HTML foreignObject
  // does not draw onto a canvas in all browsers).
  function buildExportableMatrixSvg(){
    let original = document.getElementById("mySVGMatrix");
    if (!original) return null;
    let clone = original.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    clone.querySelectorAll(".background").forEach(function(el){ el.style.fill = "#eee"; });
    clone.querySelectorAll("line").forEach(function(el){ el.style.stroke = "#fff"; });
    clone.querySelectorAll("text").forEach(function(el){
      if (!el.style.fontFamily) { el.style.fontFamily = "helvetica neue, helvetica, arial, sans-serif"; }
      if (!el.style.fontSize) { el.style.fontSize = "14px"; }
    });
    clone.querySelectorAll("foreignObject").forEach(function(el){ el.remove(); });
    return clone;
  }

  function exportMatrixAsSVG(fileName){
    let clone = buildExportableMatrixSvg();
    if (!clone) return false;
    let source = '<?xml version="1.0" standalone="no"?>\r\n' + new XMLSerializer().serializeToString(clone);
    saveAs(new Blob([source], {type: "image/svg+xml;charset=utf-8"}), fileName);
    return true;
  }

  function exportMatrixAsPNG(fileName){
    let clone = buildExportableMatrixSvg();
    if (!clone) return false;
    let width = parseFloat(clone.getAttribute("width"));
    let height = parseFloat(clone.getAttribute("height"));
    let source = new XMLSerializer().serializeToString(clone);
    let url = URL.createObjectURL(new Blob([source], {type: "image/svg+xml;charset=utf-8"}));
    let img = new Image();
    img.onload = function(){
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(function(blob){ saveAs(blob, fileName); });
    };
    img.onerror = function(){ URL.revokeObjectURL(url); };
    img.src = url;
    return true;
  }





