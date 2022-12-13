import React from 'react';
import ComponentRegistrationForm from '../components/RegistrationForm';
import {registerGroup} from '../api/GroupApi';

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
        registerGroup(registrationObj)
            .then((response) => {
                that.setState({
                    registrationSubmitted: true,
                    showToast: true,
                    toastMessage: "Group Registered Successfully"
                })
                setTimeout(function(){
                    that.setState({
                        invoiceSubmitted: false
                    })
                }, 2000);
                
            })    
            .catch((err) => {
                console.log(err)
                that.setState({
                    showToast: true,
                    toastMessage: "Failed to create invoice"
                })
            });
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