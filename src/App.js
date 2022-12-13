import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import ComponentNavbar from './components/Navbar';
import CounterContainer from './containers/counterContainer';
import IncomeContainer from "./containers/incomeContainer";
import CreateInvoice from './layouts/CreateInvoice';
import Expense from './layouts/Expense';
import Home from './layouts/Home';
import Registration from "./layouts/Registration";

function App() {
	const otherApp = window.location.href.includes("dairyapp")?true:false
  	return (
   	 	<div className="App">
			{
				!otherApp && <ComponentNavbar/>
			}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/register" element={<Registration />}></Route>
					<Route path="/createinvoice" element={<CreateInvoice />}></Route>
					<Route path="/income" element={<IncomeContainer />}></Route>
					<Route path="/expense" element={<Expense />}></Route>
					<Route path="/counter" element={<CounterContainer/> }></Route>
				</Routes>
			</BrowserRouter>
    	</div>
  	);
}

export default App;
