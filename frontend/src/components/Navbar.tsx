import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Shield,
  Compass,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Heart,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Asanas', path: '/poses' },
    { name: 'Studio', path: '/guided-practice', highlight: true },
    { name: 'Programs', path: '/programs' },
    { name: 'Awareness', path: '/articles' },
    { name: 'Events', path: '/events' },
    { name: 'Planner', path: '/planner' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sage-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white shadow-md shadow-sage-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-stone-900 group-hover:text-sage-700 transition-colors">
                Yoga<span className="text-sage-600">Life</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-medium text-stone-400">
                Mindful Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sage-100/70 text-sage-800 font-semibold shadow-xs'
                      : link.highlight
                      ? 'text-sage-700 bg-sage-50/50 hover:bg-sage-100 hover:text-sage-900'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-2xl border border-sage-200 bg-sage-50/50 hover:bg-sage-100/50 transition-colors"
                >
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-stone-800 truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-sage-600 font-medium">
                      {user.role === 'ADMIN' ? '👑 Acharya (Admin)' : '🧘 Practitioner'}
                    </span>
                  </div>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover border border-sage-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-sage-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sage-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="text-xs font-semibold text-stone-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-sage-50 hover:text-sage-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-sage-600" />
                      <span>My Dashboard</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 font-medium transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-sage-600 text-white hover:bg-sage-700 shadow-sm shadow-sage-600/30 transition-all hover:scale-[1.02]"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-sage-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sage-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-700 hover:bg-sage-50 hover:text-sage-800 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-sage-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-sage-800 bg-sage-50"
                >
                  <LayoutDashboard className="w-5 h-5 text-sage-600" />
                  <span>My Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-purple-700 bg-purple-50"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out ({user.name})</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center py-2.5 rounded-xl border border-stone-200 text-stone-700 font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center py-2.5 rounded-xl bg-sage-600 text-white font-medium"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
