import { Map as OLMap } from 'ol';
import { transform } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import Layer from 'ol/layer/Layer';
import BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';

/**
 * @classdesc
 * A status bar component that displays map information below the map.
 * This includes coordinates, altitude, and scale information.
 */
export class StatusBar {
    /**
     * @private
     * @type {HTMLElement}
     */
    private element_: HTMLElement;

    /**
     * @private
     * @type {HTMLElement}
     */
    private coordinatesElement_: HTMLElement;

    /**
     * @private
     * @type {HTMLElement}
     */
    private altitudeElement_: HTMLElement;

    /**
     * @private
     * @type {HTMLElement}
     */
    private progressElement_: HTMLElement;

    /**
     * @private
     * @type {HTMLElement}
     */
    private progressTextElement_: HTMLElement;

    /**
     * @private
     * @type {boolean}
     */
    private isLoading_: boolean = false;

    /**
     * @private
     * @type {number}
     */
    private loading_: number = 0;

    /**
     * @private
     * @type {number}
     */
    private loaded_: number = 0;

    /**
     * @private
     * @type {OLMap|null}
     */
    private map_: OLMap | null = null;

    /**
     * @param {StatusBarOptions} [options] Status bar options.
     */
    constructor(options: StatusBarOptions = {}) {
        // Create or use existing status bar element
        this.element_ = options.target || document.createElement('div');
        this.element_.id = 'status-bar';
        this.element_.className = 'h-statusBar';

        // Create the structure
        const leftContainer = document.createElement('div');
        leftContainer.className = 'status-left';

        // Progress container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'flex items-center gap-2';

        // Create circular progress
        const progressCircle = document.createElement('div');
        progressCircle.className = 'progress-circle';

        // Background circle
        const progressBg = document.createElement('div');
        progressBg.className = 'progress-circle-bg';

        // Progress fill circle (SVG for better control)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.classList.add('progress-circle-fill');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const radius = 14;
        const circumference = 2 * Math.PI * radius;
        
        circle.setAttribute('cx', '16');
        circle.setAttribute('cy', '16');
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-linecap', 'round');
        circle.setAttribute('stroke-dasharray', `0 ${circumference}`);

        svg.appendChild(circle);
        this.progressElement_ = circle;

        // Progress text
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        this.progressTextElement_ = progressText;
        this.progressTextElement_.textContent = '0%';

        // Assemble progress circle
        progressCircle.appendChild(progressBg);
        progressCircle.appendChild(svg);

        // Data attribution link
        const attributionLink = document.createElement('a');
        attributionLink.href = '#';
        attributionLink.className = 'status-attribution-link';
        attributionLink.textContent = 'Data attribution';
        attributionLink.addEventListener('click', (e) => {
            e.preventDefault();
            // TODO: Show attribution popup
        });

        // Map date
        const mapDate = document.createElement('span');
        mapDate.className = 'text-text-primary';
        const date = options.mapDate || new Date();
        mapDate.textContent = date.toISOString().split('T')[0].replace(/-/g, '/');

        // Right container
        const rightContainer = document.createElement('div');
        rightContainer.className = 'status-right';

        // Scale container (for OpenLayers ScaleLine control)
        const scaleContainer = document.createElement('div');
        scaleContainer.id = 'scale-container';

        // Mouse position container
        const mousePosition = document.createElement('div');
        mousePosition.id = 'mouse-position';
        mousePosition.className = 'px-4';

        this.coordinatesElement_ = document.createElement('span');
        this.coordinatesElement_.id = 'coordinates';

        this.altitudeElement_ = document.createElement('span');
        this.altitudeElement_.id = 'altitude';
        this.altitudeElement_.className = 'ml-2';

        // Assemble the elements
        progressContainer.appendChild(progressCircle);
        progressContainer.appendChild(progressText);
        
        leftContainer.appendChild(progressContainer);
        leftContainer.appendChild(attributionLink);
        leftContainer.appendChild(mapDate);

        mousePosition.appendChild(this.coordinatesElement_);
        mousePosition.appendChild(this.altitudeElement_);
        rightContainer.appendChild(scaleContainer);
        rightContainer.appendChild(mousePosition);

        this.element_.appendChild(leftContainer);
        this.element_.appendChild(rightContainer);
    }

    /**
     * Set the map instance for this control.
     * @param {OLMap} map The map instance.
     */
    setMap(map: OLMap) {
        if (this.map_) {
            this.map_.un('pointermove', this.handlePointerMove_);
            this.map_.un('loadstart', this.showProgress_.bind(this));
            this.map_.un('loadend', this.hideProgress_.bind(this));
            this.map_.getView().un('change:center', this.handleCenterChange_);
            this.map_.getLayers().forEach(l => this.unregisterLayerEvents(l));
        }

        this.map_ = map;

        if (map) {
            map.on('pointermove', this.handlePointerMove_.bind(this));
            map.getView().on('change:center', this.handleCenterChange_.bind(this));
            this.registerLoadEvents_(map);
            
            // Initialize coordinates with map center
            this.updateCoordinates_(map.getView().getCenter());
        }
    }

