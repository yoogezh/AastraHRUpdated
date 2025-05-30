
import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  Users, 
  FileText, 
  Calendar,
  Settings, 
  ClipboardCheck,
  List, 
  Check,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      path: '/', 
      icon: <ClipboardCheck className="h-5 w-5" /> 
    },
    { 
      title: 'Clients', 
      path: '/clients', 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      title: 'Job Descriptions', 
      path: '/jobs', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      title: 'Candidates', 
      path: '/candidates', 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      title: 'Employees', 
      path: '/employees', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      title: 'Screen Tracker', 
      path: '/screen-tracker', 
      icon: <List className="h-5 w-5" /> 
    },
    { 
      title: 'Onboard Tracker', 
      path: '/onboard-tracker', 
      icon: <Check className="h-5 w-5" /> 
    },
    { 
      title: 'Interviews', 
      path: '/interviews', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside 
        className={cn(
          "bg-white shadow-md z-20 transition-all duration-300 ease-in-out fixed left-0 top-0 h-full border-r",
          isSidebarOpen ? "w-64" : "w-20",
          "hidden md:block"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <div className={cn("flex items-center overflow-hidden", isSidebarOpen ? "w-auto" : "w-0")}>
            <span className="text-2xl font-bold text-aastra-blue">Aastra</span>
            <span className="text-2xl font-bold text-aastra-teal">HR</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="rounded-full hover:bg-muted"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 text-base font-medium rounded-md transition-all",
                    location.pathname === item.path
                      ? "bg-aastra-blue text-white"
                      : "text-gray-700 hover:bg-muted",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-4">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isSidebarOpen && (
          <div className="absolute bottom-0 w-full p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-aastra-blue flex items-center justify-center text-white">
                <span className="font-semibold">AH</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@aastrahrapp.com</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-3 justify-start" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-aastra-blue">Aastra</span>
          <span className="text-2xl font-bold text-aastra-teal">HR</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 md:hidden pt-16">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center p-3 text-base font-medium rounded-md",
                      location.pathname === item.path
                        ? "bg-aastra-blue text-white"
                        : "text-gray-700 hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-4">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "md:ml-20",
          "md:pt-0 pt-16" // Add padding top for mobile header
        )}
      >
        <div className="container py-6 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
