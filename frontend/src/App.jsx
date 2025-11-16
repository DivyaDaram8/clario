import { Routes, Route, useLocation } from "react-router-dom";

import NavbarTop from "./layout/NavbarTop";
import NavbarLeft from "./layout/NavbarLeft";
import Home from "./pages/Home";
import Pomodoro from "./pages/Pomodoro";
import HabitTracker from "./pages/HabitTracker";
import Notes from "./pages/Notes";
import Journal from "./pages/Journal";
import Todo from "./pages/Todo";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ExpenseTracker from "./pages/ExpenseTracker";
import BrainGames from "./pages/BrainGames";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import Summarizers from "./pages/Summarizers";
import Books from "./pages/Books";

function App() {
  const location = useLocation();

  // pages where nav + chatbot should NOT appear
  const hideLayoutPaths = ["/", "/login", "/signup"];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <NavbarLeft />}
      {!shouldHideLayout && <NavbarTop />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/habit-tracker" element={<HabitTracker />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/expense-tracker" element={<ExpenseTracker />} />
        <Route path="/brain-games" element={<BrainGames />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/summarizer" element={<Summarizers />} />
        <Route path="/books" element={<Books />} />
      </Routes>

      {!shouldHideLayout && <Chatbot />}
    </>
  );
}

export default App;