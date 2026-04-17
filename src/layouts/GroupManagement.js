import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AddMemberForm = ({ group, updateLocalGroup })=>{
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [role, setRole] = useState('');
    const [msg, setMsg] = useState('');

    const handleAdd = ()=>{
        if(!contact) { setMsg('Contact is required'); return; }
        const exists = (group.members||[]).some(m=>m.contact === contact);
        if(exists){ setMsg('Member with this contact already exists'); return; }
        const id = (group.members && group.members.length) ? (Math.max(...group.members.map(m=>m.id||0))+1) : 1;
        const newMember = { id, name, contact, role, password: 'admin123', enabled: true, removed: false };
        const updated = { ...group, members: [...(group.members||[]), newMember] };
        updateLocalGroup(updated);
        setName(''); setContact(''); setRole(''); setMsg('Member added');
    }

    return (
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input className='form-control' placeholder='Name' value={name} onChange={e=>setName(e.target.value)} style={{maxWidth:200}} />
            <input className='form-control' placeholder='Contact' value={contact} onChange={e=>setContact(e.target.value)} style={{maxWidth:200}} />
            <input className='form-control' placeholder='Role' value={role} onChange={e=>setRole(e.target.value)} style={{maxWidth:150}} />
            <button className='btn btn-primary' onClick={handleAdd}>Add</button>
            { msg && <span style={{marginLeft:10}}>{msg}</span> }
        </div>
    )
}

const GroupManagement = () => {
    const user = useSelector(s=>s.authReducer.currentUser);
    const [group, setGroup] = useState(null);

    useEffect(()=>{
        if(!user) return;
        const groupsJson = localStorage.getItem('mitramandal_groups');
        const groups = groupsJson ? JSON.parse(groupsJson) : [];
        const g = groups.find(x => (x.id === user.groupId || x.groupName === user.groupName || x.chiefPersonContact === user.chiefPersonContact));
        setGroup(g || null);
    }, [user]);

    const updateLocalGroup = (updated) => {
        const groupsJson = localStorage.getItem('mitramandal_groups');
        const groups = groupsJson ? JSON.parse(groupsJson) : [];
        const idx = groups.findIndex(x => x.id === updated.id);
        if(idx >= 0){ groups[idx] = updated; localStorage.setItem('mitramandal_groups', JSON.stringify(groups)); setGroup(updated); }
    }

    const toggleMember = (m) => {
        if(!group) return;
        if(user.contact !== group.chiefPersonContact){ alert('Only chief can perform this action'); return; }
        const updated = { ...group, members: group.members.map(mem => mem.contact === m.contact ? { ...mem, enabled: !mem.enabled } : mem) };
        updateLocalGroup(updated);
    }

    const removeMember = (m) => {
        if(!group) return;
        if(user.contact !== group.chiefPersonContact){ alert('Only chief can perform this action'); return; }
        const updated = { ...group, members: group.members.map(mem => mem.contact === m.contact ? { ...mem, removed: true, enabled: false } : mem) };
        updateLocalGroup(updated);
    }

    if(!user) return (<div className='custom-container layout-container'><br/><br/><br/><p>Please login to manage group.</p></div>);
    if(!group) return (<div className='custom-container layout-container'><br/><br/><br/><p>No group found for your account.</p></div>);

    return (
        <div className='custom-container layout-container'>
            <br/><br/><br/>
            <h3>Manage Group: {group.groupName}</h3>
            <p>Chief: {group.chiefPersonName} ({group.chiefPersonContact})</p>
            { user.contact === group.chiefPersonContact && (
                <div style={{marginBottom:20}}>
                    <h5>Add member</h5>
                    <AddMemberForm group={group} updateLocalGroup={updateLocalGroup} />
                </div>
            ) }
            <table className='table'>
                <thead><tr><th>Name</th><th>Contact</th><th>Role</th><th>Enabled</th><th>Removed</th><th>Actions</th></tr></thead>
                <tbody>
                    { group.members.map(m=> (
                        <tr key={m.contact}>
                            <td>{m.name}</td>
                            <td>{m.contact}</td>
                            <td>{m.role}</td>
                            <td>{m.enabled ? 'Yes' : 'No'}</td>
                            <td>{m.removed ? 'Yes' : 'No'}</td>
                            <td>
                                <button className='btn btn-sm btn-secondary' onClick={()=>toggleMember(m)}>Toggle Enable</button>
                                &nbsp;
                                <button className='btn btn-sm btn-danger' onClick={()=>removeMember(m)}>Remove</button>
                            </td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    )
}

export default GroupManagement;
