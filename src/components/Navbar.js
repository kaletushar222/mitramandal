import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import { setInvoices } from '../actions/incomeActions';
import { setExpenses } from '../actions/expenseActions';

function ComponentNavbar() {
    let pathname = window.location.pathname
    const user = useSelector(s => s.authReducer.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        // clear invoices/expenses on logout so previous data isn't shown
        dispatch(setInvoices([]));
        dispatch(setExpenses([]));
        navigate('/mitramandal/login');
    }

    return (
        <>
            <Navbar className="fixed-top" bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/mitramandal">
                        Mitra Mandal
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        { user ? (
                            <Nav activeKey={pathname} className="me-auto">
                                <Nav.Link href="/mitramandal/createinvoice">Create Invoice</Nav.Link>
                                <Nav.Link href="/mitramandal/income">Income</Nav.Link>
                                <Nav.Link href="/mitramandal/createexpense">Create Expense</Nav.Link>
                                <Nav.Link href="/mitramandal/expense">Expense</Nav.Link>
                                <Nav.Link href="/mitramandal/doctracker">Doc Tracker</Nav.Link>
                                { user && user.contact === user.chiefPersonContact && (
                                    <Nav.Link href="/mitramandal/managegroup">Manage Group</Nav.Link>
                                )}
                            </Nav>
                        ) : null }

                        <Nav style={{ marginLeft: "auto" }}>
                            { user ? (
                                <>
                                    <Nav.Link href="/mitramandal/changepassword">Change Password</Nav.Link>
                                    <Nav.Link onClick={ handleLogout }>Logout ({user.name || user.contact})</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link href="/mitramandal/login">Login</Nav.Link>
                                    <Nav.Link eventKey={2} href="/mitramandal/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default ComponentNavbar;