import { useAppContext } from "../../context/AppContext";
import { useLocation, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Clipboard,
  BookOpen,
} from "lucide-react";

const AdminLayout = () => {
  const { logoutAdmin } = useAppContext();
  const location = useLocation();

  const sidebarLinks = [
    {
      name: "Pending Sellers",
      path: "/admin",
      icon: <LayoutDashboard size={20} strokeWidth={1.8} />,
    },
    {
      name: "Pending Recipes",
      path: "/admin/recipes",
      icon: <Clipboard size={20} strokeWidth={1.8} />,
    },
    {
      name: "All Users",
      path: "/admin/users",
      icon: <Users size={20} strokeWidth={1.8} />,
    },
    {
      name: "All Products",
      path: "/admin/products",
      icon: <ShoppingBag size={20} strokeWidth={1.8} />,
    },
    {
      name: "All Recipes",
      path: "/admin/recipes/all",
      icon: <BookOpen size={20} strokeWidth={1.8} />,
    },
  ];

  const logout = async () => {
    await logoutAdmin();
  };

  const isLinkActive = (path) => location.pathname === path;

  // Reuse identical JSX shell from SellerLayout — only nav links + badge differ
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#FAF5EC",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Body */}
      <div className="flex flex-1">
        <aside
          className="hidden md:flex w-60 border-r pt-5 flex-col gap-1 px-2 sticky top-[57px] self-start h-[calc(100vh-57px)]"
          style={{ backgroundColor: "#FAF5EC", borderColor: "#E0D2B4" }}
        >
          <p
            className="text-xs font-semibold uppercase px-3 pb-2"
            style={{ color: "#B8A48A", letterSpacing: "0.08em" }}
          >
            Admin Panel
          </p>

          {sidebarLinks.map((item) => {
            const isActive = isLinkActive(item.path);
            return (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/admin"}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-150"
                style={{
                  backgroundColor: isActive ? "#8B3A2A12" : "transparent",
                  borderLeft: isActive
                    ? "3px solid #8B3A2A"
                    : "3px solid transparent",
                  color: isActive ? "#8B3A2A" : "#6B5140",
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "#EDE4CE";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ color: isActive ? "#8B3A2A" : "#9A8060" }}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "#8B3A2A" }}
                  />
                )}
              </NavLink>
            );
          })}

          <div className="mt-auto mb-4 mx-3">
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #2A3F6B55, transparent)",
              }}
            />
            <p
              className="text-xs text-center mt-3"
              style={{ color: "#B8A48A" }}
            >
              Bazaar Admin v1.0
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 border-t"
        style={{
          backgroundColor: "#FEFAF2",
          borderColor: "#E0D2B4",
          boxShadow: "0 -4px 20px #1E100812",
        }}
      >
        {sidebarLinks.map((item) => {
          const isActive = isLinkActive(item.path);
          return (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-2xl transition-all duration-150 min-h-[44px]"
              style={{
                backgroundColor: isActive ? "#8B3A2A12" : "transparent",
                color: isActive ? "#8B3A2A" : "#6B5140",
                fontWeight: isActive ? 600 : 400,
                textDecoration: "none",
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150"
                style={{
                  backgroundColor: isActive ? "#8B3A2A" : "transparent",
                  color: isActive ? "#E8EDF5" : "#9A8060",
                }}
              >
                {item.icon}
              </span>
              <span
                className="text-center font-medium"
                style={{
                  fontSize: 10,
                  color: isActive ? "#8B3A2A" : "#9A8060",
                }}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default AdminLayout;
