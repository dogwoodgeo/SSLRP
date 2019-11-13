/**
 * Created by bradjones on 08/26/2019.
 */
require([
  'dojo/dom-construct',
  'esri/Map',
  'esri/views/MapView',
  'esri/Basemap',
  'esri/layers/VectorTileLayer',
  'esri/layers/MapImageLayer',
  'esri/widgets/Legend',
  'esri/widgets/Expand',
  'esri/widgets/Home',
  'esri/PopupTemplate',
  'dojo/dom',
  'dojo/on',
  'dojo/domReady!'
],
  function(
      domConstruct,
      Map,
      MapView,
      Basemap,
      VectorTileLayer,
      MapImageLayer,
      Legend,
      Expand,
      Home,
      PopupTemplate,
      dom,
      on
) {

    // Create the popup for the Wards layer
    const wardsPopupTemplate = new PopupTemplate({
      title: 'Ward {DISTRICT} - {NAME}',
      content: "<iframe src='{WEBSITE}' frameborder='0' width='100%' " +
      "height='100%' "+"style='width: 100%; height: 100%; display: block; padding: 0px; margin: 0px;'></iframe>"
    });

    // Wards MapImageLayer object
    const wardsLayers = new MapImageLayer({
      url: 'https://gis.lrwu.com/server/rest/services/SSLRP/City_Wards/MapServer',
      title: 'Wards',
      sublayers: [{
          id: 0,
          title: 'Ward 1- Hendrix',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 0
          }
      },{
          id: 1,
          title: 'Ward 2- Richardson',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 1
          }
      }, {
          id: 2,
          title: 'Ward 3- Webb',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 2
          }
      }, {
          id: 3,
          title: 'Ward 4- Peck',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 3
          }
      }, {
          id: 4,
          title: 'Ward 5- Hines',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 4
          }
      }, {
          id: 5,
          title: 'Ward 6- Wright',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 5
          }
      }, {
          id: 6,
          title: 'Ward 7- Wyrick',
          visible: true,
          popupTemplate: wardsPopupTemplate,
          source: {
              mapLayerId: 6
          }
      }]
    });

    // SSLRP point map image layer
    const sslrpLayers = new MapImageLayer({
      url: 'https://gis.lrwu.com/server/rest/services/SSLRP/SSLRP_Applications/MapServer',
      title: 'Applications Reimbursed',
      sublayers: [{
          id: 0,
          title: 'Since 2013',
          visible: true
      },{
          id: 1,
          title: 'Current Year',
          visible: false
      }]
  });

    // Create the vector tile object for the basemap baselayers
    const streetsLayer = new VectorTileLayer({
      url: 'https://gis.lrwu.com/server/rest/services/Hosted/Streets_Gray/VectorTileServer'
    });

    const labelsLayer = new VectorTileLayer({
      url: 'https://gis.lrwu.com/server/rest/services/Hosted/Labels_Gray/VectorTileServer'
    });

    // Create the basemap object
    const streetsGray = new Basemap({
      baseLayers: [streetsLayer, labelsLayer]
    });
    
    // Map object
    const map = new Map({
    basemap: streetsGray,
    layers: [wardsLayers, sslrpLayers]
    });

    // MapView Object
    const view = new MapView({
    container: 'viewDiv',
    map: map,
    zoom: 12,
    //
    center: [-92.356121,34.737015],
    constraints: {
      minZoom: 10,
      maxZoom: 16,
      snapToZoom: false
    },  
    logo: false
    });
    
    // Expandable legend widget
    const legend = new Expand({
      content: new Legend({
        view: view,
        layerInfos: [{
           layer: sslrpLayers
        }],
        style: "classic"
      }),
      view: view,
      expanded: true
    });
    
    const home = new Home({
      view: view
    });

    // Add the legend, home button, and select-div to the UI
    view.ui.add(legend, 'bottom-left');
    view.ui.add('select-div', 'top-right');
    view.ui.add(home, "top-left");
    
    // set sublayer visibility depending on the selected layer
    on(dom.byId("layer-select"), "change", function(event) {
      let newValue = parseInt(event.target.value);
      sslrpLayers.sublayers.forEach(function(sublayer) {
        sublayer.visible = (newValue === sublayer.id);
      });
    });    

  });