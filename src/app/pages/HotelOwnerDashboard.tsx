import { useState } from "react";
import { Link } from "react-router";
import {
  Home,
  UtensilsCrossed,
  Users,
  DollarSign,
  LogOut,
  Menu,
  X,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
} from "lucide-react";
import { sampleHotelOwner, hotels, menuItems, sampleStudentDues } from "../data/mockData";

type TabType = "overview" | "menu" | "students" | "revenue";

interface MenuItemForm {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
}

export function HotelOwnerDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemForm | null>(null);

  const owner = sampleHotelOwner;
  const hotel = hotels.find((h) => h.id === owner.hotelId);
  const hotelMenuItems = menuItems.filter((item) => item.hotelId === owner.hotelId);
  const studentDues = sampleStudentDues;

  const totalStudents = hotel?.totalStudents || 0;
  const totalRevenue = studentDues.reduce((sum, student) => sum + student.totalAmount, 0);
  const totalMealsServed = studentDues.reduce((sum, student) => sum + student.totalMeals, 0);

  const handleToggleAvailability = (itemId: string) => {
    alert(`Toggled availability for item ${itemId}`);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      alert(`Deleted item ${itemId}`);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      available: item.available,
    });
    setIsAddMenuOpen(true);
  };

  const handleSaveMenuItem = () => {
    alert(editingItem?.id ? "Menu item updated!" : "Menu item added!");
    setIsAddMenuOpen(false);
    setEditingItem(null);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">{hotel?.name}</h3>
        <p className="text-sm text-gray-600">{owner.name}</p>
      </div>

      <nav className="p-4 space-y-2">
        {[
          { id: "overview", label: "Overview", icon: Home },
          { id: "menu", label: "Manage Menu", icon: UtensilsCrossed },
          { id: "students", label: "Student Dues", icon: Users },
          { id: "revenue", label: "Revenue", icon: DollarSign },
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
          <h2 className="text-xl font-bold text-green-600">Hotel Owner Portal</h2>
        </div>
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-green-600">Hotel Portal</h2>
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
            {activeTab === "menu" && "Manage Menu"}
            {activeTab === "students" && "Student Dues"}
            {activeTab === "revenue" && "Revenue Summary"}
          </h1>
          <div className="w-10" />
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
                      <Users className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">Total Students</h3>
                  <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
                  <p className="text-sm text-gray-500 mt-2">Active postpaid users</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <UtensilsCrossed className="text-purple-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">Total Meals Served</h3>
                  <p className="text-3xl font-bold text-gray-800">{totalMealsServed}</p>
                  <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">Monthly Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">৳{totalRevenue}</p>
                  <p className="text-sm text-gray-500 mt-2">Total due amount</p>
                </div>
              </div>

              {/* Hotel Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hotel Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Hotel Name</p>
                    <p className="font-semibold text-gray-800">{hotel?.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-800">{hotel?.location}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Contact</p>
                    <p className="font-semibold text-gray-800">{hotel?.contact}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-800">{hotel?.email}</p>
                  </div>
                </div>
              </div>

              {/* Recent Student Activity */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Student Activity</h2>
                <div className="space-y-3">
                  {studentDues.slice(0, 5).map((student) => (
                    <div
                      key={student.studentId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{student.studentName}</p>
                        <p className="text-sm text-gray-600">{student.studentIdNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">৳{student.totalAmount}</p>
                        <p className="text-sm text-gray-500">{student.totalMeals} meals</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Menu Items</h2>
                <button
                  onClick={() => {
                    setEditingItem({
                      id: "",
                      name: "",
                      price: 0,
                      category: "",
                      description: "",
                      available: true,
                    });
                    setIsAddMenuOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
                >
                  <Plus size={20} />
                  Add New Item
                </button>
              </div>

              {/* Add/Edit Menu Form */}
              {isAddMenuOpen && editingItem && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {editingItem.id ? "Edit Menu Item" : "Add New Menu Item"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, name: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none"
                        placeholder="Rice with Chicken"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (৳)
                      </label>
                      <input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, price: Number(e.target.value) })
                        }
                        className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, category: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none"
                        placeholder="Main Course"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editingItem.description}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, description: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:outline-none"
                        placeholder="Steamed rice with curry"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveMenuItem}
                      className="px-6 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
                    >
                      Save Item
                    </button>
                    <button
                      onClick={() => {
                        setIsAddMenuOpen(false);
                        setEditingItem(null);
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Items Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Item Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {hotelMenuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">{item.category}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">৳{item.price}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleAvailability(item.id)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.available
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.available ? "Available" : "Out of Stock"}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Student-wise Due Amount</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Student ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Total Meals
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Due Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Last Meal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentDues.map((student) => (
                      <tr key={student.studentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.studentIdNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">{student.totalMeals}</td>
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                          ৳{student.totalAmount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.lastMealDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-800">
                        Total Revenue:
                      </td>
                      <td className="px-6 py-4 text-right text-xl font-bold text-green-600">
                        ৳{totalRevenue}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-gray-600 text-sm mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">৳{totalRevenue}</p>
                  <p className="text-sm text-gray-500 mt-2">Current month</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-gray-600 text-sm mb-2">Average per Student</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    ৳{Math.round(totalRevenue / totalStudents)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Per student this month</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-gray-600 text-sm mb-2">Average per Meal</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    ৳{Math.round(totalRevenue / totalMealsServed)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Per meal served</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Breakdown</h2>
                <div className="space-y-4">
                  {studentDues.map((student) => (
                    <div key={student.studentId} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{student.studentName}</p>
                        <p className="text-sm text-gray-600">{student.totalMeals} meals</p>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-green-600 h-full rounded-full"
                          style={{
                            width: `${(student.totalAmount / totalRevenue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-bold text-green-600">৳{student.totalAmount}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round((student.totalAmount / totalRevenue) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
