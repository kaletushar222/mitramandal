import { createApiClient } from './client';

const client = createApiClient('doctracker/');

//get
export function getDocTracker(params) {
    return client.get('/', { params });
}

//put
export function updateDocTracker(updateObject) {
    return client.put('/', updateObject);
}