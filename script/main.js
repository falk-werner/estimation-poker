import * as config from "./config.js";
import { Store } from "./store.js";
import { Player } from "./player.js";
import { Lobby } from "./lobby.js";
import { Tables } from "./tables.js";
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

    const params = new URLSearchParams(window.location.search);
    if (params.has("table")) {
        const name_or_id = params.get("table");
        const tables = await (new Tables(store)).list();
        for(const table of tables) {
            console.log(table);
            if (table.id == name_or_id) {
                join_table(table_controller, table);
                break;
            }
            const status = await table.status();
            if (status.name == name_or_id) {
                join_table(table_controller, table);
                break;
            }
        }
    }
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