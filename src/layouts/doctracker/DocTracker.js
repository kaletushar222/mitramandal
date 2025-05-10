
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import {updateDocTracker} from '../../api/DocTrackerApi';
import { getDocTracker } from '../../api/DocTrackerApi';
import { Toast, ToastContainer } from 'react-bootstrap';

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
        getDocTracker()
            .then((response) => {
                that.setState({
                    docTrackerObj: response.data
                })
            })    
            .catch((err) => {
                console.log(err)
                that.setState({
                    showToast: true,
                    toastMessage: "Error in fetching data"
                })
            });
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
                debugger;
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
        debugger;
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