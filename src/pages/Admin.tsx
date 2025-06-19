import { useAuth } from "../providers/auth";
import { toast } from "react-toastify";

//TODO: swap this out for a proper admin panel
export default function Admin() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out!");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-gray-600">
                Welcome, <span className="font-semibold">{user?.email}</span>!
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h2 className="text-lg font-medium text-blue-900">
                  System Status
                </h2>
                <p className="text-blue-700 mt-1">All systems operational</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900">Total Users</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">1,234</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900">Active Sessions</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">456</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900">System Health</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">Good</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Quick Actions
                </h2>
                <div className="space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
                  <button className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View Reports
                  </button>
                  <button className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Manage Users
                  </button>
                  <button className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
