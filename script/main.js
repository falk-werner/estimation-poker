import * as config from "./config.js";
import { Store } from "./store.js";
import { Player } from "./player.js";
import { Lobby } from "./lobby.js";
import { TableController } from "./tablecontroller.js";

const BUCKET = 'axOvHLJieLQEvQ-642ng_NQnsNbJENxN';
const STORE = 'https://tanraku.de/kvs/store/v1';

async function startup() {
    const store = new Store(config.STORE, config.BUCKET);
    const player = new Player(document.querySelector("#player"));

    const table_elem = document.querySelector("#table");
    const table_controller = new TableController(table_elem, player);

    const lobby_elem = document.querySelector("#lobby");
    new Lobby(lobby_elem, store, (table) => {
        join_table(table_controller, table);
    });
}

async function join_table(table_controller, table) {
    console.log(`join table ${table.id}`);

    const lobby_elem = document.querySelector("#lobby");
    lobby_elem.classList.add("hidden");

    const table_elem = document.querySelector("#table");
    table_elem.classList.remove("hidden");

    table_controller.set_table(table);
}

window.addEventListener("load", () => {
    startup();
})