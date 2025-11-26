import { Table } from './table.js';

const INTERVAL = 1000;

export class TableListener {

    /** @type {Table} */
    #table

    #callback

    /** @type {boolean} */
    #active

    constructor (table, callback) {
        this.#table = table;
        this.#callback = callback;
        this.#active = true;

        this.#update();
    }

    stop() {
        this.#active = false;
    }

    async #update() {
        if (!this.#active) {
            return;
        }

        const status = await this.#table.status();
        this.#callback(status);

        window.setTimeout(() => { this.#update() }, INTERVAL);
    }
}