tools=tools.concat(["Fcose"]);

var toolbarFcoseDefinition={
    name: 'toolbarFcoseDefinition',
    style   : 'background-color: white',
    items: [
          { type: 'html',  id: 'quality',  html: `<div style=" height: 20px;display: flex;align-items: center;">Quality: <input id="fcose-quality" style="color:blue;" value="default" size="7" ></div>` },
          { type: 'html',  id: 'randomize',  html: `<div style=" height: 20px;display: flex;align-items: center;">Randomize: <input id="fcose-randomize" style="color:blue;" value=true size="5" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'animate',  html: `<div style=" height: 20px;display: flex;align-items: center;">Animate: <input id="fcose-animate" style="color:blue;" value=true size="5" ></div>` },         
          { type: 'html',  id: 'animateDuration',  html: `<div style=" height: 20px;display: flex;align-items: center;"> Animate Duration: <input id="fcose-animateDuration" style="color:blue;" value=1000 size="5" ></div>` },
          { type: 'new-line' }, 
          { type: 'html',  id: 'fit',  html: `<div style=" height: 20px;display: flex;align-items: center;">Fit: <input id="fcose-fit" style="color:blue;" value=true size="5" ></div>` },
          { type: 'html',  id: 'padding',  html: `<div style=" height: 20px;display: flex;align-items: center;"> Padding: <input id="fcose-padding" style="color:blue;" value=30 size="5" ></div>` },
          { type: 'new-line' }, 
          { type: 'html',  id: 'nodeDimensionsIncludeLabels',  html: `<div style=" height: 20px;display: flex;align-items: center;">Node dimensions include labels: <input id="fcose-nodeDimensionsIncludeLabels" style="color:blue;" value=true size="15" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'uniformNodeDimensions',  html: `<div style=" height: 20px;display: flex;align-items: center;">Uniform node dimensions: <input id="fcose-uniformNodeDimensions" style="color:blue;" value=false size="15" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'packComponents',  html: `<div style=" height: 20px;display: flex;align-items: center;">Pack components: <input id="fcose-packComponents" style="color:blue;" value=true size="5" ></div>` },
          { type: 'html',  id: 'step',  html: `<div style=" height: 20px;display: flex;align-items: center;">Step: <input id="fcose-step" style="color:blue;" value="all" size="10" ></div>` },
          { type: 'new-line' }, 
          { type: 'html',  id: 'samplingType',  html: `<div style=" height: 20px;display: flex;align-items: center;">Sampling type: <input id="fcose-samplingType" style="color:blue;" value=true size="5" ></div>` },
          { type: 'html',  id: 'samplingSize',  html: `<div style=" height: 20px;display: flex;align-items: center;"> Sampling size: <input id="fcose-samplingSize" style="color:blue;" value=15 size="5" ></div>` },
          { type: 'new-line' },                      
          { type: 'html',  id: 'nodeSeparation',  html: `<div style=" height: 20px;display: flex;align-items: center;">Node separation: <input id="fcose-nodeSeparation" style="color:blue;" value=75 size="5" ></div>` },         
          { type: 'html',  id: 'piTol',  html: `<div style=" height: 20px;display: flex;align-items: center;"> piTol: <input id="fcose-piTol" style="color:blue;" value=0.0000001 size="15" ></div>` },
          { type: 'new-line' },   
          { type: 'html',  id: 'nodeRepulsionNode',  html: `<div style=" height: 20px;display: flex;align-items: center;">Node repulsion: <input id="fcose-nodeRepulsionNode" style="color:blue;" value=4500 size="5" ></div>` }, 
          { type: 'html',  id: 'idealEdgeLengthEdge',  html: `<div style=" height: 20px;display: flex;align-items: center;"> Ideal Edge Length: <input id="fcose-idealEdgeLengthEdge" style="color:blue;" value=50 size="5" ></div>` },
          { type: 'new-line' }, 
          { type: 'html',  id: 'edgeElasticity',  html: `<div style=" height: 20px;display: flex;align-items: center;">Edge elasticity: <input id="fcose-edgeElasticity" style="color:blue;" value=0.45 size="5" ></div>` },
          { type: 'html',  id: 'nestingFactor',  html: `<div style=" height: 20px;display: flex;align-items: center;"> Nesting factor: <input id="fcose-nestingFactor" style="color:blue;" value=0.1 size="5" ></div>` },
          { type: 'new-line' }, 
          { type: 'html',  id: 'numIter',  html: `<div style=" height: 20px;display: flex;align-items: center;">Number of iterations: <input id="fcose-numIter" style="color:blue;" value=2500 size="6" ></div>` },
          { type: 'html',  id: 'tile',  html: `<div style=" height: 20px;display: flex;align-items: center;"> Tile: <input id="fcose-tile" style="color:blue;" value=true size="5" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'tilingPaddingVertical',  html: `<div style=" height: 20px;display: flex;align-items: center;">Tiling padding: vertical= <input id="fcose-tilingPaddingVertical" style="color:blue;" value=10 size="4" ></div>` },
          { type: 'html',  id: 'tilingPaddingHorizontal',  html: `<div style=" height: 20px;display: flex;align-items: center;"> horizontal= <input id="fcose-tilingPaddingHorizontal" style="color:blue;" value=10 size="4" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'gravity',  html: `<div style=" height: 20px;display: flex;align-items: center;">Gravity: force= <input id="fcose-gravity" style="color:blue;" value=0.25 size="6" ></div>` },
          { type: 'html',  id: 'gravityRange',  html: `<div style=" height: 20px;display: flex;align-items: center;"> range= <input id="fcose-gravityRange" style="color:blue;" value=3.8 size="6" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'gravityCompound',  html: `<div style=" height: 20px;display: flex;align-items: center;">Gravity for compounds: force= <input id="fcose-gravityCompound" style="color:blue;" value=1.0 size="4" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'gravityRangeCompound',  html: `<div style=" height: 20px;display: flex;align-items: center;"> range= <input id="fcose-gravityRangeCompound" style="color:blue;" value=1.5 size="4" ></div>` },
          { type: 'new-line' },
          { type: 'html',  id: 'initialEnergyOnIncremental',  html: `<div style=" height: 20px;display: flex;align-items: center;">Initial cooling factor for incremental layout: <input id="fcose-initialEnergyOnIncremental" style="color:blue;" value=0.3 size="15" ></div>` },
          { type: 'new-line' },
          { type: 'button',  id: 'restoreDefault',  text: 'Restore Default', style:" text-align: center;" },
          { type: 'button',  id: 'runFcose',  text: 'Run', style:" text-align: center;" },

        ]  ,
    onClick: function(event) {
      if (event.target=="restoreDefault"){
        restoreDefault();
      };
      // Run stages the current field values into cyLayout (this block runs
      // before the runFcose block below) and then applies them.
      if (event.target=="runFcose"){
        cyLayout["quality"]=document.getElementById('fcose-quality').value;
        cyLayout["randomize"]=(document.getElementById('fcose-randomize').value === 'true');
        cyLayout["animate"]=(document.getElementById('fcose-animate').value === 'true');
        cyLayout["animationDuration"]=document.getElementById('fcose-animateDuration').value * 1;
        cyLayout["fit"]= (document.getElementById('fcose-fit').value === 'true' );
        cyLayout["padding"]=document.getElementById('fcose-padding').value * 1;
        cyLayout["nodeDimensionsIncludeLabels"]= (document.getElementById('fcose-nodeDimensionsIncludeLabels').value === 'true');
        cyLayout["uniformNodeDimensions"]=(document.getElementById('fcose-uniformNodeDimensions').value === 'true');
        cyLayout["packComponents"]= (document.getElementById('fcose-packComponents').value === 'true');
        cyLayout["step"]=document.getElementById('fcose-step').value;
        cyLayout["samplingType"]=( document.getElementById('fcose-samplingType').value === 'true');
        cyLayout["sampleSize"]=document.getElementById('fcose-samplingSize').value * 1;
        cyLayout["nodeSeparation"]=document.getElementById('fcose-nodeSeparation').value * 1;
        cyLayout["piTol"]=document.getElementById('fcose-piTol').value * 1;
        cyLayout["nodeRepulsion"]=document.getElementById('fcose-nodeRepulsionNode').value * 1;
        cyLayout["idealEdgeLength"]=document.getElementById('fcose-idealEdgeLengthEdge').value * 1;
        cyLayout["edgeElasticity"]=document.getElementById('fcose-edgeElasticity').value * 1;
        cyLayout["nestingFactor"]=document.getElementById('fcose-nestingFactor').value * 1;
        cyLayout["numIter"]=document.getElementById('fcose-numIter').value * 1;
        cyLayout["tile"]= (document.getElementById('fcose-tile').value === 'true'); 
        cyLayout["tilingPaddingVertical"]=document.getElementById('fcose-tilingPaddingVertical').value * 1;
        cyLayout["tilingPaddingHorizontal"]=document.getElementById('fcose-tilingPaddingHorizontal').value * 1;
        cyLayout["gravity"]=document.getElementById('fcose-gravity').value * 1;
        cyLayout["gravityRange"]=document.getElementById('fcose-gravityRange').value * 1;
        cyLayout["gravityCompound"]=document.getElementById('fcose-gravityCompound').value * 1;
        cyLayout["gravityRangeCompound"]=document.getElementById('fcose-gravityRangeCompound').value * 1;
        cyLayout["initialEnergyOnIncremental"]=document.getElementById('fcose-initialEnergyOnIncremental').value * 1;
        parametersArray=["quality","randomize","animate","animateDuration","fit","padding","nodeDimensionsIncludeLabels","uniformNodeDimensions","packComponents","step","samplingType","samplingSize","nodeSeparation","piTol","nodeRepulsionNode","idealEdgeLengthEdge","edgeElasticity","nestingFactor","numIter","tile","tilingPaddingVertical","tilingPaddingHorizontal","gravity","gravityRange","gravityCompound","gravityRangeCompound","initialEnergyOnIncremental"];
        parametersArray.forEach(element => {
        //  console.log(element+":"+defaultCyLayout[element]);
        });
        listParameters=` 
        quality
        randomize
        animate
        animateDuration
        fit
        padding
        nodeDimensionsIncludeLabels
        uniformNodeDimensions
        packComponents
        step
        samplingType
        samplingSize
        nodeSeparation
        piTol
        nodeRepulsionNode
        idealEdgeLengthEdge
        edgeElasticity
        nestingFactor
        numIter
        tile
        tilingPaddingVertical
        tilingPaddingHorizontal
        gravity
        gravityRange
        gravityCompound
        gravityRangeCompound
        initialEnergyOnIncremental`;
      }

      if (event.target=="runFcose"){
        cy.layout(cyLayout).run();
      }

  }
}

config.toolbarFcoseDefinition=toolbarFcoseDefinition;

// Snapshot each control's default html (keyed by id) at load time, so Restore
// Default can rebuild the fields from the definition rather than from hard-coded
// item indices — robust to reordering and with no duplicated html strings.
var fcoseDefaultHtmlById = {};
toolbarFcoseDefinition.items.forEach(function (it) {
  if (it.id !== undefined && it.html !== undefined) { fcoseDefaultHtmlById[it.id] = it.html; }
});

//w2ui['tools:Fcose'].on({ type : 'click' }, function (target, eventData) {activateToolBar("Fcose");});
 

function restoreDefault(){
  cyLayout = Object.assign({}, defaultCyLayout);
  var tb = w2ui['toolbarFcoseDefinition'];
  if (!tb) { return; }
  // Rebuild each control from its snapshotted default html, matched by id
  // (robust to reordering — no hard-coded item indices).
  tb.items.forEach(function (it) {
    if (fcoseDefaultHtmlById[it.id] !== undefined) { it.html = fcoseDefaultHtmlById[it.id]; }
  });
  tb.refresh();
}