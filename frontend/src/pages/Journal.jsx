// src/pages/Journal.jsx
import JournalBoard from "../components/journal/JournalBoard";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

export default function Journal() {
  return (
    <div className="flex flex-col h-screen">
      {/* top navbar here if you have */}
      <NavbarLeft />
      <NavbarTop />
      <JournalBoard />
    </div>
  );
}
