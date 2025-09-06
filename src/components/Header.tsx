import { FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div 
        className="text-2xl font-bold text-accent cursor-pointer hover:text-accent/80 transition-colors"
        onClick={handleLogoClick}
      >
        PlanMyHoliday.AI
      </div>
      <div className="flex items-center gap-4">
        <FaBars className="text-2xl text-gray-500 cursor-pointer" />
        <FaUserCircle className="text-2xl text-gray-500 cursor-pointer" />
      </div>
    </header>
  );
}
