import './styles/App.css';
import HomePage from "./pages/HomePage";
import {Navigate, Route, Routes} from "react-router-dom";
import TableViewPage from "./pages/TableViewPage";
import {AuthContextProvider} from "./service/AuthorizationContext";
import {useEffect, useState} from "react";

function App() {
    const [tableNames, setTableNames] = useState([])

    useEffect(async () => {
        document.title = 'Qiao一Qiao App'
        const serviceEndpoint = `${process.env.REACT_APP_SPRING}/api/service/all-tables`
        const response = await fetch(serviceEndpoint);
        const data = await response.json();
        setTableNames(data.names)
    }, [])

    return (
        <div className="App">
            <AuthContextProvider>
                <Routes>
                    <Route path="/home" element={<HomePage />}/>
                    {tableNames.map(endpoint => (
                        <Route
                            key={endpoint}
                            path={`/${endpoint}`}
                            element={<TableViewPage endpoint={`${process.env.REACT_APP_SPRING}/api/table/${endpoint}`} />}
                        />
                    ))}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                </Routes>
            </AuthContextProvider>
        </div>
    );
}
export default App;
