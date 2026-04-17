export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export function loginSuccess(user) {
    return { type: LOGIN_SUCCESS, payload: user };
}

export function loginFailure(message) {
    return { type: LOGIN_FAILURE, payload: message };
}

export function logout() {
    return { type: LOGOUT };
}

// Thunk-like simple helpers (project doesn't use redux-thunk, so use them in components)
export function attemptLogin(contact, password) {
    // sync helper: returns { success, user, message }
    try {
        const groupsJson = localStorage.getItem('mitramandal_groups');
        const groups = groupsJson ? JSON.parse(groupsJson) : [];
        for (let g of groups) {
            if (!g.members) continue;
            for (let m of g.members) {
                if (m.contact === contact && m.password === password) {
                    if (m.removed) return { success: false, message: 'User removed' };
                    if (m.enabled === false) return { success: false, message: 'User disabled' };
                    const user = { ...m, groupId: g.id, groupName: g.groupName, chiefPersonContact: g.chiefPersonContact };
                    localStorage.setItem('mitramandal_user', JSON.stringify(user));
                    return { success: true, user };
                }
            }
        }
        return { success: false, message: 'Invalid credentials' };
    } catch (err) {
        return { success: false, message: 'Login error' };
    }
}
