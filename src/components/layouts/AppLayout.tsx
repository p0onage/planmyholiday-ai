import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-2 lg:px-6 flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
