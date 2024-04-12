import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quote from "./pages/Quote";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/quote"
            element={
              <PrivateRoute>
                <Quote />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
