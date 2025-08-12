import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Pomodoro from './pages/Pomodoro';
import HabitTracker from './pages/HabitTracker';
import Notes from './pages/Notes';
import Calendar from './pages/Calendar';
import Journal from './pages/Journal';
import Todo from './pages/Todo';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
    </>
  );
}

export default App;
