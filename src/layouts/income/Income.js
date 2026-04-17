import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { getInvoice, updateInvoice } from '../../api/InvoiceApi';
import CsvDownload from 'react-json-to-csv';
import moment from 'moment';
import Invoice from "./Invoice";
import utils from '../../utils/utils';

class Income extends React.Component {

    componentDidMount(){
        this.getInvoices();
        try{ window.addEventListener('mitramandal_invoices_updated', this.handleInvoicesUpdated); } catch(e){}
    }

    componentWillUnmount(){
        try{ window.removeEventListener('mitramandal_invoices_updated', this.handleInvoicesUpdated); } catch(e){}
    }

    handleInvoicesUpdated = () => this.getInvoices();

    getInvoices = () =>{
        const that = this;
        try{
            const userJson = localStorage.getItem('mitramandal_user');
            const user = userJson ? JSON.parse(userJson) : null;
            const key = 'mitramandal_invoices_' + (user && user.groupId ? user.groupId : 'global');
            const stored = localStorage.getItem(key);
            const arr = stored ? JSON.parse(stored) : [];
            const normalizedLocal = utils.normalizeRecords(arr, { groupId: user ? user.groupId : null, groupName: user ? user.groupName : null });
            that.props.setInvoices(normalizedLocal);

            if(user && user.groupId){
                getInvoice({ groupId: user.groupId })
                    .then((response)=>{
                        if(Array.isArray(response.data)){
                            const normalizedServer = utils.normalizeRecords(response.data, { groupId: user.groupId, groupName: user.groupName });
                            if(normalizedServer.length){
                                that.props.setInvoices(normalizedServer);
                                try{ localStorage.setItem(key, JSON.stringify(normalizedServer)); } catch(e){}
                            }
                        }
                    })
                    .catch((err)=> console.log('getInvoice server failed', err));
            }
        }
        catch(err){
            console.log(err);
            this.setState({ showToast: true, toastMessage: 'Error in fetching data' })
        }
    }

    deleteInvoice = (invoice) =>{
        const that = this;
        let updateObject = { status: "DELETED" };
        if (window.confirm("DELETE : "+invoice.contributerName +'-> '+ invoice.invoiceNo)) {
            updateInvoice(invoice.id, updateObject)
                .then((response) => { that.getInvoices() })
                .catch((err) => { console.log(err) });
        }
    }

    revertDelete = (invoice) => {
        const that = this;
        let updateObject = { status: "ACTIVE" };
        if (window.confirm("Revert Delete : "+invoice.contributerName +'-> '+ invoice.invoiceNo)) {
            updateInvoice(invoice.id, updateObject)
                .then((response) => { that.getInvoices() })
                .catch((err) => { console.log(err) });
        }
    }

    render() {
        const { invoices } = this.props;
        let amountReceived = 0;
        let amountPending = 0;
        let amountTotal = 0;

        (invoices||[]).forEach((inv)=>{
            if(!inv) return;
            const status = inv.status || 'ACTIVE';
            if(status === "ACTIVE"){
                const amt = Number(inv.amount) || 0;
                const isPending = (inv.isPending === true) || (String(inv.isPending) === 'true') || (String(inv.isPending) === '1');
                if(isPending){ amountPending += amt; }
                else{ amountReceived += amt; }
            }
        })

        amountPending = Math.round(Number(amountPending) || 0);
        amountReceived = Math.round(Number(amountReceived) || 0);
        amountTotal = amountPending + amountReceived;

        return (
            <div className='custom-container income-layout'>
                <CsvDownload className='download-button' data={invoices || []} ><i className="bi bi-download"></i> Download</CsvDownload>
                <br/><br/>
                <div className='box'>
                    <div style={{padding: "1%"}}>
                        <b>Received</b>:  <span className='green-text'> { utils.formatINR(amountReceived) }</span>
                        <b style={{marginLeft: "2%"}}>Pending</b>: <span className="red-text"> { utils.formatINR(amountPending)} </span>
                        <b style={{marginLeft: "2%"}}>Total</b>: <span className='blue-text' > { utils.formatINR(amountTotal)} </span>
                    </div>
                </div>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Invoice No.</th>
                            <th>View Invoice</th>
                            <th>Contibuters Name</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Invoice Status</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (invoices||[]).map((invoice, key) =>{
                                return <tr key={key}>
                                        <td>{key+1}</td>
                                        <td>{moment(invoice.invoiceDate).format("DD/MM/YYYY LT")}</td>
                                        <td>{invoice.invoiceNo}</td>
                                        <td><Invoice invoice={ invoice } /></td>
                                        <td>{invoice.contributerName}</td>
                                        <td>{invoice.contributorType}</td>
                                        <td>{invoice.amount}</td>
                                        <td>{invoice.isPending? "Pending" : "Received"}</td>
                                        <td>{invoice.remarks}</td>
                                        <td>{invoice.status}</td>
                                        <td>
                                            <center>
                                                {
                                                    invoice.status === "DELETED" ?
                                                        <Button variant="secondary" onClick={ ()=>this.revertDelete(invoice) }><i className="bi bi-arrow-counterclockwise"></i></Button>
                                                    :
                                                        <Button variant="danger" onClick={ ()=>this.deleteInvoice(invoice) }><i className="bi bi-trash"></i></Button>
                                                }
                                            </center>
                                        </td>
                                    </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Income;