    /**
     * Register load events for the map and its layers
     * @private
     * @param {OLMap} map The map instance
     */
    private registerLoadEvents_(map: OLMap) {
        map.on('loadstart', this.showProgress_.bind(this));
        map.on('loadend', this.hideProgress_.bind(this));

        // Process all existing layers
        map.getLayers().forEach(l => this.registerLayerEvents(l));

        // Listen for layer additions
        map.getLayers().on('add', (event) => {
            this.registerLayerEvents(event.element);
        });

        map.getLayers().on('remove', (event) => {
            this.unregisterLayerEvents(event.element);
        });
    }
    
    /**
     * Register events for a layer
     * @private
     * @param {BaseLayer} layer The layer to register events for
     */
    private registerLayerEvents(layer: BaseLayer) {
        if (layer instanceof LayerGroup) {
            layer.getLayers().forEach(l => this.registerLayerEvents(l));
        }
        if (layer instanceof Layer) {
            const source = (layer as Layer).getSource();
            if (source) {
                source.on('tileloadstart', this.handleTileLoadStart_.bind(this));
                source.on(['tileloadend', 'tileloaderror'], this.handleTileLoadEnd_.bind(this));
            }
        }
    };

    /**
     * Unregister events for a layer
     * @private
     * @param {BaseLayer} layer The layer to unregister events for
     */
    private unregisterLayerEvents(layer: BaseLayer) {
        if (layer instanceof LayerGroup) {
            layer.getLayers().forEach(l => this.unregisterLayerEvents(l));
        }
        if (layer instanceof Layer) {
            const source = layer.getSource();
            if (source) {
                source.un('tileloadstart', this.handleTileLoadStart_.bind(this));
                source.un(['tileloadend', 'tileloaderror'], this.handleTileLoadEnd_.bind(this));
            }
        }
    }

    /**
     * Handle tile load start
     * @private
     */
    private handleTileLoadStart_() {
        // Always increment loading counter, even if not in loading state
        this.loading_++;
        if (this.isLoading_) {
            this.updateProgress_();
        }
    }

    /**
     * Handle tile load end
     * @private
     */
    private handleTileLoadEnd_() {
        // Always increment loaded counter, even if not in loading state
        this.loaded_++;
        if (this.isLoading_) {
            this.updateProgress_();
        }
    }

    /**
     * Update the progress bar
     * @private
     */
    private updateProgress_() {
        if (this.loading_ === 0) {
            return;
        }

        const progress = Math.min((this.loaded_ / this.loading_ * 100), 100);
        const radius = 14;
        const circumference = 2 * Math.PI * radius;
        const filledAmount = (progress / 100) * circumference;
        
        // Set the dash length to the filled amount, and the gap to the remaining circumference
        this.progressElement_.setAttribute('stroke-dasharray', `${filledAmount} ${circumference}`);
        this.progressTextElement_.textContent = `${Math.round(progress)}%`;
    }

    /**
     * Show the progress bar
     * @private
     */
    private showProgress_() {
        this.isLoading_ = true;
        // Don't reset counters here, as we might have ongoing loads
        this.progressTextElement_.style.visibility = 'visible';
        this.updateProgress_();
    }

    /**
     * Hide the progress bar
     * @private
     */
    private hideProgress_() {
        this.isLoading_ = false;
        // Reset counters when all loads are complete
        this.loading_ = 0;
        this.loaded_ = 0;
        // Keep the text at 100% when hidden
        this.progressTextElement_.textContent = '100%';
    }

    /**
     * Format coordinates in DMS notation
     * @private
     * @param {number} deg The decimal degrees
     * @param {boolean} isLat Whether this is a latitude value
     * @returns {string} Formatted DMS string
     */
    private formatDMS_(deg: number, isLat: boolean): string {
        const abs = Math.abs(deg);
        const d = Math.floor(abs);
        const m = Math.floor((abs - d) * 60);
        const s = Math.floor(((abs - d) * 60 - m) * 60);
        const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
        return `${d}°${m}'${s}"${dir}`;
    }

    /**
     * Update coordinates display
     * @private
     * @param {Coordinate|undefined} coordinate The coordinate in map projection
     */
    private updateCoordinates_(coordinate: Coordinate | undefined) {
        if (!coordinate) {
            this.coordinatesElement_.textContent = '';
            return;
        }

        const [lon, lat] = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        this.coordinatesElement_.textContent = `${this.formatDMS_(lat, true)} ${this.formatDMS_(lon, false)}`;
    }

    /**
     * Handle pointer move events
     * @private
     * @param {import("ol/MapBrowserEvent").default} event The event.
     */
    private handlePointerMove_(event: any) {
        if (event.dragging) {
            return;
        }

        this.updateCoordinates_(event.coordinate);
        
        // TODO: Add elevation data when available
        this.altitudeElement_.textContent = '';
    }

    /**
     * Handle map center changes
     * @private
     */
    private handleCenterChange_(event: any) {
        if (this.map_ && !this.map_.getView().getInteracting()) {
            this.updateCoordinates_(this.map_.getView().getCenter());
        }
    }

    /**
     * Get the status bar element.
     * @returns {HTMLElement} The status bar element.
     */
    getElement(): HTMLElement {
        return this.element_;
    }
}

export interface StatusBarOptions {
    target?: HTMLElement;
    mapDate?: Date;
}
