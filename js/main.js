// Constants
const DEFAULT_ROTATION = -Math.PI / 2;
const MAP_EXTENT = [1194558.803012, 8618317.604343, 1195540.931820, 8619363.209844];

// Calculate extended bounds (50% outside original extent)
const EXTENT_WIDTH = MAP_EXTENT[2] - MAP_EXTENT[0];
const EXTENT_HEIGHT = MAP_EXTENT[3] - MAP_EXTENT[1];
const EXTENDED_EXTENT = [
    MAP_EXTENT[0] - EXTENT_WIDTH * 0.5,  // min X
    MAP_EXTENT[1] - EXTENT_HEIGHT * 0.5, // min Y
    MAP_EXTENT[2] + EXTENT_WIDTH * 0.5,  // max X
    MAP_EXTENT[3] + EXTENT_HEIGHT * 0.5  // max Y
];

const MAP_CENTER = [1195049.867416, 8618840.407093];

// Calculate appropriate zoom levels based on screen size
function calculateZoomLevels() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Get the map's container size
    const headerHeight = document.getElementById('header').offsetHeight;
    const mapHeight = screenHeight - headerHeight;
    
    // Calculate the resolution needed to fit the extent
    const widthResolution = EXTENT_WIDTH / screenWidth;
    const heightResolution = EXTENT_HEIGHT / mapHeight;
    
    // Use the larger resolution to ensure the entire extent fits
    const targetResolution = Math.max(widthResolution, heightResolution);
    
    // OpenLayers zoom levels are based on powers of 2
    // Resolution = 156543.03392804097 / (2 ^ zoom) for EPSG:3857
    // Solving for zoom: zoom = log2(156543.03392804097 / resolution)
    const baseResolution = 156543.03392804097;
    const calculatedZoom = Math.log2(baseResolution / targetResolution);
    
    // Round down to ensure the extent fits and add a small buffer
    const minZoom = Math.max(14, Math.floor(calculatedZoom - 0.5));
    
    // Desktop users shouldn't zoom out too much
    const isDesktop = window.innerWidth > 1024;
    const defaultZoom = isDesktop ? Math.max(minZoom + 1, 18) : minZoom + 2;
    
    return { 
        minZoom: minZoom, // Don't go below zoom level 14
        defaultZoom: defaultZoom
    };
}

// State
let isDefaultRotation = true;

// Initialize map layers
const baseLayers = new ol.layer.Group({
    title: null,
    layers: [
        new ol.layer.Tile({
            title: null,
            type: 'base',
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './base/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        })
    ]
});

const overlayLayers = new ol.layer.Group({
    title: 'Kartoverlegg',
    layers: [
        new ol.layer.Tile({
            title: 'Skispor',
            opacity: 0.35,
            visible: false,
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './overlay_ski_tracks/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        }),
        new ol.layer.Tile({
            title: 'Skihopp',
            opacity: 0.3,
            visible: false,
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './overlay_ski_jump/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        }),
        new ol.layer.Tile({
            title: 'Parkering',
            opacity: 0.25,
            visible: false,
            extent: MAP_EXTENT,
            source: new ol.source.XYZ({
                minZoom: 14,
                maxZoom: 22,
                url: './overlay_parking/{z}/{x}/{-y}.png',
                tileSize: [256, 256]
            })
        })
    ]
});

// Initialize map with dynamic zoom levels
const zoomLevels = calculateZoomLevels();
const map = new ol.Map({
    controls: ol.control.defaults.defaults().extend([
        new ol.control.Rotate({
            autoHide: false,
            label: '⟲',
            tipLabel: 'Tilbakestill rotasjon',
            resetNorth: function() {
                const view = map.getView();
                const targetRotation = isDefaultRotation ? 0 : DEFAULT_ROTATION;
                view.animate({
                    rotation: targetRotation,
                    duration: 250
                });
                isDefaultRotation = !isDefaultRotation;
            }
        })
    ]),
    target: 'map',
    layers: [baseLayers, overlayLayers],
    view: new ol.View({
        center: MAP_CENTER,
        rotation: DEFAULT_ROTATION,
        zoom: zoomLevels.defaultZoom,
        minZoom: zoomLevels.minZoom,
        maxZoom: 23,
        extent: EXTENDED_EXTENT
    })
});

// Add layer switcher control
map.addControl(new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    groupSelectStyle: 'none'  // Prevents group selection
}));

// Update compass rotation
function updateCompass() {
    const rotation = map.getView().getRotation();
    document.querySelector('.compass-arrow').style.transform = 
        `translate(-50%, -50%) rotate(${rotation * (180 / Math.PI)}deg)`;
}

// Initialize compass
map.getView().on('change:rotation', updateCompass);
updateCompass();

// Handle window resize
window.addEventListener('resize', () => {
    const newZoomLevels = calculateZoomLevels();
    const view = map.getView();
    
    // Update min zoom
    view.setMinZoom(newZoomLevels.minZoom);
    
    // If current zoom is less than new min zoom, adjust it
    if (view.getZoom() < newZoomLevels.minZoom) {
        view.setZoom(newZoomLevels.minZoom);
    }
});