import { Control } from 'ol/control';
import { Map as OlMap } from 'ol';
import { Group as LayerGroup, Base as BaseLayer } from 'ol/layer';


export class LayersPanel extends Control {
    private container: HTMLElement;
    private panel: HTMLElement;
    private button: HTMLElement;
    private isOpen: boolean = false;

    constructor(opt_options?: any) {
        const options = opt_options || {};

        // Create the button element
        const button = document.createElement('button');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        `;
        button.className = 'layers-panel-button';
        button.setAttribute('aria-label', 'Vis kartlag');
        button.setAttribute('title', 'Vis kartlag');

        // Create the panel element
        const panel = document.createElement('div');
        panel.className = 'layers-panel';
        
        // Create panel header
        const header = document.createElement('div');
        header.className = 'layers-panel-header';
        
        const title = document.createElement('h2');
        title.textContent = 'Lag';
        header.appendChild(title);
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.className = 'layers-panel-close';
        closeButton.setAttribute('aria-label', 'Lukk kartlag');
        header.appendChild(closeButton);
        
        panel.appendChild(header);

        // Create panel content container
        const content = document.createElement('div');
        content.className = 'layers-panel-content';
        panel.appendChild(content);

        // Create container for both button and panel
        const container = document.createElement('div');
        container.className = 'layers-panel-container';
        container.appendChild(button);
        container.appendChild(panel);

        super({
            element: container,
            target: options.target
        });

        this.container = container;
        this.panel = panel;
        this.button = button;

        // Event listeners
        button.addEventListener('click', this.togglePanel.bind(this));
        closeButton.addEventListener('click', this.closePanel.bind(this));
        document.addEventListener('click', (e: MouseEvent) => {
            if (this.isOpen && !this.container.contains(e.target as Node)) {
                this.closePanel();
            }
        });

        // Handle responsive design
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    private handleResize(): void {
        if (window.innerWidth <= 768) {
            this.panel.classList.add('mobile');
        } else {
            this.panel.classList.remove('mobile');
        }
    }

    private togglePanel(): void {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    private openPanel(): void {
        this.isOpen = true;
        this.panel.classList.add('open');
        this.button.classList.add('active');
        this.updateLayers();
    }

    private closePanel(): void {
        this.isOpen = false;
        this.panel.classList.remove('open');
        this.button.classList.remove('active');
    }

    private createLayerItem(layer: BaseLayer): HTMLElement | null {
        const title = layer.get('title');
        if (!title) return null;

        const item = document.createElement('div');
        item.className = 'layer-item';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = layer.getVisible();
        toggle.className = 'layer-toggle';

        const label = document.createElement('label');
        label.className = 'layer-label';
        label.textContent = title;

        toggle.addEventListener('change', () => {
            layer.setVisible(toggle.checked);
        });

        item.appendChild(toggle);
        item.appendChild(label);

        return item;
    }

    private createLayerGroup(group: LayerGroup): HTMLElement | null {
        const title = group.get('title');
        if (!title) return null;

        const section = document.createElement('div');
        section.className = 'layer-group';

        const header = document.createElement('div');
        header.className = 'group-header';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        header.appendChild(titleElement);
        
        section.appendChild(header);

        const content = document.createElement('div');
        content.className = 'group-content';

        const layers = group.getLayers().getArray();
        layers.forEach(layer => {
            if (layer instanceof LayerGroup) {
                const groupElement = this.createLayerGroup(layer);
                if (groupElement) {
                    content.appendChild(groupElement);
                }
            } else {
                const itemElement = this.createLayerItem(layer);
                if (itemElement) {
                    content.appendChild(itemElement);
                }
            }
        });

        // Only return the section if it has any visible layers
        if (content.children.length > 0) {
            section.appendChild(content);
            return section;
        }
        return null;
    }

    private updateLayers(): void {
        const content = this.panel.querySelector('.layers-panel-content');
        if (!content || !this.getMap()) return;

        content.innerHTML = '';
        const map = this.getMap();
        const layers = map.getLayers().getArray();

        layers.forEach(layer => {
            if (layer instanceof LayerGroup) {
                const groupElement = this.createLayerGroup(layer);
                if (groupElement) {
                    content.appendChild(groupElement);
                }
            } else {
                const itemElement = this.createLayerItem(layer);
                if (itemElement) {
                    content.appendChild(itemElement);
                }
            }
        });
    }

    setMap(map: OlMap): void {
        super.setMap(map);
        if (map) {
            this.updateLayers();
            map.getLayers().on('change', () => this.updateLayers());
        }
    }
}
