import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import {createExpense} from '../../api/ExpenseApi';
import ComponentExpenseForm from '../../components/ExpenseForm';
import utils from '../../utils/utils';

class CreateExpense extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showToast: false,
            expenseSubmitted: false,
            toastMessage: ''
        }
    }
    setShow = (value) => {
        this.setState({show: value});
    }
    submitExpense =(expenseObj) =>{
        const that = this
        try{
            const userJson = localStorage.getItem('mitramandal_user');
            const user = userJson ? JSON.parse(userJson) : null;
            expenseObj.id = expenseObj.id || ('exp_' + new Date().getTime());
            expenseObj.groupId = user ? user.groupId : null;
            expenseObj.groupName = user ? user.groupName : null;
            expenseObj.createdBy = user ? user.contact : null;
            expenseObj.status = expenseObj.status || 'ACTIVE';
            const key = 'mitramandal_expenses_' + (expenseObj.groupId || 'global');
            const stored = localStorage.getItem(key);
            const arr = stored ? JSON.parse(stored) : [];
            const merged = utils.normalizeRecords([...(arr||[]), expenseObj], { groupId: expenseObj.groupId });
            localStorage.setItem(key, JSON.stringify(merged));

            // notify app that expenses for this group updated so views can refresh
            try{ window.dispatchEvent(new CustomEvent('mitramandal_expenses_updated', { detail: { groupId: expenseObj.groupId } })); } catch(e){}

            createExpense(expenseObj)
                .then((response) => console.log('expense saved to server'))
                .catch((err)=> console.log('server createExpense failed', err));

            that.setState({
                expenseSubmitted: true,
                showToast: true,
                toastMessage: "Expense Created"
            })
            setTimeout(function(){ that.setState({ expenseSubmitted: false }) }, 2000);
        }
        catch(err){
            console.log(err)
            that.setState({ showToast: true, toastMessage: 'Failed to create expense' })
        }
    }
    render() {
        const { expenseSubmitted, showToast, toastMessage } = this.state
        return (
            <div className="custom-container layout-container">
                {/* Toast */}
                <div className='home'>
                    <ComponentExpenseForm submitExpense={this.submitExpense} expenseSubmitted={this.state.expenseSubmitted} />
                    <br/>
                    <ToastContainer className="p-3" position="top-center">
                        <Toast bg={ expenseSubmitted?"success":"danger"} onClose={() => this.setState({showToast: false})} show={showToast} delay={1800} autohide >
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </div>
            </div>
        );
    }
}

export default CreateExpense