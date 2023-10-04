import axios from 'axios';

export default class AjaxService {

    static _instance = null;
    
    /**
     * @returns {AjaxService}
     */
    static Instance() {
        if (AjaxService._instance == null) {
            AjaxService._instance = new AjaxService();
        }

        return this._instance;
    }

    async Get(url: string) {
        return await axios.get(url);
        //.then((response) => response.json() );
    }

    async Post(url: string, data: any) {
        console.log("--------- POST")
        return await axios.post(url, data);
    }

    async Put(url: string, data: any) {
        return await axios.put(url, data);
    }

    async Patch(url: string, data: any) {
        return await axios.patch(url, data);
    }

    async Delete(url: string) {
        return await axios.delete(url);
    }

    async Options(url: string) {
        return await axios.options(url);
    }
}