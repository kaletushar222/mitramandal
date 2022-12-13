import * as axios from "axios";
// import { getCookie } from "./utils";

function init(){
    //this.api_token = getCookie("ACCESS_TOKEN");

    let headers = {
        Accept: "application/json",
    };

    // if (this.api_token) {
    //     headers.Authorization = `Bearer ${this.api_token}`;
    // }

    let client = axios.create({
        baseURL: process.env.REACT_APP_API_ENDPOINT+ "invoice/",
        timeout: 31000,
        headers: headers,
    });
    return client;
}

//get
export function getGroup(params) {
    return init().get("/", { params: params });
}

//post
export function registerGroup(data){
    console.log(data)
    return init().post("/create", data);
};

//put
export function updateGroup(id, updateObject) {
    return init().put(`/${id}`, updateObject);
}