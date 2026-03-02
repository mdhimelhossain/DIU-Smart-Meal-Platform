// Mock data for the application

export interface Hotel {
  id: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  contact: string;
  email: string;
  rating: number;
  totalStudents: number;
}

export interface MenuItem {
  id: string;
  hotelId: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  description: string;
}

export interface MealEntry {
  id: string;
  studentId: string;
  hotelId: string;
  hotelName: string;
  foodItem: string;
  price: number;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  department: string;
  phone: string;
  email: string;
  profileImage: string;
  joinedHotels: string[];
}

export interface HotelOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  hotelId: string;
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "Campus Canteen",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    location: "DIU Campus, Ashulia",
    description: "Traditional Bangladeshi cuisine with modern dining experience. Best for daily meals.",
    contact: "+880 1712-345678",
    email: "campus@canteen.com",
    rating: 4.5,
    totalStudents: 145,
  },
  {
    id: "2",
    name: "Green Valley Restaurant",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    location: "Near DIU Gate 2",
    description: "Fresh and healthy meals prepared with organic ingredients. Special student discounts.",
    contact: "+880 1823-456789",
    email: "info@greenvalley.com",
    rating: 4.7,
    totalStudents: 98,
  },
  {
    id: "3",
    name: "Royal Biriyani House",
    logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
    location: "Ashulia Main Road",
    description: "Specialized in authentic Kacchi Biriyani and traditional rice dishes. Premium quality food.",
    contact: "+880 1934-567890",
    email: "royal@biriyani.com",
    rating: 4.8,
    totalStudents: 76,
  },
  {
    id: "4",
    name: "Fusion Cafe",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    location: "DIU Market Area",
    description: "Modern cafe with continental and desi fusion food. Perfect for quick bites and coffee.",
    contact: "+880 1645-678901",
    email: "hello@fusioncafe.com",
    rating: 4.3,
    totalStudents: 62,
  },
  {
    id: "5",
    name: "Healthy Bites",
    logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    location: "DIU Nearby",
    description: "Health-conscious meals with calorie tracking. Perfect for fitness enthusiasts.",
    contact: "+880 1756-789012",
    email: "contact@healthybites.com",
    rating: 4.6,
    totalStudents: 54,
  },
];

export const menuItems: MenuItem[] = [
  // Campus Canteen Menu
  { id: "m1", hotelId: "1", name: "Rice with Chicken Curry", price: 120, category: "Main Course", available: true, description: "Steamed rice with spicy chicken curry" },
  { id: "m2", hotelId: "1", name: "Rice with Beef Curry", price: 150, category: "Main Course", available: true, description: "Steamed rice with tender beef curry" },
  { id: "m3", hotelId: "1", name: "Dal Fry", price: 40, category: "Side Dish", available: true, description: "Fried lentils with spices" },
  { id: "m4", hotelId: "1", name: "Mixed Vegetables", price: 50, category: "Side Dish", available: true, description: "Seasonal mixed vegetables" },
  { id: "m5", hotelId: "1", name: "Egg Curry", price: 60, category: "Main Course", available: true, description: "Boiled eggs in curry" },
  
  // Green Valley Restaurant Menu
  { id: "m6", hotelId: "2", name: "Organic Chicken Salad", price: 180, category: "Salad", available: true, description: "Fresh organic chicken salad" },
  { id: "m7", hotelId: "2", name: "Brown Rice with Grilled Fish", price: 220, category: "Main Course", available: true, description: "Healthy brown rice with grilled fish" },
  { id: "m8", hotelId: "2", name: "Vegetable Soup", price: 80, category: "Soup", available: true, description: "Healthy vegetable soup" },
  { id: "m9", hotelId: "2", name: "Fresh Fruit Juice", price: 60, category: "Beverage", available: true, description: "Seasonal fresh juice" },
  { id: "m10", hotelId: "2", name: "Grilled Chicken Wrap", price: 150, category: "Snacks", available: false, description: "Grilled chicken in tortilla wrap" },
  
  // Royal Biriyani House Menu
  { id: "m11", hotelId: "3", name: "Kacchi Biriyani", price: 250, category: "Biriyani", available: true, description: "Authentic Kacchi Biriyani" },
  { id: "m12", hotelId: "3", name: "Morog Polao", price: 200, category: "Rice", available: true, description: "Chicken Polao with special spices" },
  { id: "m13", hotelId: "3", name: "Beef Tehri", price: 180, category: "Rice", available: true, description: "Beef Tehri rice" },
  { id: "m14", hotelId: "3", name: "Borhani", price: 40, category: "Beverage", available: true, description: "Traditional yogurt drink" },
  { id: "m15", hotelId: "3", name: "Chicken Roast", price: 120, category: "Side Dish", available: true, description: "Spicy chicken roast" },
  
  // Fusion Cafe Menu
  { id: "m16", hotelId: "4", name: "Club Sandwich", price: 180, category: "Snacks", available: true, description: "Triple decker club sandwich" },
  { id: "m17", hotelId: "4", name: "Pasta Alfredo", price: 220, category: "Main Course", available: true, description: "Creamy pasta with chicken" },
  { id: "m18", hotelId: "4", name: "Cappuccino", price: 120, category: "Beverage", available: true, description: "Premium coffee" },
  { id: "m19", hotelId: "4", name: "French Fries", price: 80, category: "Snacks", available: true, description: "Crispy french fries" },
  { id: "m20", hotelId: "4", name: "Burger Combo", price: 250, category: "Combo", available: true, description: "Burger with fries and drink" },
  
  // Healthy Bites Menu
  { id: "m21", hotelId: "5", name: "Protein Bowl", price: 200, category: "Main Course", available: true, description: "High protein chicken bowl" },
  { id: "m22", hotelId: "5", name: "Green Smoothie", price: 100, category: "Beverage", available: true, description: "Healthy green smoothie" },
  { id: "m23", hotelId: "5", name: "Quinoa Salad", price: 180, category: "Salad", available: true, description: "Quinoa with fresh vegetables" },
  { id: "m24", hotelId: "5", name: "Grilled Chicken Breast", price: 220, category: "Main Course", available: true, description: "Plain grilled chicken" },
  { id: "m25", hotelId: "5", name: "Energy Bar", price: 50, category: "Snacks", available: true, description: "Homemade energy bar" },
];

