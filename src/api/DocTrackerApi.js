import * as axios from "axios";

function init(){
    let headers = {
        Accept: "application/json",
    };
    let client = axios.create({
        baseURL: process.env.REACT_APP_API_ENDPOINT + "doctracker/",
        timeout: 31000,
        headers: headers,
    });
    return client;
}

//get
export function getDocTracker(params) {
    return init().get("/", { params: params });
}

//put
export function updateDocTracker(updateObject) {
    return init().put(`/`, updateObject);
}