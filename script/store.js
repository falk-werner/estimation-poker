
export class Store {

    constructor(url, bucket) {
        this.url = url;
        this.bucket = bucket;
    }

    async get_all() {
        const resp = await fetch(`${this.url}/bucket/${this.bucket}`);
        return resp.json();
    }

    async get_entry(entry) {
        const resp = await fetch(`${this.url}/bucket/${this.bucket}/entry/${entry}`);
        return resp.json();
    }

    async remove_entry(entry) {
        try {
            await fetch(`${this.url}/bucket/${this.bucket}/entry/${entry}`, {method: 'DELETE'});
        }
        catch (ex) {
            console.warn(ex);
        }
    }

    async set_entry(entry, value) {
        await fetch(`${this.url}/bucket/${this.bucket}/entry/${entry}`, {
            method: 'POST',
            body: JSON.stringify(value)
        });
    }

    async patch_entry(entry, patch) {
        console.log(patch);
        const resp = await fetch(`${this.url}/bucket/${this.bucket}/entry/${entry}`, {
            method: "PATCH",
            headers: new Headers({
                'Content-Type': 'application/json-patch+json'
            }),
            body: JSON.stringify(patch)
        });
        const content = await resp.text();
        return content;
    }
    

}