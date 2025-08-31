import React from 'react';
import { FaUserCircle, FaBars } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-accent">PlanMyHoliday.AI</div>
      <div className="flex items-center gap-4">
        <FaBars className="text-2xl text-gray-500 cursor-pointer" />
        <FaUserCircle className="text-2xl text-gray-500 cursor-pointer" />
      </div>
    </header>
  );
}
