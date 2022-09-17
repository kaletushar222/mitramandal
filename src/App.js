import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

  import Home from './layouts/home/Home';

function App() {
  return (
   	 	<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />}>
					</Route>
				</Routes>
			</BrowserRouter>
    	</div>
  );
}

export default App;
