import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class ComponentRegistrationForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formObject : {
                registrationDate : new Date(),
                address : "",
                groupName : "",
                chiefPersonName : "",
                chiefPersonContact : "",
                description : "",
                members: [{
                    name: '',
                    contact: '',
                    role: '',
                    id: 1
                }]
            },
            validated : false,
            show : false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.invoiceSubmitted && !prevProps.invoiceSubmitted){
            // this.setState({
            //     formObject : {
            //         registrationDate : new Date(),
            //         address : "",
            //         groupName : "",
            //         chiefPersonName : "",
            //         chiefPersonContact : "",
            //         description : "",
            //     },
            //     validated : false,
            //     show : false
            // })
        }
    }

    handleDateChange = (value) =>{
        const { formObject } = this.state
        formObject["registrationDate"] = value
        this.setState({
            formObject: formObject
        })
    }

    handleFormUpdate = (event) =>{
        const { formObject } = this.state
        formObject[event.target.name] = event.target.value
        this.setState({
            formObject: formObject
        })
    }

    handleMemberUpdate = (event, index) =>{
        const { formObject } = this.state
        console.log("member update : ",event.target.name, event.target.value, index)
        if(formObject.members && formObject.members.length > 0){
            console.log(formObject.members, formObject.members[index])
            formObject.members[index][event.target.name] = event.target.value
            this.setState({
                formObject : formObject
            })
        }
    }

    setShow = (value) => {
        this.setState({show: value});
    }

    handleSubmit = (event) =>{
        const { formObject } = this.state
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log("error")
        }
        else{
            console.log("success")
            this.props.submitGroupRegistration(formObject)
        }
        this.setState({validated : true})
    }

    addNewMember = () =>{
        const { formObject } = this.state
        const length = formObject.members.length
        formObject.members.push({
            id: formObject.members[length - 1].id + 1,
            name: "",
            contact: "",
            role: "",
        })
        this.setState({
            formObject: formObject
        })
    }

    deleteMember = (index) =>{
        const { formObject } = this.state
        if(formObject.members.length > 1){ //not to delete last element
            formObject.members.splice(index, 1)
            this.setState({
                formObject: formObject
            })
        }
    }

    render() {
        const { formObject, validated } = this.state
        return (
            <div>
                <div className='panel'>
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md="4" lg="4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Group Name</Form.Label>
                                    <Form.Control value={ formObject.groupName } type="text" placeholder="Group Name" name="groupName"  onChange={this.handleFormUpdate} required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a group name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control value={ formObject.address } type="text" placeholder="Address" name="address"  onChange={this.handleFormUpdate} required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Registration Date</Form.Label>
                                    <DatePicker
                                        selected={ formObject.registrationDate }
                                        className="form-control"
                                        customInput={
                                            <Form.Control type="text" placeholder="Registration date" id="validationCustom01" />
                                        }
                                        onChange={this.handleDateChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chief person name</Form.Label>
                                    <Form.Control value={ formObject.chiefPersonName } type="text" placeholder="Enter chief person name" name="chiefPersonName"  onChange={this.handleFormUpdate} required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chief person contact</Form.Label>
                                    <Form.Control value={ formObject.chiefPersonContact } type="text" placeholder="Enter chief person contact" name="chiefPersonContact"  onChange={this.handleFormUpdate} required/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control value={ formObject.description } type="text" placeholder="Description" name="description" onChange={this.handleFormUpdate}/>
                                </Form.Group>
                            </Col>
                            <div className="vr"></div>
                            <Col>
                                <div className="members-section">
                                    {
                                        formObject.members.map((member, index)=>{
                                            return <Row key={index}>
                                                {index+1}.
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Member Name</Form.Label>
                                                        <Form.Control value={ member.name } type="text" placeholder="Enter Member Name" name="name"  onChange={(event)=>this.handleMemberUpdate(event, index)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Member Contact</Form.Label>
                                                        <Form.Control value={ member.contact } type="text" placeholder="Enter Member Contact" name="contact"  onChange={(event)=>this.handleMemberUpdate(event, index)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Member Role</Form.Label>
                                                        <Form.Control value={ member.role } type="text" placeholder="Enter Member Role" name="role"  onChange={(event)=>this.handleMemberUpdate(event, index)} required />
                                                    </Form.Group>
                                                </Col>
                                                <Button style={{marginTop: "30px", marginBottom: "30px"}} variant="danger" onClick={ ()=>this.deleteMember(index) }><i className="bi bi-trash"></i></Button>
                                            </Row>
                                        })
                                    }
                                </div>
                                <Button variant="secondary"  onClick={ this.addNewMember } >+ Add member</Button>
                            </Col>
                        </Row>
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

export default ComponentRegistrationForm