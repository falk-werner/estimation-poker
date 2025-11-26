import { Store } from "./store.js";

export class Table {

    /** @type {Store} */
    #store

    /** @type {string} */
    #id

    constructor (store, id) {
        this.#store = store;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    async status() {
        return await this.#store.get_entry(this.#id);
    }
    
    async show() {
        return await this.#store.patch_entry(this.#id, [
            {"op":"add", "path": "/state", "value": "shown"}
        ]);
    }

    async hide() {
        return await this.#store.patch_entry(this.#id, [
            {"op":"add", "path": "/state", "value": "hidden"}
        ]);
    }

    async clear() {
        const table = await this.status();
        table.state = 'hidden';
        for (const player of Object.keys(table.players)) {
            table.players[player] = '-';
        }

        this.#store.set_entry(this.#id, table);
    }

    async estimate(player, value) {
        return await this.#store.patch_entry(this.#id, [
            {"op":"add", "path": `/players/${player}`, "value": value}
        ]);
    }

    async remove() {
        await this.#store.remove_entry(this.#id);
    }

    async setName(value) {
        return await this.#store.patch_entry(this.#id, [
            {"op":"add", "path": "/name", "value": value}
        ]);
    }

    async removePlayer(player) {
        return await this.#store.patch_entry(this.#id, [
            {"op":"remove", "path": `/players/${player}`}
        ]);
    }

}