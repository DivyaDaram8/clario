import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Pomodoro from './pages/Pomodoro';
import HabitTracker from './pages/HabitTracker';
import Notes from './pages/Notes';
import Todo from './pages/Todo';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ExpenseTracker from './pages/ExpenseTracker';
import Summarizers from './pages/Summarizers';
import Books from './pages/Books';
import Profile from './pages/Profile';



function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/summarizer" element={<Summarizers />} />
          <Route path="/books" element={<Books />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
        </Routes>
    </>
  );
}

export default App;
