/*
This is the tool related to combined usage of ArchiMate compound graph with timeline
Implementation relies on combined usage of vis.js  timeline and cytoscape.js
*/
// Timeline tool added to the list of tools - also requires the following javascript libraries being referenced in the HTML
// for launching the tool this way:
// <script src="lib/vis-timeline-graph2d.min.js"></script>
// <script src="lib/toolTimeline.js"></script>

tools=tools.concat(["Timeline"]);

// Variables used to parameterize the visualization, giving access to a predefined list of names.
// They should be changeable through the toolbar dedicated to the tool (e.g. toolbarTimelineDefinition, defined using the w2ui.js library).
var timeline;

var listPlanStartDateProperties=["plan_start_date"];
var startPlanDateProperties="";
listPlanStartDateProperties.forEach((kind) => {startPlanDateProperties += '<option value="'+kind+'" />';})

var listPlanEndDateProperties=["plan_end_date"];
var endPlanDateProperties="";
listPlanEndDateProperties.forEach((kind) => {endPlanDateProperties += '<option value="'+kind+'" />';})

var listActualStartDateProperties=["actual_start_date"];
var startActualDateProperties="";
listActualStartDateProperties.forEach((kind) => {startActualDateProperties += '<option value="'+kind+'" />';})

var listActualEndDateProperties=["actual_end_date"];
var endActualDateProperties="";
listActualEndDateProperties.forEach((kind) => {endActualDateProperties += '<option value="'+kind+'" />';})


var toolbarTimelineDefinition={
    name: 'toolbarTimelineDefinition',
    style   : 'background-color: white',
    items: [
      { type: 'html', id: 'plannedDateLabel', html:'Planned Date Properties' },
      { type: 'new-line' },
      {  type: 'html',  id: 'planStartDateProperty',  html: `<div style=" height: 20px;display: flex;
        align-items: center;">start: 
        <input id="globalPlanStartDataProperty" list="listPlanStartDateProperties" value="plan_start_date" style="color:blue;"size="20" >
        <datalist id="listPlanStartDateProperties">${startPlanDateProperties}</datalist>
        </div>` },
      { type: 'new-line' },
      {  type: 'html',  id: 'planEndDateProperty',  html: `<div style=" height: 20px;display: flex;
      align-items: center;">end: 
      <input id="globalPlanEndDataProperty" list="listPlanEndDateProperties" value="plan_end_date" style="color:blue;"size="20" >
      <datalist id="listPlanEndDateProperties">${endPlanDateProperties}</datalist>
      </div>` },
      { type: 'new-line' },
      { type: 'html', id: 'actualDateLabel', html:'Actual Date Properties' },
      { type: 'new-line' },
      {  type: 'html',  id: 'actualStartDateProperty',  html: `<div style=" height: 20px;display: flex;
        align-items: center;">start: 
        <input id="globalActualStartDataProperty" list="listActualStartDateProperties" value="actual_start_date" style="color:blue;"size="20" >
        <datalist id="listActualStartDateProperties">${startActualDateProperties}</datalist>
        </div>` },
      { type: 'new-line' },
      {  type: 'html',  id: 'actualEndDateProperty',  html: `<div style=" height: 20px;display: flex;
      align-items: center;">end: 
      <input id="globalActualEndDataProperty" list="listActualEndDateProperties" value="actual_end_date" style="color:blue;"size="20" >
      <datalist id="listActualEndDateProperties">${endActualDateProperties}</datalist>
      </div>` },
      { type: 'new-line' },
      { type: 'button',  id: 'timeline2',  text: 'Apply' },
      { type: 'button',  id: 'switch',  text: 'Switch' },
    ]  ,
    onClick: function(event) {
      if (event.target=="timeline2"){
        let startProp=document.getElementById("globalPlanStartDataProperty").value;
        let endProp=document.getElementById("globalPlanEndDataProperty").value;
        let filterPlannedWork=`[${startProp}][${endProp}]`
        let plannedWork=cy.nodes().union(api.getAllCollapsedChildrenRecursively()).filter(filterPlannedWork);
        if (plannedWork.length===0){
          w2alert('No graph element has both "'+startProp+'" and "'+endProp+'". '+
                  'Check the property names match the toolbar fields, and that each node has both a start and an end value.');
        }
        let plannedWorkItems=plannedWork.map(function( ele ){
          let item={};
          item["id"]=ele.id();
          item["content"]=ele.data("label")//`<div style="display: flex; align-items: center;"><img src="${ArchiMate(ele.data("type"))}" width="20" height="20" ><span>${ele.data("label")}</span></div>`;
          item["start"]=ele.data(`${document.getElementById("globalPlanStartDataProperty").value}`);
          item["end"]=ele.data(`${document.getElementById("globalPlanEndDataProperty").value}`);
          item["group"]=10;
          return item;
        });

      // Reveal the panel BEFORE building the timeline: vis-timeline measures its
      // container at construction and a display:none element reports 0 width, so
      // it would render blank. Making it visible first lets vis size correctly.
      revealTimelinePanel();
      document.getElementById('timeline').innerHTML = "";
      let container = document.getElementById('timeline');
      let groups = [{id: 1,content: 'Roadmap R1',treeLevel: 1,nestedGroups: [10,11]},{id: 10,content: 'Project P1',treeLevel: 2},{id:11,content: 'Project P2',treeLevel: 2},
                    {id: 2,content: 'Roadmap R2',treeLevel: 1,nestedGroups: [20,21]},{id: 20,content: 'Project P2',treeLevel: 2},{id:21,content: 'Project P2',treeLevel: 2}]

      // Create a DataSet (allows two way data-binding)
      let items = new vis.DataSet(plannedWorkItems);
//        [{id: 1, content: 'item 1', start: '2013-04-20'},
//        {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'}]
    
      // Configuration for the Timeline - could be controlled through user interface is creating variable which can be change through the toolbal
      var options = {
        editable:  true,
        verticalScroll:true,
        onAdd: function (item, callback) {
          prettyPrompt('Add item', 'Enter text content for new item:', item.content, function (value) {
            item.start = item.start || new Date();
            item.end = item.end || new Date(item.start.getTime() + 10*24*3600000); 
            if (value) {
              item.content = value;
              callback(item); // send back adjusted new item
            }
            else {
              callback(null); // cancel item creation
            }
          });
        },
    
        onMove: function (item, callback) {
          event.stopPropagation(); // Stop the event from bubbling up
          event.preventDefault();  
          let title = 'Do you really want to move the item to\n' +
              'start: ' + item.start + '\n' +
              'end: ' + item.end + '?';
    
          prettyConfirm('Move item', title, function (ok) {
            if (ok && item.start && item.end && item.start < item.end) {
              callback(item); // send back item as confirmation (can be changed)
            }
            else {
              callback(null); // cancel editing item
            }
          });
        },
    
        onMoving: function (item, callback) {
          container.addEventListener('mousemove', function(event) {
            event.stopPropagation(); // Ensure other listeners don't interfere
            event.preventDefault();  // Prevent default behaviors that might cause issues
          });

    
          callback(item); // send back the (possibly) changed item
        },
    
        onUpdate: function (item, callback) {
          prettyPrompt('Update item', 'Edit items text:', item.content, function (value) {
            if (value) {
              item.content = value;
              callback(item); // send back adjusted item
            }
            else {
              callback(null); // cancel updating the item
            }
          });
        },
    
        onRemove: function (item, callback) {
          prettyConfirm('Remove item', 'Do you really want to remove item ' + item.content + '?', function (ok) {
            if (ok) {
              callback(item); // confirm deletion
            }
            else {
              callback(null); // cancel deletion
            }
          });
        },
        locale:'en', 
        timeAxis: { scale: 'week', step: 1 }                     
    };
    
      // Create a Timeline
      timeline = new vis.Timeline(container, items, groups,options);
      timeline.on("select", function (properties) {
      //  properties.items.forEach(function(item){searchNode(item)})
      });

      // Apply just rebuilt the timeline contents into the (initially hidden)
      // #timeline div. Reveal it straight away so one click renders *and* shows.
      showTimeline();
    }

      if (event.target=="switch"){
        // Single toggle: hide if currently visible, otherwise show.
        if (document.getElementById("timeline").style.display == "block"){
          hideTimeline();
        }else{
          showTimeline();
        };
      }

  }
}

