import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaUsers,
  FaChartLine,
  FaPercent,
  FaLayerGroup,
  FaGlobeAsia,
  FaChartBar,
  FaCog,
  FaSearch,
  FaBell,
  FaPlus,
  FaArrowUp,
  FaShoppingCart,
  FaPalette,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaBars,
  FaStore,
  FaRobot,
} from "react-icons/fa";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: FaHome },
  {
    key: "orders",
    label: "Orders",
    icon: FaShoppingCart,
    children: [{ key: "drafts", label: "Drafts" }],
  },
  {
    key: "products",
    label: "Products",
    icon: FaBoxOpen,
    children: [
      { key: "collections", label: "Collections" },
      { key: "inventory", label: "Inventory" },
      { key: "purchase-orders", label: "Purchase orders" },
      { key: "transfers", label: "Transfers" },
      { key: "gift-cards", label: "Gift cards" },
    ],
  },
  {
    key: "customers",
    label: "Customers",
    icon: FaUsers,
    children: [
      { key: "segments", label: "Segments" },
      { key: "companies", label: "Companies" },
    ],
  },
  { key: "growth", label: "Growth", icon: FaChartLine },
  { key: "discounts", label: "Discounts", icon: FaPercent },
  {
    key: "content",
    label: "Content",
    icon: FaLayerGroup,
    children: [
      { key: "metaobjects", label: "Metaobjects" },
      { key: "files", label: "Files" },
      { key: "menus", label: "Menus" },
      { key: "blog-posts", label: "Blog posts" },
    ],
  },
  {
    key: "markets",
    label: "Markets",
    icon: FaGlobeAsia,
    children: [
      { key: "catalogs", label: "Catalogs" },
      { key: "rollouts", label: "Rollouts" },
    ],
  },
  { key: "analytics", label: "Analytics", icon: FaChartBar },
];

const SALES_CHANNELS = [{ key: "online-store", label: "Online Store", icon: FaStore }];
const APPS_SECTION = [{ key: "agentic", label: "Agentic", icon: FaRobot }];

export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [openMenus, setOpenMenus] = useState({ products: false });
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop show/hide
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [showTrial, setShowTrial] = useState(true);

  const storeName = "My Store";
  const initials = "MS";

  const handleLogout = () => {
    toast.success("Logged out");
    navigate("/login");
  };

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectItem = (key) => {
    setActive(key);
    setMobileOpen(false);
  };

  const renderNavGroup = (items) =>
    items.map(({ key, label, icon: Icon, children }) => {
      const isActive = active === key;
      const isOpen = !!openMenus[key];
      const hasChildren = !!children?.length;

      return (
        <div key={key}>
          <button
            onClick={() => {
              selectItem(key);
              if (hasChildren) toggleMenu(key);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={15} className="shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {hasChildren && (
              <FaChevronDown
                size={10}
                className={`transition-transform shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {hasChildren && isOpen && (
            <div className="ml-[26px] border-l border-white/10 pl-3 mt-1 mb-1 space-y-0.5">
              {children.map((child) => (
                <button
                  key={child.key}
                  onClick={() => selectItem(child.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    active === child.key
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    });

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold shrink-0">
          S
        </div>
        <div className="leading-tight">
          <p className="text-white font-semibold text-sm">{storeName}</p>
          <p className="text-[11px] text-white/40">Spring '26</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {renderNavGroup(NAV_ITEMS)}

        <div className="pt-4 mt-4 border-t border-white/10">
          <p className="px-3 pb-2 text-[11px] uppercase tracking-wide text-white/30 font-semibold">
            Sales channels
          </p>
          {renderNavGroup(SALES_CHANNELS)}
        </div>

        <div className="pt-4 mt-4 border-t border-white/10">
          <p className="px-3 pb-2 text-[11px] uppercase tracking-wide text-white/30 font-semibold">
            Apps
          </p>
          {renderNavGroup(APPS_SECTION)}
        </div>

        <div className="pt-4 mt-4 border-t border-white/10">
          <button
            onClick={() => selectItem("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              active === "settings"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaCog size={15} />
            Settings
          </button>
        </div>
      </nav>

      {showTrial && (
        <div className="p-3">
          <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-white/10 rounded-xl p-4 pr-8">
            <button
              onClick={() => setShowTrial(false)}
              aria-label="Dismiss trial banner"
              className="absolute top-2.5 right-2.5 text-white/40 hover:text-white transition"
            >
              <FaTimes size={12} />
            </button>
            <p className="text-white text-sm font-semibold">
              Trial ends in 3 days
            </p>
            <p className="text-white/70 text-sm mt-0.5">Subscribe for ₹20</p>
            <button className="w-full mt-3 bg-white text-[#071311] text-sm font-semibold py-2 rounded-lg hover:bg-white/90 transition">
              Select a plan
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 text-white/50 hover:text-white text-sm py-2 transition"
          >
            <FaSignOutAlt size={13} /> Log out
          </button>
        </div>
      )}

      {!showTrial && (
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-white text-sm py-2 transition"
          >
            <FaSignOutAlt size={13} /> Log out
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="h-screen w-screen flex bg-[#f1f2f2] overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex shrink-0 bg-[#071311] text-white/80 flex-col transition-all duration-300 overflow-hidden ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="w-64 h-full flex flex-col">{SidebarContent}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-[#071311] text-white/80 flex flex-col h-full">
            {SidebarContent}
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 bg-[#071311] flex items-center justify-between px-4 sm:px-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-white/70 hover:text-white shrink-0"
              aria-label="Open menu"
            >
              <FaBars size={18} />
            </button>

            {/* Desktop show/hide toggle */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden md:inline-flex text-white/70 hover:text-white shrink-0"
              aria-label="Toggle sidebar"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <FaBars size={16} />
            </button>

            <div className="flex-1 max-w-xl min-w-0">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-white/10 text-white placeholder-white/40 rounded-xl pl-11 pr-4 sm:pr-16 py-2.5 text-sm outline-none focus:bg-white/15 transition"
                />
                <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 border border-white/20 rounded px-1.5 py-0.5">
                  Ctrl K
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button className="text-white/70 hover:text-white relative">
              <FaBell size={16} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-white text-sm font-medium hidden sm:inline">
                {storeName}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Welcome to {storeName}!
              </h1>
              <p className="text-gray-500 mt-1">Where do you want to start?</p>

              <div className="relative mt-6 max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Help me come up with a business idea"
                  className="w-full bg-white border rounded-2xl pl-5 pr-12 py-3.5 text-sm outline-none focus:border-green-600 shadow-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-900 transition">
                  <FaArrowUp size={12} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Add your first product
                </h3>
                <p className="text-gray-500 text-sm mt-2 flex-1">
                  Start with a title, price, and a photo. You can always add
                  more detail later.
                </p>
                <button
                  onClick={() => selectItem("products")}
                  className="mt-5 inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-fit transition"
                >
                  <FaPlus size={11} /> Add product
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Choose your store design
                </h3>
                <p className="text-gray-500 text-sm mt-2 flex-1">
                  Pick a theme that fits your brand, then customize from
                  there.
                </p>
                <button
                  onClick={() => selectItem("online-store")}
                  className="mt-5 inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-fit transition"
                >
                  <FaPalette size={11} /> Browse themes
                </button>
              </div>

              {showTrial && (
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Your store is in trial mode
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Select a plan to start accepting orders and payments.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setShowTrial(false)}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-2.5"
                    >
                      Skip for now
                    </button>
                    <button className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap transition">
                      Select a plan <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}