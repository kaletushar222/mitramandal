import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/authActions';

const initialState = {
    currentUser: (() => {
        try {
            const u = localStorage.getItem('mitramandal_user');
            return u ? JSON.parse(u) : null;
        } catch (e) {
            return null;
        }
    })(),
    error: null
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, currentUser: action.payload, error: null };
        case LOGIN_FAILURE:
            return { ...state, currentUser: null, error: action.payload };
        case LOGOUT:
            try { localStorage.removeItem('mitramandal_user'); } catch (e) {}
            return { ...state, currentUser: null, error: null };
        default:
            return state;
    }
}
