tools=tools.concat(["URLNavigation"]);
var toolbarURLNavigationDefinition={
    name: 'URLNavigation',
    style   : 'background-color: white',
    items: [
      { type: 'button', id: 'URLNavigationActive', text: 'Activate Navigation', checked: false },
      { type: 'new-line' },
      { type: 'html',  id: 'URLProperty', 
      html(item) {
        let html =
            '<div style=" height: 20px;display: flex;align-items: center;">'+
            ' URL property : '+
            `<input id="url_property" style="color:blue;" value='${URLProperty}' size="20" ></input>`+
            '</div>'
        return html
    }
  },
  { type: 'button', id: 'URLPropertyApply', text: '>>' },
         
    ]  ,
    onClick: function(event) {

      if (event.target=="URLNavigationActive"){
        // Toggle in place — no popup. We own the state (a plain button doesn't
        // auto-toggle), flipping the flag and reflecting it on the button via the
        // pressed `checked` highlight and a Activate/Deactivate label.
        URLNavigationActivated = !URLNavigationActivated;
        w2ui['URLNavigation'].set('URLNavigationActive', {
          checked: URLNavigationActivated,
          text: URLNavigationActivated ? 'Deactivate Navigation' : 'Activate Navigation'
        });
        };
      if (event.target=="URLPropertyApply"){
        URLProperty=document.getElementById('url_property').value;
        w2alert("Property containing URL set to " + URLProperty)
    }
    }
}

config.toolbarURLNavigationDefinition=toolbarURLNavigationDefinition;

