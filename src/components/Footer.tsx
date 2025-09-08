import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t mt-12 py-6 text-center text-gray-600 text-sm">
      <div className="mb-2">© 2025 PlanMyHoliday, Limited.</div>
      <div className="flex justify-center gap-6">
        <Link to="/about" className="hover:text-accent">About Us</Link>
        <Link to="/contact" className="hover:text-accent">Contact Us</Link>
        <Link to="/privacy" className="hover:text-accent">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-accent">Terms of Service</Link>
      </div>
    </footer>
  );
}
