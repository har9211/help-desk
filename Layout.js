import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Shield, 
  ShoppingBag, 
  Newspaper, 
  GraduationCap, 
  Briefcase,
  Building2,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
    description: "Main services"
  },
  {
    title: "Chatbot",
    url: createPageUrl("Chatbot"),
    icon: MessageCircle,
    description: "Get instant help"
  },
  {
    title: "Submit Issue",
    url: createPageUrl("SubmitIssue"),
    icon: FileText,
    description: "Report problems"
  },
  {
    title: "Online Shop",
    url: createPageUrl("Shop"),
    icon: ShoppingBag,
    description: "Local marketplace"
  },
  {
    title: "News",
    url: createPageUrl("News"),
    icon: Newspaper,
    description: "Latest updates"
  },
  {
    title: "Education",
    url: createPageUrl("Education"),
    icon: GraduationCap,
    description: "Learning resources"
  },
  {
    title: "Jobs",
    url: createPageUrl("Jobs"),
    icon: Briefcase,
    description: "Employment opportunities"
  },
  {
    title: "Gov Services",
    url: createPageUrl("GovServices"),
    icon: Building2,
    description: "Government services"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  const NavigationMenu = ({ mobile = false }) => (
    <nav className={`${mobile ? 'space-y-1' : 'space-y-2'}`}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.url;
        return (
          <Link
            key={item.title}
            to={item.url}
            onClick={() => mobile && setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              {!mobile && (
                <div className="text-xs text-slate-500">{item.description}</div>
              )}
            </div>
          </Link>
        );
      })}
      
      {user?.is_admin && (
        <Link
          to={createPageUrl("Admin")}
          onClick={() => mobile && setIsOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === createPageUrl("Admin")
              ? 'bg-blue-100 text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shield className="w-5 h-5" />
          <div className="flex-1">
            <div className="font-medium">Admin Panel</div>
            {!mobile && (
              <div className="text-xs text-slate-500">Manage issues</div>
            )}
          </div>
        </Link>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="py-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Village Help Desk</h2>
                    <p className="text-sm text-slate-500">Digital services for our community</p>
                  </div>
                  <NavigationMenu mobile={true} />
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Village Help Desk</h1>
            </div>
          </div>
          {user && (
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r border-slate-200 min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Village Help Desk</h2>
                  <p className="text-sm text-slate-500">Digital services for our community</p>
                </div>
              </div>
            </div>

            <NavigationMenu />

            {user && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3 px-3 py-2 mb-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-medium text-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-slate-500">{user.village}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-slate-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}