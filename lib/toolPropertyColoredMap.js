tools=tools.concat(["PropertyColoredMap"]);

var defaultGlobalColorProperty="type";
var defaultPOverlayOpacity=0.5;
var defaultGlobalArrowWidth=20;
POverlayOpacity=defaultPOverlayOpacity;

globalColoredProperty=defaultGlobalColorProperty; 

propertyColorDefined=false;
valueTypeColorDefined=false;
globalArrowWidth=1;


var toolbarPropertyColoredMapDefinition={
    name: 'toolbarPropertyColoredMapDefinition',
    style   : 'background-color: white',
    items: [
        { type: 'html',  id: 'propertyType',  html: `<div style=" height: 20px;display: flex;
          align-items: center">Property for coloring: 
          <input id="globalColoredProperty" list="propertyColoringList" style="color:blue;" value="${defaultGlobalColorProperty}" size="20" onchange="globalColoredProperty=this.value"></div>
          <datalist id="propertyColoringList"></datalist>` },
        { type: 'new-line' },
        { type: 'html',  id: 'overlayOpacity',  html: `<div style=" height: 20px;display: flex;
        align-items: center">Opacity (value between 0 to 1): 
        <input id="overlayOpacity" style="color:blue;" value="${defaultPOverlayOpacity}" size="5" onchange="POverlayOpacity=this.value"></div>` },
        { type: 'new-line' },
        { type: 'html',  id: 'arrowWidth',  html: `<div style=" height: 20px;display: flex; align-items: center">Arrow Width: 
        <input id="globalArrowWidth" style="color:blue;" value="${defaultGlobalArrowWidth}" size="2" onchange="globalArrowWidth=this.value"></div>` },
        { type: 'new-line' },		  
        { type: 'button',  id: 'typeColorize',  text: 'Paint Value types'  }, 
        { type: 'new-line' },	  
        { type: 'button',  id: 'valueColorize',  text: 'Paint Property values'  }, 
        {type: 'spacer' },
        { type: 'button',  id: 'resetColor',  text: 'Reset'  }, 
        { type: 'new-line' },  
        { type: 'html',  id: 'legend',  html: '<div id="legend"> </div>' }
    ]  ,
    onClick: function(event) {
       POverlayOpacity=document.getElementById("overlayOpacity").value;
       if (event.target=="typeColorize"){
        propertyColorDefined=false;
        valueTypeColorDefined=true;
        globalArrowWidth=document.getElementById("globalArrowWidth").value
        colorizeProperty("type")};
       if (event.target=="valueColorize"){
        propertyColorDefined=true;
        valueTypeColorDefined=false;
        globalArrowWidth=document.getElementById("globalArrowWidth").value;
        colorizeProperty("value");}
       if (event.target=="resetColor"){resetColorizePropertyValues();}
     }
}
config.toolbarPropertyColoredMapDefinition=toolbarPropertyColoredMapDefinition;




//w2ui['tool:PropertyColoredMap'].on({ type : 'click' }, function (target, eventData) {activateToolBar("PropertyColoredMap")});
 

function colorizeProperty(kind){
    
    globalColoredProperty=document.getElementById("globalColoredProperty").value;
    let myArray=cy.elements()
    .union(api.getAllCollapsedChildrenRecursively())
    .map(function( ele ){
        if(kind=="value"){return ele.data(globalColoredProperty)}
        if(kind=="type"){return typeof ele.data(globalColoredProperty)}
    }); 
    //console.log(myArray)
    let dup = [...new Set(myArray)].filter(function(item){
      if (kind=="value"){return typeof item !== 'undefined'};
      if (kind=="type"){return  item != 'undefined'};
    });
    //console.log (dup)
    // No element carries this property: tell the user instead of silently
    // painting nothing (which looks like the tool is broken).
    if (dup.length === 0){
      w2alert(`No graph element has a value for property "${globalColoredProperty}". `+
              `Pick a property that exists on your nodes or edges (the field offers a list).`);
      return;
    }
    let propertyValueColors = d3.scaleOrdinal(dup,d3.schemeTableau10);
    
   // w2ui.toolbarPropertyColoredMapDefinition.set(`colorize${kind}`, 
   //    { text: `Colors for ${globalColoredProperty} ${kind}` }); 
   // ["value", "type"].forEach(function(myKind){
   //     if (myKind != kind){
   // w2ui.toolbarPropertyColoredMapDefinition.set(`colorize${kind}`, 
   //    { text: `Paint ${globalColoredProperty} ${myKind} ` });}
   // });

    // Draw the legend on the toolbar - columns is needed for having one legend element per line
    w2ui.toolbarPropertyColoredMapDefinition.set('legend', { html: Swatches(propertyValueColors, {columns: "250px" } )});
    //colorized the graph
    propertyColor = d3.scaleOrdinal(propertyValueColors.domain(),propertyValueColors.range());
    cy.style().update()

    
  };

  function resetColorizePropertyValues(){
    w2ui.toolbarPropertyColoredMapDefinition.set('legend', { html: ""});
    propertyColorDefined=false;
    valueTypeColorDefined=false;
    globalArrowWidth=1;
    POverlayOpacity=defaultPOverlayOpacity;
    cy.style().update();
    document.getElementById("globalArrowWidth").value= defaultGlobalArrowWidth;
    document.getElementById("overlayOpacity").value= defaultPOverlayOpacity;
    w2ui.toolbarPropertyColoredMapDefinition.refresh();
  }; 

