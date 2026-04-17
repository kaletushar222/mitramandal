import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { getExpense, updateExpense } from '../../api/ExpenseApi';
import CsvDownload from 'react-json-to-csv';
import moment from 'moment';
import utils from '../../utils/utils';
import { getInvoice } from '../../api/InvoiceApi';

class Expense extends React.Component {

    //lifecycle methods
    componentDidMount(){
        this.getInvoices();
        this.getExpenses();
        try{ window.addEventListener('mitramandal_expenses_updated', this.handleExpensesUpdated); } catch(e){}
    }

    componentWillUnmount(){
        try{ window.removeEventListener('mitramandal_expenses_updated', this.handleExpensesUpdated); } catch(e){}
    }

    handleExpensesUpdated = (e) => {
        this.getExpenses();
    }
    

    //api calls
    getExpenses = () =>{
        const that = this
        console.log("that : ",that);
        try{
            const userJson = localStorage.getItem('mitramandal_user');
            const user = userJson ? JSON.parse(userJson) : null;
            const key = 'mitramandal_expenses_' + (user && user.groupId ? user.groupId : 'global');
            const stored = localStorage.getItem(key);
            const arr = stored ? JSON.parse(stored) : [];
            const normalizedLocal = utils.normalizeRecords(arr, { groupId: user ? user.groupId : null, groupName: user ? user.groupName : null });
            that.props.setExpenses(normalizedLocal);
            if(user && user.groupId){
                getExpense({ groupId: user.groupId })
                    .then((response)=>{
                        if(Array.isArray(response.data)){
                            const normalizedServer = utils.normalizeRecords(response.data, { groupId: user.groupId, groupName: user.groupName });
                            if(normalizedServer.length){
                                that.props.setExpenses(normalizedServer);
                                try{ localStorage.setItem(key, JSON.stringify(normalizedServer)); } catch(e){}
                            }
                        }
                    })
                    .catch((err)=> console.log('getExpense server failed', err));
            }
        }
        catch(err){
            console.log(err);
            that.setState({ showToast: true, toastMessage: 'Error in fetching data' });
        }
    }

    deleteExpense = (expense) =>{
        const that = this
        let updateObject = { status: "DELETED" };
        if (window.confirm("DELETE : "+expense.title +'-> '+ expense.expenseNo)) {
            updateExpense(expense.id, updateObject)
                .then((response) => {
                    that.getExpenses();
                })    
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    revertDeleteExpense = (expense) => {
        const that = this
        let updateObject = { status: "ACTIVE" }
        if (window.confirm("Revert Delete : "+expense.title +'-> '+ expense.expenseNo)) {
            updateExpense(expense.id, updateObject)
                .then((response) => {
                    that.getExpenses();
                })    
                .catch((err) => {
                    console.log(err)
                });
        }
    }

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
                    .catch((err)=>{
                        console.log(err);
                        that.setState({ showToast: true, toastMessage: 'Error in fetching data' })
                    });
            }
        }
        catch(err){
            console.log(err);
        }
    }

    render() {
        const { expenses, invoices } = this.props;
        //getting invoices as undefined how to get results in invoices
        console.log("invoices : ", invoices);
        console.log("expenses : ", expenses);
        if (invoices === undefined || invoices.length === 0){
            console.log("invoices is undefined or empty");
            return (
                <div className='custom-container income-layout'>
                    <h4>Loading...</h4>
                </div>
            );
        }
        if (expenses === undefined || expenses.length === 0){
            console.log("expenses is undefined or empty");
            return (
                <div className='custom-container income-layout'>
                    <h4>Loading...</h4>
                </div>
            );
        }
        


        let amountSpent = 0;
        let amountRemaining = 0;
        console.log(expenses);

        expenses.forEach((exp)=>{
            if(!exp) return;
            const status = exp.status || 'ACTIVE';
            if(status === "ACTIVE"){
                const amt = Number(exp.amount) || 0;
                amountSpent = amountSpent + amt;
            }
        })

        let amountReceived = 0;

        if (invoices && invoices.length > 0 ){
            invoices.forEach((inv)=>{
                if(inv.status === "ACTIVE"){
                        const amt = Number(inv.amount) || 0;
                        const isPending = (inv.isPending === true) || (String(inv.isPending) === 'true');
                        if(!isPending){
                            amountReceived = amountReceived + amt;
                        }
                    }
            })
        }


        amountReceived = Math.round(amountReceived);
        amountSpent = Math.round(amountSpent);
        amountRemaining = amountReceived - amountSpent;

        console.log("expenses :------------> ", expenses);
        console.log("state : ----->  ", this.state)
        console.log("props : --------------> ", this.props);
        console.log("invoices : --------------> ", invoices);
        return (
            <div className='custom-container income-layout'>
                <CsvDownload className='download-button' data={expenses} ><i className="bi bi-download"></i> Download</CsvDownload>
                <br/><br/>
                    <div className='box'>
                        <div style={{padding: "1%"}}>
                            <b>Received</b>:  <span className='green-text'> {  utils.formatINR(amountReceived) }</span> 
                            <b style={{marginLeft: "2%"}}>Spent</b>: <span className='red-text' > { utils.formatINR(amountSpent) } </span> 
                            <b style={{marginLeft: "2%"}}>Remaining</b>:  <span className='blue-text'> { utils.formatINR(amountRemaining) }</span> 
                        </div>
                    </div>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Expense No</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Expense Status</th>
                            <th>Remarks</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses.map((expense, key) =>{
                                return <tr key={key}>
                                        <td>{key+1}</td>
                                        <td>{ expense.expenseNo }</td>
                                        <td>{expense.title}</td>
                                        <td>{moment(expense.expenseDate).format("DD/MM/YYYY LT")}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.status}</td>
                                        <td>{expense.remarks}</td>
                                        
                                        <td>
                                            <center>
                                                {
                                                    expense.status === "DELETED" ?
                                                        <Button variant="secondary" onClick={ ()=>this.revertDeleteExpense(expense) }><i className="bi bi-arrow-counterclockwise"></i></Button>
                                                    :
                                                        <Button variant="danger" onClick={ ()=>this.deleteExpense(expense) }><i className="bi bi-trash"></i></Button>
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

export default Expense