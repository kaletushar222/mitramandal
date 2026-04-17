import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import ComponentNavbar from './components/Navbar';
import ExpenseContainer from "./containers/expenseContainer";
import IncomeContainer from "./containers/incomeContainer";
import Home from './layouts/Home';
import Login from './layouts/Login';
import Registration from "./layouts/Registration";
import CreateExpense from './layouts/expense/CreateExpense';
import CreateInvoice from './layouts/income/CreateInvoice';
import DocTracker from "./layouts/doctracker/DocTracker";
import ProtectedRoute from './components/ProtectedRoute';
import GroupManagement from './layouts/GroupManagement';
import ChangePassword from './layouts/ChangePassword';

function App() {
  	return (
		<BrowserRouter>
			<div className="App">
				<ComponentNavbar/>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/mitramandal" element={<Home />}></Route>
					<Route path="/mitramandal/login" element={<Login/> }></Route>
					<Route path="/mitramandal/register" element={<Registration />}></Route>
					<Route path="/mitramandal/createinvoice" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>}></Route>
					<Route path="/mitramandal/income" element={<ProtectedRoute><IncomeContainer /></ProtectedRoute>}></Route>
					<Route path="/mitramandal/createexpense" element={<ProtectedRoute><CreateExpense /></ProtectedRoute>}></Route>
					<Route path="/mitramandal/expense" element={<ProtectedRoute><ExpenseContainer /></ProtectedRoute>}></Route>
					<Route path="/mitramandal/doctracker" element={<ProtectedRoute><DocTracker /></ProtectedRoute>}></Route>
					<Route path="/mitramandal/managegroup" element={<ProtectedRoute><GroupManagement /></ProtectedRoute>}></Route>
					<Route path="/mitramandal/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}></Route>
				</Routes>
			</div>
		</BrowserRouter>
  	);
}

export default App;
