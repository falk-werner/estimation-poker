export class Player {

    /** @type {Node} */
    #element;

    constructor (element) {
        this.#element = element;
        this.#element.value = window.localStorage.getItem("Player") || "John Doe";

        this.#element.addEventListener("input", () => { this.#on_name_change(); });
    }

    #on_name_change() {
        window.localStorage.setItem("Player", this.#element.value);
    }

    get name() {
        return this.#element.value;
    }
}