import { createApiClient } from './client';

const client = createApiClient('invoice/');

//get
export function getInvoice(params) {
    return client.get('/', { params });
}

//post
export function createInvoice(data){
    return client.post('/create', data);
};

//put
export function updateInvoice(id, updateObject) {
    return client.put(`/${id}`, updateObject);
}