export const sampleStudent: Student = {
  id: "s1",
  name: "Rakib Hasan",
  studentId: "201-35-3456",
  department: "Computer Science & Engineering",
  phone: "+880 1712-123456",
  email: "rakib@student.diu.edu.bd",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  joinedHotels: ["1", "2", "3"],
};

export const sampleMealHistory: MealEntry[] = [
  { id: "me1", studentId: "s1", hotelId: "1", hotelName: "Campus Canteen", foodItem: "Rice with Chicken Curry", price: 120, date: "2026-03-01" },
  { id: "me2", studentId: "s1", hotelId: "1", hotelName: "Campus Canteen", foodItem: "Dal Fry", price: 40, date: "2026-03-01" },
  { id: "me3", studentId: "s1", hotelId: "2", hotelName: "Green Valley Restaurant", foodItem: "Brown Rice with Grilled Fish", price: 220, date: "2026-02-28" },
  { id: "me4", studentId: "s1", hotelId: "3", hotelName: "Royal Biriyani House", foodItem: "Kacchi Biriyani", price: 250, date: "2026-02-27" },
  { id: "me5", studentId: "s1", hotelId: "1", hotelName: "Campus Canteen", foodItem: "Rice with Beef Curry", price: 150, date: "2026-02-26" },
  { id: "me6", studentId: "s1", hotelId: "2", hotelName: "Green Valley Restaurant", foodItem: "Organic Chicken Salad", price: 180, date: "2026-02-25" },
  { id: "me7", studentId: "s1", hotelId: "1", hotelName: "Campus Canteen", foodItem: "Egg Curry", price: 60, date: "2026-02-24" },
  { id: "me8", studentId: "s1", hotelId: "3", hotelName: "Royal Biriyani House", foodItem: "Morog Polao", price: 200, date: "2026-02-23" },
];

export const sampleHotelOwner: HotelOwner = {
  id: "ho1",
  name: "Karim Ahmed",
  email: "karim@campuscanteen.com",
  phone: "+880 1712-345678",
  hotelId: "1",
};

export interface StudentDue {
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  totalMeals: number;
  totalAmount: number;
  lastMealDate: string;
}

export const sampleStudentDues: StudentDue[] = [
  { studentId: "s1", studentName: "Rakib Hasan", studentIdNumber: "201-35-3456", totalMeals: 45, totalAmount: 5200, lastMealDate: "2026-03-01" },
  { studentId: "s2", studentName: "Nazia Rahman", studentIdNumber: "201-35-3457", totalMeals: 38, totalAmount: 4150, lastMealDate: "2026-02-28" },
  { studentId: "s3", studentName: "Fahim Ahmed", studentIdNumber: "201-35-3458", totalMeals: 52, totalAmount: 6800, lastMealDate: "2026-03-01" },
  { studentId: "s4", studentName: "Tasnim Akter", studentIdNumber: "201-35-3459", totalMeals: 41, totalAmount: 4950, lastMealDate: "2026-02-27" },
  { studentId: "s5", studentName: "Sabbir Hossain", studentIdNumber: "201-35-3460", totalMeals: 48, totalAmount: 5600, lastMealDate: "2026-02-29" },
];
