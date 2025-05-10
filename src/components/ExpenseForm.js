import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class ComponentExpenseForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expense : {
                title : "",
                remarks : "",
                amount : 0,
                expenseDate: new Date()
            },
            validated : false,
            show : false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(this.props.expenseSubmitted, prevProps.expenseSubmitted)
        if(this.props.expenseSubmitted && !prevProps.expenseSubmitted){
            this.setState({
                expense : {
                    title : "",
                    remarks : "",
                    amount : 0,
                    expenseDate: new Date()
                },
                validated : false,
                show : false
            })
        }
    }

    handleDateChange = (value) =>{
        const { expense } = this.state
        expense["expenseDate"] = value
        this.setState({
            expense: expense
        })
    }

    handlePendingCheckBox = (event) =>{
        const { expense } = this.state
        expense["isPending"] = event.target.checked
        this.setState({
            expense: expense
        })
    }

    handleExpenseUpdate = (event) =>{
        const { expense } = this.state
        expense[event.target.name] = event.target.value
        this.setState({
            expense: expense
        })
    }

    setShow = (value) => {
        this.setState({show: value});
    }

    handleSubmit = (event) =>{
        const { expense } = this.state
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log("error")
        }
        else{
            console.log("success")
            expense.expenseNo = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // use doc tracker
            this.props.submitExpense(expense)
        }
        this.setState({validated : true})
    }
    // HOW TO make datepicker disabled
    // <DatePicker
    //     selected={ expense.expenseDate }

    //     className="form-control"
    //     customInput={
    //         <Form.Control type="text" disabled id="validationCustom01" />
    //     }
    //     onChange={this.handleDateChange}
    //     disabled
    // />   
    //     <Form.Control type="text" disabled id="validationCustom01" />
    //     <Form.Control type="text" disabled id="validationCustom01" />        
    //     <Form.Control type="text" disabled id="validationCustom01" />
    render() {
        const { expense, validated } = this.state
        return (
            <div>
                <div className='panel'>
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control value={ expense.amount } type="number" placeholder="Amount" min="0" name="amount"  onChange={this.handleExpenseUpdate} required/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <DatePicker
                                        selected={ expense.expenseDate }
                                        className="form-control"
                                        customInput={
                                            <Form.Control type="text" id="validationCustom01" />
                                        }
                                        onChange={this.handleDateChange}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control value={ expense.title } type="text" placeholder="Expense Title" style={{ textTransform : "uppercase" }} name="title"  onChange={this.handleExpenseUpdate} required/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control value={ expense.remarks } type="text" placeholder="Remarks" name="remarks" onChange={this.handleExpenseUpdate}/>
                        </Form.Group>
                        <br/>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ComponentExpenseForm