import { Store } from "./store.js";
import { Table } from "./table.js";

/**
 * @returns {string}
 */
function generate_id() {
    const id = '' + Math.floor(Math.random() * 1000);
    return 'T' + id.padStart(3, '0'); 
}


export class Tables {

    /** @type {Store} */ 
    #store

    constructor (store) {
        this.#store = store;
    }

    /**
     * 
     * @param {string} id 
     * @param {string} data 
     * @returns {boolean}
     */
    #is_valid(id, data) {
        try {
            if (! id.match(/^T[0-9]{3}$/)) {
                return false;
            }

            const entry = JSON.parse(data);
            if (!(typeof(entry["state"]) === "string") ) {
                return false;
            }
            if (!(typeof(entry["players"]) === "object") ) {
                return false;
            }

            return true;
        }
        catch (err) {
            console.warn(err);
            return false;
        }
    }

    /**
     * @returns {Table[]}
     */
    async list() {
        let tables = [];
        try {
            const resp = await this.#store.get_all();
            for (const [id, data] of Object.entries(resp)) {
                const is_valid = this.#is_valid(id, data);
                if (is_valid) {
                    tables.push(new Table(this.#store, id));
                }
                else {
                    this.#store.remove_entry(id);
                }
            }
        }
        catch (err) {
            console.error(err);
            tables = [];
        }

        return tables;
    }

    /**
     * @returns {Table}
     */
    async new() {
        const tables = await this.list();
        const table_map = {};
        for(const table of tables) {
            table_map[table.id] = table;
        }

        let id = generate_id();
        while (table_map.hasOwnProperty(id)) {
            id = generate_id();
        }

        await this.#store.set_entry(id, {state: "hidden", players: {}});
        return new Table(this.#store, id);
    }
}