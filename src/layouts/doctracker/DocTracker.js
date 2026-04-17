
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import {updateDocTracker} from '../../api/DocTrackerApi';
import { getDocTracker } from '../../api/DocTrackerApi';
import { Toast, ToastContainer } from 'react-bootstrap';

function makeInitial(name){
    if(!name) return '';
    const noSpaces = name.replace(/\s+/g,'');
    const consonants = noSpaces.replace(/[aeiouAEIOU]/g,'').toUpperCase();
    if(consonants.length >= 4) return consonants.substring(0,4);
    const fallback = noSpaces.toUpperCase();
    return (consonants + fallback).substring(0,4);
}

class DocTracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            docTrackerObj: {},
            docTrackerUpdated: false,
            showToast: false,
            toastMessage: ''
        }
    };

    //lifecycle methods
    componentDidMount(){
        this.getDocTrackerData()
    };
    
    //api calls
    getDocTrackerData = () =>{
        const that = this
        try{
            const userJson = localStorage.getItem('mitramandal_user');
            const user = userJson ? JSON.parse(userJson) : null;
            getDocTracker()
                .then((response) => {
                    const data = response.data || {};
                    // compute default initials from group name if not present
                    if((!data.initial || data.initial === '') && user && user.groupName){
                        const name = user.groupName || '';
                        const initials = makeInitial(name);
                        data.initial = initials;
                    }
                    that.setState({ docTrackerObj: data })
                })
                .catch((err) => {
                    // fallback: build default initial from group name
                    console.log(err)
                    const user = JSON.parse(localStorage.getItem('mitramandal_user') || 'null');
                    const data = { invoiceNo: 1, expenseNo: 1, year: new Date().getFullYear() };
                    if(user && user.groupName){ data.initial = makeInitial(user.groupName); }
                    that.setState({ docTrackerObj: data, showToast: true, toastMessage: 'Using local doc tracker default' })
                });
        }
        catch(err){
            console.log(err);
        }
    };
    handleDocTrackerUpdate = (e) => {
        const { docTrackerObj } = this.state;
        console.log("e : ", e);
        docTrackerObj[e.target.name] = e.target.value;
        console.log("docTrackerObj : ", docTrackerObj);
        this.setState({
            docTrackerObj: {...docTrackerObj}
        });

    };
    
    handleSubmit = (e) => {
        e.preventDefault();
        const { docTrackerObj } = this.state;
        console.log("e : ", e);
        const that = this;

        updateDocTracker(docTrackerObj)
            .then((response) => {
                console.log(response);
                that.setState({
                    docTrackerUpdated: true,
                    showToast: true,
                    toastMessage: "Doc tracker updated"
                })
                // setTimeout(function(){
                //     that.setState({
                //         docTrackerUpdated: false
                //     })
                // }, 2000);
                
            })    
            .catch((err) => {
                console.log(err)
                that.setState({
                    showToast: true,
                    toastMessage: "Failed to create invoice"
                })
            });
    }

    render(){
        const { docTrackerObj, validated, showToast, docTrackerUpdated, toastMessage } = this.state;
        return (
            <div>
                    <br/><br/><br/><br/><br/><br/>
                    <Row>
                        <Col></Col>
                        <Col>
                            <div className='panel'>
                                <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Initial</Form.Label>
                                        <Form.Control value={ docTrackerObj.initial } type="text" placeholder="Initial" name="initial" onChange={this.handleDocTrackerUpdate}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control value={ docTrackerObj.invoiceNo } type="number" placeholder="Invoice No" name="invoiceNo" onChange={this.handleDocTrackerUpdate}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Expense No</Form.Label>
                                        <Form.Control value={ docTrackerObj.expenseNo } type="number" placeholder="Expense No" name="expenseNo" onChange={this.handleDocTrackerUpdate}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Year</Form.Label>
                                        <Form.Control value={ docTrackerObj.year } type="number" placeholder="Year" name="year" onChange={this.handleDocTrackerUpdate}/>
                                    </Form.Group>
                                    <br/>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    <br/>
                                </Form>
                                <ToastContainer className="p-3" position="top-center">
                                    <Toast bg={ docTrackerUpdated ? "success" : "danger" } onClose={() => this.setState({showToast: false})} show={showToast} delay={1800} autohide >
                                        <Toast.Body>{toastMessage}</Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
            </div>
        )
    }
}

export default DocTracker;