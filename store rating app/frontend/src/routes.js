import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StoreDetails from "./pages/StoreDetails";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageStores from "./pages/Admin/ManageStores";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stores/:storeId" element={<StoreDetails />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-stores" element={<ManageStores />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

