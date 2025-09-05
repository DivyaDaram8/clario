import JournalBoard from "../components/journal/JournalBoard";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";
import "../styles/journal.css";

export default function Journal() {
  return (
    <div className="journal-page">
      {/* Left Navbar */}
      <NavbarLeft />

      <div className="journal-main">
        {/* Top Navbar */}
        <div className="journal-topbar">
          <NavbarTop />
        </div>

        {/* Main Content */}
        <div className="journal-content">
          <div className="journal-card">
            <JournalBoard/>
          </div>
        </div>
      </div>
    </div>
  );
}