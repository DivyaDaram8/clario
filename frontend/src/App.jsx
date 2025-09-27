import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Pomodoro from './pages/Pomodoro';
import HabitTracker from './pages/HabitTracker';
import Notes from './pages/Notes';
import Journal from './pages/Journal';
import Todo from './pages/Todo';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ExpenseTracker from './pages/ExpenseTracker';

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
          <Route path="/journal" element={<Journal />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/summarizer" element={<Summarizer />} />
        </Routes>
    </>
  );
}

export default App;
