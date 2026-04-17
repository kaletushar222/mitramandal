import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import {createInvoice} from '../../api/InvoiceApi';
import ComponentInvoiceForm from '../../components/InvoiceForm';
import utils from '../../utils/utils';

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
        try{
            const userJson = localStorage.getItem('mitramandal_user');
            const user = userJson ? JSON.parse(userJson) : null;
            // augment invoice with group info and metadata
            invoiceObj.id = invoiceObj.id || ('inv_' + new Date().getTime());
            invoiceObj.groupId = user ? user.groupId : null;
            invoiceObj.groupName = user ? user.groupName : null;
            invoiceObj.createdBy = user ? user.contact : null;
            invoiceObj.status = invoiceObj.status || 'ACTIVE';
            // save to localStorage per-group
            const key = 'mitramandal_invoices_' + (invoiceObj.groupId || 'global');
            const stored = localStorage.getItem(key);
            const arr = stored ? JSON.parse(stored) : [];
            // normalize and dedupe before storing
            const merged = utils.normalizeRecords([...(arr||[]), invoiceObj], { groupId: invoiceObj.groupId });
            localStorage.setItem(key, JSON.stringify(merged));

            // try server call but don't block on it
            createInvoice(invoiceObj)
                .then((response) => {
                    console.log('invoice saved to server')
                })
                .catch((err)=>{
                    console.log('server createInvoice failed', err)
                })

            // notify app that invoices for this group updated so views can refresh
            try{ window.dispatchEvent(new CustomEvent('mitramandal_invoices_updated', { detail: { groupId: invoiceObj.groupId } })); } catch(e){}

            that.setState({
                invoiceSubmitted: true,
                showToast: true,
                toastMessage: "Invoice Created"
            })
            setTimeout(function(){
                that.setState({ invoiceSubmitted: false })
            }, 2000);
        }
        catch(err){
            console.log(err)
            that.setState({ showToast: true, toastMessage: 'Failed to create invoice' })
        }
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