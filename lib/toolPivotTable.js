tools=tools.concat(["PivotTable"]);

// Helper: shows the pivot panel at the bottom of the center area and shrinks
// the graph to make room (or, when called to hide, restores the graph).
function showPivotPanel(show) {
  var pt = document.getElementById("pivottable");
  var graph = document.getElementById("cy");
  if (!pt || !graph) return;
  if (show) {
    pt.style.display = "block";
    pt.style.height = "25%";
    // #cy is float:right; width:100%, which would squeeze this sibling panel to
    // width 0 (the table then renders but is clipped to nothing). Give the panel
    // full width and clear the float so it stacks below the graph.
    pt.style.width = "100%";
    pt.style.clear = "both";
    graph.style.height = "75%";
  } else {
    pt.style.display = "none";
    graph.style.height = "100%";
  }
}

var toolbarPivotTableDefinition = {
  name: 'toolbarPivotTableDefinition',
  style: 'background-color: white',
  items: [
    { type: 'button', id: 'pivotBuild', text: 'Build from graph', style: " text-align: center;" },
    { type: 'spacer' },
    { type: 'button', id: 'switch', text: 'Show / Hide', style: " text-align: center;" },
  ],
  onClick: function (event) {
    if (event.target == "pivotBuild") {
      // Build the pivot from the current graph's edges: one row per relation,
      // pivoted as source (rows) x target (cols) with the default Count
      // aggregator. The relation type is included too so the table can be
      // re-pivoted by hand later if desired.
      var data = cy.edges().map(function (e) {
        return {
          source: e.source().data('label') || e.source().id(),
          target: e.target().data('label') || e.target().id(),
          type: e.data('edgeType') || ''
        };
      });
      $("#pivottable").pivot(data, { rows: ["source"], cols: ["target"] });
      // Auto-show so the result is never a blank panel.
      showPivotPanel(true);
    }
    if (event.target == "switch") {
      var pt = document.getElementById("pivottable");
      showPivotPanel(!(pt && pt.style.display == "block"));
    }
  }
}
config.toolbarPivotTableDefinition = toolbarPivotTableDefinition;
