import { Link } from "react-router-dom";

const Navigation = () => {
  // Navigation items
  const navItems = [
    { key: "home", path: "/home", label: "Home" },
    { key: "about", path: "/about", label: "About" },
    { key: "news", path: "/news", label: "News" },
    { key: "events", path: "/events", label: "Events" },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className="text-white hover:text-gray-300 px-3 py-2 rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
