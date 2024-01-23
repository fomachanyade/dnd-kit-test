import "./App.css";
import { Simple } from "./dnd/simple";
import { Sortable } from "./dnd/sortable";

function App() {
	return (
		<div className="App">
			<h1>dnd-kit</h1>
			<div style={{ margin: "16 0" }}>
				<h2>simple</h2>
				<Simple />
			</div>
			<div style={{ margin: "16 0" }}>
				<h2>sortable</h2>
				<Sortable />
			</div>
		</div>
	);
}

export default App;
