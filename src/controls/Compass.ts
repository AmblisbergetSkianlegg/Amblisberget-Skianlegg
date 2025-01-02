import Control from 'ol/control/Control';
import { CLASS_UNSELECTABLE } from 'ol/css';
import { Options as ControlOptions } from 'ol/control/Control';

export interface CompassOptions extends ControlOptions {
    autoHide?: boolean;
    className?: string;
}

/**
 * @classdesc
 * A control displaying a compass rose that indicates the map rotation.
 * The compass can be clicked to reset the rotation to north.
 */
export class RoundCompass extends Control {
    /**
     * @private
     * @type {HTMLElement}
     */
    private innerElement_: HTMLElement;

    /**
     * @private
     * @type {HTMLElement}
     */
    private arrowElement_: HTMLElement;

    /**
     * @private
     * @type {boolean}
     */
    private renderedVisible_: boolean;

    /**
     * @private
     * @type {number|undefined}
     */
    private rotation_: number | undefined;

    /**
     * @param {CompassOptions} [options] Compass options.
     */
    constructor(options: CompassOptions = {}) {
        const className = options.className || 'ol-round-compass';

        // Create the main element
        const element = document.createElement('div');
        element.className = `${className} ${CLASS_UNSELECTABLE}`;

        // Create the compass rose
        const rose = document.createElement('div');
        rose.className = `${className}-rose`;

        // Create the arrow
        const arrow = document.createElement('div');
        arrow.className = `${className}-arrow`;

        // Create the cardinal direction labels
        const directions = ['N', 'Ø', 'S', 'V'];
        directions.forEach((dir, index) => {
            const label = document.createElement('div');
            label.className = `${className}-label`;
            label.textContent = dir;
            //label.style.transform = `rotate(${index * 90}deg)`;
            rose.appendChild(label);
        });

        // Assemble the elements
        element.appendChild(rose);
        element.appendChild(arrow);

        super({
            element,
            target: options.target,
            render: options.render,
        });

        // this.innerElement_ = inner;
        this.arrowElement_ = arrow;
        this.renderedVisible_ = true;
        this.rotation_ = undefined;

        // Add click handler to reset rotation
        element.addEventListener('click', this.handleClick_.bind(this));
    }

    /**
     * @private
     * @param {MouseEvent} event The event to handle
     */
    private handleClick_(event: MouseEvent) {
        event.preventDefault();
        if (this.getMap()) {
            const view = this.getMap()!.getView();
            view.animate({
                rotation: 0,
                duration: 250
            });
            // Emit rotation change event
            this.dispatchEvent('change:rotation');
        }
    }

    /**
     * Update the compass element.
     * @param {import("ol/MapEvent").default} mapEvent Map event.
     * @override
     */
    render(mapEvent: any) {
        const frameState = mapEvent.frameState;
        if (!frameState) {
            if (this.renderedVisible_) {
                this.element.style.display = 'none';
                this.renderedVisible_ = false;
            }
            return;
        }

        const rotation = frameState.viewState.rotation;
        
        if (rotation !== this.rotation_) {
            const rotationDeg = rotation * (180 / Math.PI);
            this.arrowElement_.style.transform = `translate(-50%, -50%) rotate(${rotationDeg}deg)`;
            this.rotation_ = rotation;
            
            // Emit rotation change event
            this.dispatchEvent('change:rotation');
        }

        if (!this.renderedVisible_) {
            this.element.style.display = '';
            this.renderedVisible_ = true;
        }
    }
}
