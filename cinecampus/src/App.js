import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./screens/LoginForm/LoginForm";
import AuthRedirect from "./components/AuthRedirect";
import Home from "./screens/Home/Home";
import RegisterForm from "./screens/RegisterForm/RegisterForm";
import Movie from "./screens/Movie/Movie";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthRedirect />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movie/:id" element={<Movie />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;