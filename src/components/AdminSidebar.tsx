// src/components/AdminSidebar.tsx

interface AdminSidebarProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const AdminSidebar = ({ setActiveTab, activeTab }: AdminSidebarProps) => {
  const tabs = [
    { label: "📚 Manage Books", key: "books" },
    { label: "📦 Manage Orders", key: "orders" },
    { label: "👥 Manage Users", key: "users" },
  ];

  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>

      <ul className="space-y-4">
        {tabs.map(({ label, key }) => (
          <li
            key={key}
            onClick={() => setActiveTab(key)}
            className={`cursor-pointer p-2 rounded-lg ${
              activeTab === key
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
            aria-current={activeTab === key ? "page" : undefined}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
