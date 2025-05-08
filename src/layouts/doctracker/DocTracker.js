
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import {updateDocTracker} from '../../api/DocTrackerApi';
import { getDocTracker } from '../../api/DocTrackerApi';

class DocTracker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            docTrackerObj: {},
            docTrackerUpdated: false
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
                    docTrackerObj: response[0]
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
        console.log("e ---> ", e);
    };
    
    handleSubmit = (e) => {
        const { docTrackerObj } = this.state;
        console.log("e : ", e);
        const that = this
        updateDocTracker(docTrackerObj)
            .then((response) => {
                console.log(response);
                that.setState({
                    docTrackerUpdated: true,
                    showToast: true,
                    toastMessage: "Doc tracker updated"
                })
                setTimeout(function(){
                    that.setState({
                        docTrackerUpdated: false
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

    render(){
        const { docTrackerObj, validated } = this.state;
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
                                        <Form.Control value={ docTrackerObj.expenseNo } type="number" placeholder="Invoice No" name="invoiceno" onChange={this.handleDocTrackerUpdate}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Expense No</Form.Label>
                                        <Form.Control value={ docTrackerObj.expenseNo } type="number" placeholder="Expense No" name="expenseno" onChange={this.handleDocTrackerUpdate}/>
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
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
            </div>
        )
    }
}

export default DocTracker;