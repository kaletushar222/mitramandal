import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import {createInvoice} from '../api/InvoiceApi';
import ComponentInvoiceForm from '../components/InvoiceForm';

class CreateInvoice extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showToast: false,
            invoiceSubmitted: false,
            toastMessage: ''
        }
    }
    setShow = (value) => {
        this.setState({show: value});
    }
    submitInvoice =(invoiceObj) =>{
        const that = this
        createInvoice(invoiceObj)
            .then((response) => {
                that.setState({
                    invoiceSubmitted: true,
                    showToast: true,
                    toastMessage: "Invoice Created"
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
        const { invoiceSubmitted, showToast, toastMessage } = this.state
        return (
            <div className="custom-container layout-container">
                {/* Toast */}
                <div className='home'>
                    <ComponentInvoiceForm  submitInvoice={this.submitInvoice} invoiceSubmitted={this.state.invoiceSubmitted} />
                    <br/>
                    <ToastContainer className="p-3" position="top-center">
                        <Toast bg={ invoiceSubmitted?"success":"danger"} onClose={() => this.setState({showToast: false})} show={showToast} delay={1800} autohide >
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </div>
            </div>
        );
    }
}

export default CreateInvoice