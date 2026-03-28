import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Complaint from "../components/Complaint";
import DistrictAdmin from "../components/DitrictAdmin";
import { useDispatch, useSelector } from "react-redux";
import type { ApiDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { fetchUser } from "@/store/slices/auth";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Home() {
  const selectedOption = useSelector(
    (state: RootState) => state.sidebar.selectedOption
  );
  const navigate = useNavigate();

  const dispatch = useDispatch<ApiDispatch>();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const renderPage = () => {
    switch (selectedOption) {
      case "Dashboard": return <Dashboard />;
      case "Complaints": return <Complaint />;
      case "District Admins": return <DistrictAdmin />;
      default: return <Dashboard />;
    }
  };

 useEffect(() => {
  const token = Cookies.get("token");
  if (!token) {
    navigate("/login");
  } else {
    dispatch(fetchUser());
  }
}, [dispatch, navigate]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }
  if (error) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="flex flex-col flex-1 min-h-screen bg-gray-50 p-4">
      <Navbar />
      {renderPage()}
    </main>
  );
}