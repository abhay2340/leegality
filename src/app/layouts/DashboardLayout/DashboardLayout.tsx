import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Bell,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { menuItems } from "./constants";
import "./DashboardLayout.css";

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const currentActiveItem =
    menuItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/"),
    ) || menuItems[0];

  return (
    <div className="db-layout-container">
      {/* Sidebar - Desktop */}
      <aside
        className={`db-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}
      >
        <div className="db-sidebar-header">
          <div className="db-logo-container">
            <div className="db-logo-icon">E</div>
            {!isCollapsed && <span className="db-logo-text">PulseAdmin</span>}
          </div>
          <button
            className="db-sidebar-toggle-btn"
            onClick={handleToggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        <nav className="db-sidebar-nav">
          <ul className="db-nav-list">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`db-nav-link ${isActive ? "active" : ""}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className="db-nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="db-nav-label">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="db-nav-active-indicator" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-user-profile">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Admin Profile"
              className="db-user-avatar"
            />
            {!isCollapsed && (
              <div className="db-user-details">
                <span className="db-user-name">Sarah Jenkins</span>
                <span className="db-user-role">Store Manager</span>
              </div>
            )}
          </div>
          <button className="db-logout-btn" title="Sign Out">
            <LogOut size={20} />
            {!isCollapsed && <span className="db-logout-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="db-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="db-main-content">
        {/* Top Header */}
        <header className="db-header">
          <div className="db-header-left">
            <button className="db-menu-toggle-btn" onClick={handleToggleMobile}>
              <Menu size={24} />
            </button>
            <div className="db-page-breadcrumbs">
              <span className="db-breadcrumb-root">Dashboard</span>
              <span className="db-breadcrumb-separator">/</span>
              <span className="db-breadcrumb-active">
                {currentActiveItem.label}
              </span>
            </div>
          </div>

          <div className="db-header-right">
            {/* Search Bar */}
            <div className="db-search-container">
              <Search size={18} className="db-search-icon" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="db-search-input"
              />
            </div>

            {/* Notifications */}
            <button className="db-header-action-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="db-notification-badge" />
            </button>

            {/* Help */}
            <button className="db-header-action-btn" aria-label="Help">
              <HelpCircle size={20} />
            </button>

            <div className="db-header-divider" />

            {/* User Quick Menu */}
            <div className="db-quick-profile">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Profile"
                className="db-quick-avatar"
              />
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="db-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
