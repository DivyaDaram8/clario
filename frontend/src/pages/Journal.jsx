import { useState } from "react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10) // default: today
  );

  return (
    <div>
      <NavbarTop />
      <NavbarLeft />
      <div className="main-content">
        <h1>Journal</h1>
      </div>
    </div>
  );
}
