import * as config from "./config.js";
import { Store } from "./store.js";
import { Tables } from "./tables.js";
import { Table } from "./table.js";
import { TableListener } from "./tablelistener.js";
import { Player } from "./player.js";
import { Lobby } from "./lobby.js";

const BUCKET = 'axOvHLJieLQEvQ-642ng_NQnsNbJENxN';
const STORE = 'https://tanraku.de/kvs/store/v1';

async function startup() {
    const store = new Store(config.STORE, config.BUCKET);
    const tables = new Tables(store);
    console.log(await tables.list());
    const table = (await tables.list())[0];

    const player = new Player(document.querySelector("#player"));


    document.querySelector("#show").addEventListener('click', () => { table.show(); });
    document.querySelector("#clear").addEventListener('click', () => { table.clear(); });
    document.querySelector('#estimate_0_5').addEventListener('click', () => { estimate(table, player, 0.5); });

    // const tablelistener = new TableListener(table, console.log);


    const lobby_elem = document.querySelector("#lobby");
    new Lobby(lobby_elem, store);
}

async function estimate(table, player, estimation) {
    await table.estimate(player.name, estimation);
}

window.addEventListener("load", () => {
    startup();
})