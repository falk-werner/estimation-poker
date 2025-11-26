import { Table } from "./table.js";
import { TableListener } from "./tablelistener.js";
import { Player } from "./player.js";

export class TableController {

    /** @type {Node} */
    #element

    /** @type {Player} */
    #player

    /** @type {Table|null} */
    #table

    /** @type {TableListener} */
    #tableListener

    constructor (element, player) {
        this.#element = element;
        this.#player = player;
        this.#table = null;
        this.#tableListener = null;

        const show_clear_elem = this.#element.querySelector("#show_clear");
        show_clear_elem.addEventListener('click', () => {
            this.#showOrClear();
        });


        const cards = this.#element.querySelector("#cards");
        this.#add_card(cards, "\u00BD");
        this.#add_card(cards, "1");
        this.#add_card(cards, "2");
        this.#add_card(cards, "3");
        this.#add_card(cards, "5");
        this.#add_card(cards, "8");
        this.#add_card(cards, "13");
        this.#add_card(cards, "?");
        this.#add_card(cards, "\u26fe");
    }

    #add_card(parent, value) {
        const div = document.createElement("div");
        parent.appendChild(div);
        div.textContent = value;
        div.addEventListener("click", () => {
            this.#estimate(value);
        })  
    }

    async #estimate(value) {
        if (!this.#table) { return; }

        this.#table.estimate(this.#player.name, value);
    }

    async set_table(table) {
        if (this.#tableListener) {
            this.#tableListener.stop();
        }

        this.#table = table;
        this.#tableListener = new TableListener(table, (status) => {
            this.#update(status);
        });
    }

    async #update(status) {
        const isShown = (status.state === "shown");
        const show_clear_elem = this.#element.querySelector("#show_clear");
        show_clear_elem.textContent = isShown ? "\u27f3" : "\u{1F441}";

        const status_elem = this.#element.querySelector("#status");
        status_elem.innerHTML = "";
        for(const [player, value] of Object.entries(status.players)) {
            const container = document.createElement("div");
            status_elem.appendChild(container);

            const div = document.createElement("div");
            container.appendChild(div);
            if (isShown) {
                div.textContent = value;
            }
            else {
                div.textContent = (value != "-") ? "\u{1F0DF}" : "\u2026";
            }
            div.classList.add("icon");

            const name = document.createElement("div");
            container.appendChild(name);
            name.textContent = player;
            name.classList.add("name");

        }
    }
    
    async #showOrClear() {
        if (!this.#table) { return; }

        const show_clear_elem = this.#element.querySelector("#show_clear");
        if (show_clear_elem.textContent != "\u27f3") {
            this.#table.show();
        }
        else {
            this.#table.clear();
        }

    }
}