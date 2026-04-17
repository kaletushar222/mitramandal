import { createApiClient } from './client';

const client = createApiClient('group/');

//get
export function getGroup(params) {
    return client.get('/', { params });
}

//post
export function registerGroup(data){
    return client.post('/create', data);
};

//put
export function updateGroup(id, updateObject) {
    return client.put(`/${id}`, updateObject);
}