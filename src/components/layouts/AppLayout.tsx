import { Outlet } from 'react-router-dom';
import Header from '../Header';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-2 lg:px-6">
        {children || <Outlet />}
      </main>
    </div>
  );
}
