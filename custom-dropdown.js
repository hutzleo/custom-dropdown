const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            margin-bottom: 20px;
        }

        .drop-btn {
            background-color: #3498DB;
            color: white;
            padding: 16px;
            font-size: 16px;
            border: none;
            cursor: pointer;
        }

        .drop-btn:hover, .drop-btn:focus {
            background-color: #2980B9;
        }

        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
        }

        ::slotted(option) {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            cursor: pointer;
        }

        ::slotted(option:hover) {
            background-color: #ddd;
        }

        .show {
            display: block;
        }

        .selected {
            display: block;
        }
    </style>
    <div class="dropdown">
        <button id="toggleBtn" class="drop-btn">Dropdown</button>
        <div id="dropdownContent" class="dropdown-content">
            <slot></slot>
        </div>
    </div>
    <div id='selected' class='selected'></div>
`;

const optionTagName = 'OPTION';

class CustomDropdown extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
        this._dropdownContent = shadowRoot.getElementById('dropdownContent');
        this._slot = shadowRoot.querySelector('slot');
        this._selected = shadowRoot.getElementById('selected');
    }

    connectedCallback() {
        this.addEventListener('click', this._toggleDropdown.bind(this));
        this._slot.addEventListener('slotchange', event => {
            this._setOptionsOnClickHandler();
        });
    }

    _toggleDropdown() {
        this._dropdownContent.classList.toggle("show")
    }

    _setOptionsOnClickHandler() {
        this._slot.assignedNodes()
            .filter(node => node.tagName === optionTagName)
            .map(option => {
                option.addEventListener('click', this._onOptionClick.bind(this));
            });
    }

    _onOptionClick(event) {
        this._selected.textContent = `You selected: ${event.target.value}`;
    }
}

window.customElements.define('custom-dropdown', CustomDropdown);