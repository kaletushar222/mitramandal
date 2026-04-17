import { createApiClient } from './client';

const client = createApiClient('expense/');

//get
export function getExpense(params) {
    return client.get('/', { params });
}

//post
export function createExpense(data){
    return client.post('/create', data);
};

//put
export function updateExpense(id, updateObject) {
    return client.put(`/${id}`, updateObject);
}