var propertyColor = () => void 0;

function pColor(attribut){
  if (propertyColorDefined || valueTypeColorDefined){return propertyColor(attribut);}
  else{return "white";}
}

  function Swatches( color, {
    columns = null,
    format,
    unknown: formatUnknown,
    swatchSize = 15,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
    marginLeft = 0
     } = {}) {
    const id = `-swatches-${Math.random().toString(16).slice(2)}`;
    const unknown = formatUnknown == null ? undefined : color.unknown();
    const unknowns = unknown == null || unknown === d3.scaleImplicit ? [] : [unknown];
    const domain = color.domain().concat(unknowns);
    if (format === undefined) format = x => x === unknown ? formatUnknown : x;
  
    function entity(character) {
      return `&#${character.charCodeAt(0).toString()};`;
    }
  
    if (columns !== null) return `
<div style="margin-left: ${+marginLeft}px; font: 10px sans-serif; width: 100%; max-height: 50vh; overflow: auto; box-sizing: border-box;
            display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 2px 10px;">
    <style>

  .${id}-item {
    display: flex;
    align-items: center;
    min-width: 0;
    padding-bottom: 2px;
  }

  /* Label fills the remaining width of its column and ellipsises if too long, so
     each entry stays within its grid cell rather than overflowing the panel. */
  .${id}-label {
    flex: 1 1 auto;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .${id}-label input {
    width: 100%;
    box-sizing: border-box;
  }

  .${id}-swatch {
    flex: 0 0 auto;
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin: 0 0.5em 0 0;
  }

    </style>
    ${domain.map((value, index) => {
      const label = `${format(value)}`;
      let idInput=`${index}-input`;
      let onChange=`changeLabel('${index}');`;
      let disabled="";
     // console.log(`value = ${value}`)
      let testValue=value + "";
      if(testValue == "undefined"){disabled="disabled"};

      return `<div class=${id}-item>
        <div class=${id}-swatch style="background:${color(value)}"></div>
        <div class=${id}-label title=${label}><input id=${idInput} type="text" value='${label}' onchange="${onChange}" ${disabled}></div>
      </div>`;
    }).join('')}
  </div>`;
  }

 function changeLabel(id){
  let myId=`${id}-input`;
  let newValue=document.getElementById(myId).value;
  let oldValue=document.getElementById(myId).defaultValue;

  w2confirm(`Changing "${oldValue}" to "${newValue}"?
  (This will change the values in the whole graph including what is hidden, nodes or arcs)`)
  .yes(() => {

    let myColoredProperty=document.getElementById("globalColoredProperty").value;
    let myFilter=`[${myColoredProperty} = "${oldValue}"]`;

    let myList=cy.$(myFilter);
    cy.elements(myFilter).union(api.getAllCollapsedChildrenRecursively().filter(myFilter)).map(function( elem ){ 
     // console.log (`${elem.id()} property ${myColoredProperty} value ${oldValue} changed to ${newValue}`)
      return elem.data(myColoredProperty,newValue)});

      colorizeProperty("value")
    
})
.no(() => {
});
 
}


function updatePropertyColoringList() {
  allPropertyNames = getAllPropertyNames();
  let datalist = document.getElementById('propertyColoringList');

  // Clear the current options
  datalist.innerHTML = '';

  // Add new options
  allPropertyNames.forEach(function(propertyName) {
    let option = document.createElement('option');
    option.value = propertyName;
    datalist.appendChild(option);
  });
}


document.addEventListener('focus', function(event) {
  if (event.target && event.target.id === 'globalColoredProperty') {
    updatePropertyColoringList();
  }
}, true);





// Todo
// test the types of the old and the new value in order to ensure no mismatch
// to deal differently for undefined, as in fact no property exist.  
//In fact, it should be possible to replace the values only for exceptional cases
// to think on how to apply it on a selection
// also to think about the add property for a selection of nodes which create a new property with the same name and value even if it already exist
// it should not be possible
// also, multiple values for the same property should be handled (how to color it and put a legend in this case)
// For XML data types converted to JSON and the reverse, let's have a look at
//https://www.openlife.cc/blogs/2013/november/translating-reliably-between-xml-and-json-xml2json
// rewritte colorizeGraph and resetColorizedGraph in order to avoid extend and collapse of the whole graph


