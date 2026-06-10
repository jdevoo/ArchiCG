tools=tools.concat(["Coloring"]);

var toolbarColoringDefinition={
    name: 'toolbarColoringDefinition',
    style   : 'background-color: white',
    items: [

        { type: 'color',  id: 'globalColor',  text: 'Color for selected' },
        { type: 'spacer' },
        { type: 'button',  id: 'tagSelectionWithColor',  text: 'Tag', style:" text-align: center;" },
        { type: 'button',  id: 'resetSelectionColor',  text: 'Reset', style:" text-align: center;" },
    ]  ,
    onClick: function(event) {
      if (event.target=="tagSelectionWithColor"){tagSelectionWithColor();};
      if (event.target=="resetSelectionColor"){resetSelectionColor();};
  }
}
config.toolbarColoringDefinition=toolbarColoringDefinition;

//w2ui['tools:Coloring'].on({ type : 'click' }, function (target, eventData) {activateToolBar("Coloring");});


// Read the currently picked colour straight from the colour item AT CALL TIME.
// The previous code cached it into a `globalColor` var inside the toolbar's
// onClick, but that click fires before the palette selection commits — so the
// cached value lagged one pick behind (and was empty on first use, which made
// the border render black). w2ui stores the value already prefixed (e.g.
// "#FF0000"), so it can be used as-is.
function currentColoringColor(){
	return w2ui['toolbarColoringDefinition'].get('globalColor').color;
}

function tagSelectionWithColor(e){
	const elements =cy.nodes(":selected");
	if (elements.length === 0){ w2alert('Select one or more nodes to tag with the colour.'); return; }
	const color = currentColoringColor();
	if (!color){ w2alert('Pick a colour first by clicking the colour box.'); return; }
	// Border-only colouring. Leaf ArchiMate nodes render with background-opacity:0
	// (only the icon shows), so a background-color is invisible — and they have no
	// border by default (border-width 0). Draw a coloured outline around the node
	// box instead, leaving the fill transparent so the icon stays visible.
	elements.forEach(function(el){
		el.style("border-color", color);
		el.style("border-width", 4);
		el.style("border-opacity", 1);
	});
  }

// Remove the colouring bypass styles, reverting to the stylesheet defaults
// (border-width 0). Operates on the current selection; if nothing is selected,
// clears the colouring from every node.
function resetSelectionColor(e){
	let elements = cy.nodes(":selected");
	if (elements.length === 0){ elements = cy.nodes(); }
	elements.forEach(function(el){ el.removeStyle("border-color border-width border-opacity"); });
  }
