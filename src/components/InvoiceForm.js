import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class ComponentInvoiceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            invoice : {
                invoiceDate : new Date(),
                invoiceNo : "",
                contributerName : "",
                amount : 0,
                isPending : false,
                remarks : "",
                contributorType:"LOCAL",
            },
            validated : false,
            show : false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(this.props.invoiceSubmitted, prevProps.invoiceSubmitted)
        if(this.props.invoiceSubmitted && !prevProps.invoiceSubmitted){
            this.setState({
                invoice : {
                    invoiceDate : new Date(),
                    invoiceNo : "",
                    contributerName : "",
                    amount : 0,
                    isPending : false,
                    remarks : "",
                    contributorType:"LOCAL",
                },
                validated : false,
                show : false
            })
        }
    }

    handleDateChange = (value) =>{
        const { invoice } = this.state
        invoice["invoiceDate"] = value
        this.setState({
            invoice: invoice
        })
    }

    handlePendingCheckBox = (event) =>{
        const { invoice } = this.state
        invoice["isPending"] = event.target.checked
        this.setState({
            invoice: invoice
        })
    }

    handleInvoicUpdate = (event) =>{
        const { invoice } = this.state
        invoice[event.target.name] = event.target.value
        this.setState({
            invoice: invoice
        })
    }

    setShow = (value) => {
        this.setState({show: value});
    }

    handleSubmit = (event) =>{
        const { invoice } = this.state
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log("error")
        }
        else{
            console.log("success")
            this.props.submitInvoice(invoice)
        }
        this.setState({validated : true})
    }
    render() {
        const { invoice, validated } = this.state
        return (
            <div>
                <div className='panel'>
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control value={ invoice.amount } type="number" placeholder="Amount" min="0" name="amount"  onChange={this.handleInvoicUpdate} required/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <DatePicker
                                        selected={ invoice.invoiceDate }
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
                            <Form.Label>Contributers Name</Form.Label>
                            <Form.Control value={ invoice.contributerName } type="text" placeholder="Contributers Name" name="contributerName"  onChange={this.handleInvoicUpdate} required/>
                            <Form.Control.Feedback type="invalid">
                                Please enter a contributers name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Pending" checked={ invoice.isPending } name="isPending"  onChange={this.handlePendingCheckBox}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                inline
                                checked={invoice.contributorType === "LOCAL"}
                                value="LOCAL"
                                label="Local"
                                type="radio"
                                id={`inline-radio-1`}
                                name="contributorType"
                                onChange={this.handleInvoicUpdate}
                            />
                            <Form.Check
                                inline
                                checked={invoice.contributorType === "SHOP"}
                                value="SHOP"
                                label="Shop"
                                type="radio"
                                id={`inline-radio-2`}
                                name="contributorType"
                                onChange={this.handleInvoicUpdate}
                            />
                            <Form.Check
                                inline
                                checked={invoice.contributorType === "POLITICIAN"}
                                value="POLITICIAN"
                                label="Politician"
                                type="radio"
                                id={`inline-radio-3`}
                                name="contributorType"
                                onChange={this.handleInvoicUpdate}
                            />
                            <Form.Check
                                inline
                                checked={invoice.contributorType === "MEMBER"}
                                value="MEMBER"
                                label="Member"
                                type="radio"
                                id={`inline-radio-4`}
                                name="contributorType"
                                onChange={this.handleInvoicUpdate}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group className="mb-3">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control value={ invoice.remarks } type="text" placeholder="Remarks" name="remarks" onChange={this.handleInvoicUpdate}/>
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

export default ComponentInvoiceForm