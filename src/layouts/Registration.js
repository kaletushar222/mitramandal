import React from 'react';
import ComponentRegistrationForm from '../components/RegistrationForm';
import {registerGroup} from '../api/GroupApi';
import './Registration.css'

class CreateInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
            registrationSubmitted: false,
            toastMessage: ''
        }
    }
    setShow = (value) => {
        this.setState({ show: value });
    }
    submitGroupRegistration = (registrationObj) => {
        console.log(registrationObj)
        const that = this
        // Before calling API, ensure members have initial password and basic flags
        try{
            if(registrationObj.members && registrationObj.members.length){
                registrationObj.members = registrationObj.members.map((m, idx)=>{
                    return {
                        id: m.id || idx+1,
                        name: m.name,
                        contact: m.contact,
                        role: m.role,
                        password: 'admin123', // initial password
                        enabled: true,
                        removed: false
                    }
                })
            }

            // ensure chief is present in members; if not, add chief as a member
            const chiefContact = registrationObj.chiefPersonContact;
            const chiefName = registrationObj.chiefPersonName;
            const hasChief = (registrationObj.members || []).some(m => m.contact === chiefContact);
            if(!hasChief && chiefContact){
                registrationObj.members = registrationObj.members || [];
                registrationObj.members.unshift({
                    id: (registrationObj.members.length? registrationObj.members[0].id + 1 : 1),
                    name: chiefName || 'Chief',
                    contact: chiefContact,
                    role: 'chief',
                    password: 'admin123',
                    enabled: true,
                    removed: false
                })
            }

            // add an id for the group for localStorage indexing
            registrationObj.id = registrationObj.id || ('g_'+ new Date().getTime());

            // Save to localStorage (local-first approach). Also attempt API call but don't block on it.
            const groupsJson = localStorage.getItem('mitramandal_groups');
            const groups = groupsJson ? JSON.parse(groupsJson) : [];
            groups.push(registrationObj);
            localStorage.setItem('mitramandal_groups', JSON.stringify(groups));

            // call backend API but don't fail registration if API is down
            registerGroup(registrationObj)
                .then((response) => {
                    console.log('Group registered on server')
                })
                .catch((err)=>{
                    console.log('Server registerGroup failed', err)
                })

            that.setState({
                registrationSubmitted: true,
                showToast: true,
                toastMessage: "Group Registered Successfully"
            })
            // redirect to login after brief delay (even if server API failed)
            setTimeout(function(){
                that.setState({ invoiceSubmitted: false })
                // navigate to login page
                try{ window.location.href = '/mitramandal/login'; } catch(e){ console.log(e) }
            }, 1200);

        }
        catch(err){
            console.log(err)
            that.setState({
                showToast: true,
                toastMessage: "Failed to create group"
            })
        }
    }
    render() {
        return (
            <div className="custom-container layout-container">
                {/* Toast */}
                <div className='registration'>
                    <ComponentRegistrationForm submitGroupRegistration={this.submitGroupRegistration} />
                </div>
            </div>
        );
    }
}

export default CreateInvoice