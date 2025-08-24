import { useState } from "react";
import NavbarLeft from "../layout/NavbarLeft";
import NavbarTop from "../layout/NavbarTop";

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10) // default: today
  );

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top navbar */}
      <div className="h-14 fixed top-0 left-0 right-0 z-10">
        <NavbarTop />
      </div>

      {/* Body */}
      <div className="flex flex-1 pt-14">
        {/* Left navbar */}
        <div className="w-56 fixed top-14 bottom-0 left-0 z-10">
          <NavbarLeft />
        </div>
        <div>journal</div>
      </div>
    </div>
  );
}
