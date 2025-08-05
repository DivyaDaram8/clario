import {Link} from 'react-router-dom';

function Navbar() {
  return (
    <nav className='navbar'>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pomodoro">Pomodoro</Link></li>
            <li><Link to="/habit-tracker">Habit Tracker</Link></li>
            <li><Link to="/notes">Quick Notes</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/todo">Todo</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar;