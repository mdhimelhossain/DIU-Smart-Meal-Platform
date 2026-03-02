import { useState } from "react";
import { Link } from "react-router";
import {
  Home,
  UtensilsCrossed,
  History,
  User,
  LogOut,
  Plus,
  Menu,
  X,
  TrendingUp,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { sampleStudent, sampleMealHistory, hotels, menuItems } from "../data/mockData";

type TabType = "overview" | "hotels" | "add-meal" | "history" | "profile";

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");

  const student = sampleStudent;
  const mealHistory = sampleMealHistory;

  const totalMeals = mealHistory.length;
  const totalAmount = mealHistory.reduce((sum, meal) => sum + meal.price, 0);
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const joinedHotels = hotels.filter((hotel) => student.joinedHotels.includes(hotel.id));
  const availableMenuItems = selectedHotel
    ? menuItems.filter((item) => item.hotelId === selectedHotel && item.available)
    : [];

  const handleAddMeal = () => {
    if (selectedHotel && selectedMeal) {
      alert("Meal entry added successfully!");
      setSelectedHotel("");
      setSelectedMeal("");
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={student.profileImage}
            alt={student.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.studentId}</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {[
          { id: "overview", label: "Overview", icon: Home },
          { id: "hotels", label: "My Hotels", icon: UtensilsCrossed },
          { id: "add-meal", label: "Add Meal Entry", icon: Plus },
          { id: "history", label: "Meal History", icon: History },
          { id: "profile", label: "Profile", icon: User },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as TabType);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-green-600">Student Portal</h2>
        </div>
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-600">Student Portal</h2>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "hotels" && "My Hotels"}
            {activeTab === "add-meal" && "Add Meal Entry"}
            {activeTab === "history" && "Meal History"}
            {activeTab === "profile" && "My Profile"}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="p-4 md:p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">Total Meals</h3>
                  <p className="text-3xl font-bold text-gray-800">{totalMeals}</p>
                  <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">Total Amount</h3>
                  <p className="text-3xl font-bold text-gray-800">৳{totalAmount}</p>
                  <p className="text-sm text-gray-500 mt-2">Current month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <CreditCard className="text-red-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">Amount Due</h3>
                  <p className="text-3xl font-bold text-red-600">৳{totalAmount}</p>
                  <p className="text-sm text-gray-500 mt-2">Pay by month end</p>
                </div>
              </div>

              {/* Recent Meals */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Meals</h2>
                <div className="space-y-3">
                  {mealHistory.slice(0, 5).map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{meal.foodItem}</p>
                        <p className="text-sm text-gray-600">{meal.hotelName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">৳{meal.price}</p>
                        <p className="text-sm text-gray-500">{meal.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hotels Tab */}
          {activeTab === "hotels" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img src={hotel.logo} alt={hotel.name} className="w-full h-40 object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{hotel.location}</p>
                    <Link
                      to={`/hotel/${hotel.id}`}
                      className="block w-full text-center py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Meal Tab */}
          {activeTab === "add-meal" && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Meal Entry</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Hotel
                  </label>
                  <select
                    value={selectedHotel}
                    onChange={(e) => {
                      setSelectedHotel(e.target.value);
                      setSelectedMeal("");
                    }}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none"
                  >
                    <option value="">Choose a hotel...</option>
                    {joinedHotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedHotel && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Food Item
                    </label>
                    <select
                      value={selectedMeal}
                      onChange={(e) => setSelectedMeal(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none"
                    >
                      <option value="">Choose a food item...</option>
                      {availableMenuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ৳{item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedMeal && (
                  <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Price will be auto-fetched:</p>
                    <p className="text-2xl font-bold text-green-600">
                      ৳
                      {availableMenuItems.find((item) => item.id === selectedMeal)?.price || 0}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleAddMeal}
                  disabled={!selectedHotel || !selectedMeal}
                  className="w-full py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Meal Entry
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Meal History - {currentMonth}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hotel</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Food Item</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mealHistory.map((meal) => (
                      <tr key={meal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{meal.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{meal.hotelName}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{meal.foodItem}</td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                          ৳{meal.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-800">
                        Total Payable Amount:
                      </td>
                      <td className="px-6 py-4 text-right text-xl font-bold text-green-600">
                        ৳{totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <img
                  src={student.profileImage}
                  alt={student.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                <p className="text-gray-600">{student.studentId}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="font-semibold text-gray-800">{student.department}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-800">{student.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-800">{student.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Joined Hotels</p>
                  <p className="font-semibold text-gray-800">{student.joinedHotels.length} Hotels</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