// Show/hide the timeline panel via a single "Switch" toggle (consistent with the
// Graph as Matrix tool).
//
// We FULL-REPLACE the graph rather than split the panel: #cy is float:right with
// width:100%, so a 75/25 split leaves the floated cy canvas overlapping (and
// hiding) the timeline. The Matrix tool avoids this the same way — it toggles
// display between #cy and its own panel (see toolGraphAsMatrix.js). So Switch
// swaps the graph out for the full-height timeline, and Switch again swaps back.

// Make the timeline fill the panel. Kept separate so Apply can reveal the
// container BEFORE constructing the timeline (vis needs a measurable element).
function revealTimelinePanel(){
  document.getElementById("cy").style.display = "none";
  document.getElementById("timeline").style.display = "block";
  document.getElementById("timeline").style.height = "100%";
}

function showTimeline(){
  revealTimelinePanel();
  // vis-timeline's API is redraw()/fit(), NOT refresh(). redraw() recomputes the
  // geometry and fit() zooms the window to span all items so the bars are in view.
  try{ timeline.redraw(); timeline.fit(); } catch(error){}
}

function hideTimeline(){
  document.getElementById("timeline").style.display = "none";
  document.getElementById("cy").style.display = "block";
  document.getElementById("cy").style.height = "100%";
  // Cytoscape doesn't observe container resizes — repaint it at full size now
  // that the graph is visible again.
  if (window.cy && typeof cy.resize === 'function'){ cy.resize(); }
}
config.toolbarTimelineDefinition=toolbarTimelineDefinition;


//w2ui['tools:Timeline'].on({ type : 'click' }, function (target, eventData) {activateToolBar("Timeline");});
 

    function prettyConfirm(title, text, callback) {
      swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55"
      }, callback);
    }
  
    function prettyPrompt(title, text, inputValue, callback) {
      swal({
        title: title,
        text: text,
        type: 'input',
        showCancelButton: true,
        inputValue: inputValue
      }, callback);
    }
  
   