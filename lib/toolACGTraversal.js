//ArchiMate Compound Graph Selector version 0.1 2022-06-26
// Advanced filtering tool based on finding neightbours or shortest path

tools=tools.concat(["ACGTraversal"]);
var depths=["1","2","3","4","5","6","7","8","9"];
var depthsList="";
var theDepth;
var ACGTraversalDirected=false;
var ACGTraversalFull=true;
var ACGIncoming=true;
var ACGOutgoing=true;
depths.forEach((depth) => {depthsList += '<option value="'+depth+'" />';})

var toolbarACGTraversalDefinition={
    name: 'ACGTraversalDefinition',
    style   : 'background-color: white',
    items: [
        
        { type: 'button',  id: 'about',  text: 'About', style:" text-align: center;" },
        { type: 'new-line' },		  
        { type: 'check',  id: 'onvisible', text: 'On visible', checked: false },
        { type: 'check',  id: 'onfull',   text: 'On full',  checked: true},
        { type: 'new-line' },
        { type: 'check',  id: 'incoming', text: 'Incoming Edges', checked: true },
        { type: 'check',  id: 'outgoing', text: 'Outgoing Edges', checked: true},
        { type: 'new-line' },
        { type: 'html',  id: 'depth',  html: `<div style=" height: 20px;display: flex;
        align-items: center;">Depth: 
        <input id="theDepth"  list="depths" style="color:blue;"  size="8" >
        <datalist id="depths">${depthsList}</datalist>
        </div>` },
        { type: 'spacer' },
        { type: 'button',  id: 'neighborhood',  text: 'Selected neighborhood>>', style:" text-align: center;" },
        { type: 'new-line' },
         { type: 'button',  id: 'connectednodes',  text: 'Connected Nodes>>', style:" text-align: center;" },
        { type: 'button',  id: 'connectededges',  text: 'Connected Edges>>', style:" text-align: center;" },
        { type: 'new-line' },
        { type: 'button',  id: 'roots',  text: 'Roots>>', style:" text-align: center;" },
        { type: 'button',  id: 'outgoers',  text: 'Outgoers>>', style:" text-align: center;" }, 
        { type: 'button',  id: 'successors',  text: 'Successors>>', style:" text-align: center;" }, 
        { type: 'new-line' },
        { type: 'button',  id: 'leaves',  text: 'Leaves>>', style:" text-align: center;" },
        { type: 'button',  id: 'incomers',  text: 'Incomers>>', style:" text-align: center;" }, 
        { type: 'button',  id: 'predecessors',  text: 'Predecessors>>', style:" text-align: center;" }, 
        { type: 'new-line' },{ type: 'new-line' },{ type: 'new-line' },
        { type: 'button',  id: 'select-source',  text: 'Make selection the source' },
        { type: 'new-line' }, 
        { type: 'html',  id: 'pathsource',  html: `<div style=" height: 30px;display: flex;
          align-items: center;">Id:<input id="pathsource"  style="color:blue;"  size="30" ></div>` },
          { type: 'new-line' },
        { type: 'button',  id: 'select-target',  text: 'Make selection the target' },
        { type: 'new-line' }, 
        { type: 'html',  id: 'pathtarget',  html: `<div style=" height: 30px;display: flex;
        align-items: center;">Id:<input id="pathtarget"  style="color:blue;"  size="30" ></div>` },
        { type: 'new-line' },
        { type: 'check',  id: 'directed', text: 'Directed', checked: false, tooltip: 'Parameter for neighborhood and shortest path' },
        { type: 'spacer' },
        { type: 'button',  id: 'shortpath',  text: 'Find Shortest Path >>' }        
    ]  ,
    onClick: function(event) {

        if (event.target=="connectednodes"){
          var mySelection=cy.elements(':selected');
          let mySelectionConnectedNodes=mySelection.connectedNodes();
          mySelectionConnectedNodes.select();
        }
        if (event.target=="connectededges"){
          var mySelection=cy.elements(':selected');
          let mySelectionConnectedEdges=mySelection.connectedEdges();
          mySelectionConnectedEdges.select();
        }
        if (event.target=="roots"){
          var mySelection=cy.elements(':selected');
          mySelection.unselect();
          mySelection.roots().select()
        }
        if (event.target=="leaves"){
          var mySelection=cy.elements(':selected');
          mySelection.unselect()
          mySelection.leaves().select()
        }
        if (event.target=="outgoers"){
          var mySelection=cy.elements(':selected');
          mySelection.outgoers().select()
        }
        if (event.target=="successors"){
          var mySelection=cy.elements(':selected');
          mySelection.successors().select()

        } 
        if (event.target=="incomers"){
          var mySelection=cy.elements(':selected');
          mySelection.incomers().select()
        }
        if (event.target=="predecessors"){
          var mySelection=cy.elements(':selected');
          mySelection.predecessors().select()
        }   
        if (event.target=="neighborhood"){
            theDepth=document.getElementById('theDepth').value;
            if (!depths.includes(theDepth)){ w2alert('Depth should be an integer from 1 to 9'); return; }
            if (!ACGOutgoing && !ACGIncoming){ w2alert('Select at least one direction (Incoming and/or Outgoing edges).'); return; }
            var myFilter = ACGTraversalFull ? "" : ':visible';
            // Grow the selection one hop per depth step, following the chosen
            // direction(s): both -> full neighbourhood, outgoing only -> outgoers,
            // incoming only -> incomers. outgoers/incomers are one hop, so depth counts.
            for (var i = 0; i < parseInt(theDepth, 10); i++) {
                var frontier = cy.nodes(':selected');
                var next;
                if (ACGOutgoing && ACGIncoming){ next = (myFilter==="") ? frontier.neighbourhood() : frontier.neighbourhood(myFilter); }
                else if (ACGOutgoing){ next = (myFilter==="") ? frontier.outgoers() : frontier.outgoers(myFilter); }
                else { next = (myFilter==="") ? frontier.incomers() : frontier.incomers(myFilter); }
                next.select();
            }
          }

        // The two direction checkboxes are independent — each simply records
        // whether neighborhood expansion follows outgoing / incoming edges.
        if (event.target=="incoming"){
            ACGIncoming = w2ui['ACGTraversalDefinition'].get('incoming').checked;
          }
        if (event.target=="outgoing"){
            ACGOutgoing = w2ui['ACGTraversalDefinition'].get('outgoing').checked;
          }

        // "On visible" and "On full" are a mutually-exclusive pair driving
        // ACGTraversalFull (false -> traverse the :visible subgraph, true ->
        // the whole graph). Clicking either one selects it and clears the other.
        if (event.target=="onvisible"){
            w2ui['ACGTraversalDefinition'].check('onvisible');
            w2ui['ACGTraversalDefinition'].uncheck('onfull');
            ACGTraversalFull=false;
          }
        if (event.target=="onfull"){
            w2ui['ACGTraversalDefinition'].check('onfull');
            w2ui['ACGTraversalDefinition'].uncheck('onvisible');
            ACGTraversalFull=true;
          }

          if (event.target=="directed"){
            if (w2ui['ACGTraversalDefinition'].get(event.target).checked){ACGTraversalDirected=true;}
            else{ ACGTraversalDirected=false;}         
          }

      if (event.target=="about"){w2alert(`<pre style="white-space:pre-wrap;overflow-wrap:anywhere;margin:0;">
ArchiMate Compound Graph Selector version 0.1 2022-06-26
Author: Dr Nicolas Figay

This tool allows filtering the graph based on one node centric graph, with incoming and outcoming edges,
the depth of the graph and the filtering by nodes or edges types (using the palette - Shift+DblClick)

It is also possible to request the shortest path between two nodes, which is then selected on the graph.
Then, by hiding or removing what is unselected, the graph providing the resulting path is available.
</pre>`)};
      if (event.target=="select-source"){
        var selected=cy.elements(':selected');
        if (selected.length == 1){
          document.getElementById('pathsource').value=selected[0].id();
        }
        else{ w2alert("A single node must be selected")}
      }
      if (event.target=="select-target"){
        var selected=cy.elements(':selected');
        if (selected.length == 1){
          document.getElementById('pathtarget').value=selected[0].id();
        }
        else{ w2alert("A single node must be selected")}
      }
      if (event.target=="shortpath"){
        var myFilter="";
        if (!ACGTraversalFull){myFilter=':visible'}
        
        // Resolve source/target from the Id fields; if either is empty, fall
        // back to the current selection when exactly two nodes are selected
        // (so "select two nodes → Find Shortest Path" works directly).
        var srcId = document.getElementById('pathsource').value;
        var tgtId = document.getElementById('pathtarget').value;
        if (srcId === "" || tgtId === "") {
          var sel = cy.nodes(':selected');
          if (sel.length === 2) {
            srcId = sel[0].id(); tgtId = sel[1].id();
            document.getElementById('pathsource').value = srcId;
            document.getElementById('pathtarget').value = tgtId;
          }
        }
        var src = (srcId !== "") ? cy.getElementById(srcId) : cy.collection();
        var tgt = (tgtId !== "") ? cy.getElementById(tgtId) : cy.collection();
        if (src.empty() || tgt.empty()) {
          w2alert('Set a source and a target first: select a node and click "Make selection the source" / "the target", or select exactly two nodes before Find Shortest Path.');
          return;
        }
        let dijkstra = cy.elements(myFilter).dijkstra(src, function(){ return 1; }, ACGTraversalDirected);
        let pathTo = dijkstra.pathTo(tgt);
        let distToJ = dijkstra.distanceTo(tgt);
        if (!pathTo || pathTo.length === 0 || distToJ === Infinity) {
          w2alert('No path found between ' + srcId + ' and ' + tgtId
            + (ACGTraversalDirected ? ' (Directed is on — switch it off to allow undirected paths).' : '.'));
          return;
        }
        let thePath=[];
        pathTo.forEach(function(bfsElement){ thePath.push(bfsElement.id()); });
        pathTo.style('visibility', 'visible');
        pathTo.style('display', 'element');
        cy.elements().unselect();   // result selection = just the path
        pathTo.select();
        w2alert(`<pre style="white-space:pre-wrap;overflow-wrap:anywhere;margin:0;">
The found distance for the shortest path between the two nodes is ${distToJ}
Path: ${thePath}
</pre>`)
        
      }      
  }
}
config.toolbarACGTraversalDefinition=toolbarACGTraversalDefinition;