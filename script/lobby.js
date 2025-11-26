import { Store } from "./store.js";
import { Tables } from "./tables.js";

export class Lobby {

    /** @type {Node} */
    #elem

    /** @type {Tables} */
    #tables

    #callback

    constructor (elem, store, callback) {
        this.#elem = elem;
        this.#tables = new Tables(store);
        this.#callback = callback;

        this.#show_lobby();
    }

    async #show_lobby() {
        this.#elem.innerHTML = "";
        this.#elem.classList.remove("hidden");
        
        const new_table_elem = document.createElement("div");
        this.#elem.appendChild(new_table_elem);
        new_table_elem.classList.add("new");
        new_table_elem.addEventListener('click', () => {
            this.#add_table();
        });

        const new_table_icon = document.createElement("div");
        new_table_elem.appendChild(new_table_icon);
        new_table_icon.textContent = '\u2739';
        new_table_icon.classList.add("icon");

        const new_table_name = document.createElement("div");
        new_table_elem.appendChild(new_table_name);
        new_table_name.textContent = '<NEW>';
        new_table_name.classList.add("name");

        const tables = await this.#tables.list();
        for(const table of tables) {
            const table_elem = document.createElement("div");
            this.#elem.appendChild(table_elem);
            table_elem.classList.add("poker_table");
            table_elem.addEventListener('click', () => {
                this.#join_table(table);
            });

            const remove_elem = document.createElement("div");
            table_elem.appendChild(remove_elem);
            remove_elem.textContent = '\u2716';
            remove_elem.classList.add("remove");
            remove_elem.addEventListener('click', (e) => {
                this.#remove_table(table);
                e.stopPropagation();
            });

            const icon_elem = document.createElement("div");
            table_elem.appendChild(icon_elem);
            icon_elem.textContent = '\u{1F0DF}'
            icon_elem.classList.add('icon');

            const status = await table.status();
            const name_elem = document.createElement("div");
            table_elem.appendChild(name_elem);
            name_elem.textContent = status.name || table.id;
            name_elem.classList.add("name");
        }
    }

    async #add_table() {
        try {
            const table = await this.#tables.new();
            await this.#show_lobby();
            this.#join_table(table);
        }
        catch (err) {
            console.error(err);
        }
    }

    async #join_table(table) {
        this.#callback(table);
    }

    async #remove_table(table) {
        await table.remove();
        this.#show_lobby();
    }

}