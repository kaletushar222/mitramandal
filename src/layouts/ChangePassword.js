import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../actions/authActions';

const ChangePassword = () => {
    const user = useSelector(s=>s.authReducer.currentUser);
    const dispatch = useDispatch();
    const [current, setCurrent] = useState('');
    const [newPass, setNewPass] = useState('');
    const [msg, setMsg] = useState('');

    if(!user) return (<div className='custom-container layout-container'><br/><br/><br/>Please login</div>);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(current !== user.password){ setMsg('Current password is incorrect'); return; }
        // update localStorage
        const groupsJson = localStorage.getItem('mitramandal_groups');
        const groups = groupsJson ? JSON.parse(groupsJson) : [];
        const gidx = groups.findIndex(g => g.id === user.groupId || g.groupName === user.groupName);
        if(gidx < 0){ setMsg('Group not found'); return; }
        const members = groups[gidx].members.map(m => m.contact === user.contact ? { ...m, password: newPass } : m);
        groups[gidx].members = members;
        localStorage.setItem('mitramandal_groups', JSON.stringify(groups));
        const updatedUser = { ...user, password: newPass };
        localStorage.setItem('mitramandal_user', JSON.stringify(updatedUser));
        dispatch(loginSuccess(updatedUser));
        setMsg('Password changed successfully');
        setCurrent(''); setNewPass('');
    }

    return (
        <div className='custom-container layout-container'>
            <br/><br/><br/>
            <h3>Change Password</h3>
            <form onSubmit={handleSubmit} style={{maxWidth:400}}>
                <div className='form-group'>
                    <label>Current password</label>
                    <input className='form-control' type='password' value={current} onChange={e=>setCurrent(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>New password</label>
                    <input className='form-control' type='password' value={newPass} onChange={e=>setNewPass(e.target.value)} required />
                </div>
                <br/>
                <button className='btn btn-primary' type='submit'>Change</button>
                { msg && <div className='mt-3'>{msg}</div> }
            </form>
        </div>
    )
}

export default ChangePassword;
