import "@pnp/polyfill-ie11";
import { sp } from '@pnp/sp/presets/all';
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PageContext } from '@microsoft/sp-page-context';

export class service {
    constructor(context: WebPartContext, mypagecontext: PageContext) {
        sp.setup({
            spfxContext: context,
            sp: {
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            },
            ie11: false
        });
    }
    public async getAllrecords(listname: string): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getAll().then((items) => {
                resolve(items);
            });
        });
    }

    public async getItemById(listname: string, ID: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getById(Number(ID)).get().then((item) => {
                resolve(item);
            });
        });
    }

    public async filterItems(listname: string, selectFields: string[]): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.select(selectFields.toString()).getAll().then((items) => {
                resolve(items);
            });
        });
    }
    public async createItem(listname: string, values: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.add(values).then(() => { resolve(); });
        });
    }

    public async updateItem(listname: string, values: any, id: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getById(Number(id)).update(values).then(() => { resolve(); });
        });

    }
    public async deleteItem(listname: string, ID: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getById(Number(ID)).delete().then(() => { resolve(); });
        });
    }
    public async getAllGroups(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.siteGroups().then((result) => { resolve(result); });
        });
    }
    public async getCurrentUserGroups(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.currentUser.groups().then((result) => { resolve(result); });
        });
    }

}

