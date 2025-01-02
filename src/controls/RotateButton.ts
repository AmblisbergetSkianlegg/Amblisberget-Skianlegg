import { Rotate } from 'ol/control';
import { Options as RotateOptions } from 'ol/control/Rotate';

export interface CustomRotateOptions extends RotateOptions {
    defaultRotation?: number;
}

/**
 * @classdesc
 * A control with a button to reset the rotation to either north or a default rotation.
 * This control is context-aware of the map's current rotation state.
 */
export class RotateButton extends Rotate {
    /**
     * @private
     * @type {number}
     */
    private defaultRotation_: number;

    /**
     * @private
     * @type {boolean}
     */
    private isDefaultRotation_: boolean;

    /**
     * @param {CustomRotateOptions} [options] Rotate options.
     */
    constructor(options: CustomRotateOptions = {}) {
        const defaultOptions = {
            className: 'ol-rotate',
            label: '⇧',
            tipLabel: 'Tilbakestill rotasjon',
            compassClassName: 'ol-compass',
            autoHide: false
        };

        super({
            ...defaultOptions,
            ...options,
            resetNorth: undefined // We'll override this
        });

        this.defaultRotation_ = options.defaultRotation || 0;
        this.isDefaultRotation_ = true;

        // Override the click handler
        const button = this.element.querySelector('button');
        if (button) {
            button.addEventListener('click', this.handleClick_.bind(this), false);
        }

        // Listen for rotation changes from any source
        this.on('change:rotation', this.handleRotationChange_.bind(this));
    }

    /**
     * @private
     * @param {MouseEvent} event The event to handle
     */
    private handleClick_(event: MouseEvent) {
        event.preventDefault();
        if (this.getMap()) {
            const view = this.getMap()!.getView();
            const targetRotation = this.isDefaultRotation_ ? this.defaultRotation_ : 0;
            
            view.animate({
                rotation: targetRotation,
                duration: 250
            });
            
            this.isDefaultRotation_ = !this.isDefaultRotation_;
        }
    }

    /**
     * Handle rotation changes from any source (compass click or this button)
     * @private
     */
    private handleRotationChange_(event: any) {
        const rotation = this.getMap()?.getView().getRotation();
        if (rotation !== undefined) {
            // Update our state based on the actual rotation
            this.isDefaultRotation_ = Math.abs(rotation) < 0.001 || 
                                    Math.abs(rotation - this.defaultRotation_) < 0.001;
        }
    }

    /**
     * Update the rotate control element.
     * @param {import("ol/MapEvent").default} mapEvent Map event.
     * @override
     */
    render(mapEvent: any) {
        const frameState = mapEvent.frameState;
        if (!frameState) {
            if (this.rendered_) {
                this.element.style.display = 'none';
                this.rendered_ = false;
            }
            return;
        }

        const rotation = frameState.viewState.rotation;
        const rotationDeg = rotation * 180 / Math.PI;

        // Apply rotation to the compass element, not the button
        const compass = this.element.querySelector('.ol-compass');
        if (compass) {
            compass.style.transform = `rotate(${rotationDeg}deg)`;
        }

        // Only show if we're not at north or default rotation
        if (!this.autoHide_) {
            this.element.style.display = '';
        } else {
            const contains = this.element.classList.contains('ol-hidden');
            if (rotation === 0 || rotation === this.defaultRotation_) {
                if (!contains) {
                    this.element.classList.add('ol-hidden');
                    this.rendered_ = false;
                }
            } else {
                if (contains) {
                    this.element.classList.remove('ol-hidden');
                    this.rendered_ = true;
                }
            }
        }
    }
}
