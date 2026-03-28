import {
  Leaf,
  LayoutDashboard,
  Users,
  AlertCircle,
  LogOut,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../store/slices/SideBar";
import type { ApiDispatch, RootState } from "../store/store";
import { fetchUser, logout } from "@/store/slices/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const dispatch = useDispatch<ApiDispatch>();
  const navigation = useNavigate();

  const navItems = useSelector((state: RootState) => state.auth.navItems);
  const selectedOption = useSelector(
    (state: RootState) => state.sidebar.selectedOption,
  );

  const userType = useSelector((state: RootState) => state.auth.role);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const hasDashboard = navItems.some((i) => i.label === "Dashboard");
  const hasComplaints = navItems.some((i) => i.label === "Complaints");
  const hasDistrictAdmins = navItems.some((i) => i.label === "District Admins");

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 z-50 h-full w-60 bg-white border-r border-green-100 p-4 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Leaf size={24} className="text-green-700" />
          <span className="text-lg font-bold text-green-700">Eco-Reporter</span>
        </div>

        <nav className="flex-1">
          <span className="text-xs font-semibold ml-3 text-gray-400 tracking-widest">
            MANAGEMENT
          </span>

          <ul className="mt-3 space-y-1">
            {hasDashboard && (
              <li
                onClick={() => {
                  dispatch(setSelectedOption("Dashboard" as any));
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors
                ${
                  selectedOption === "Dashboard"
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {selectedOption === "Dashboard" ? (
                  <span className="w-4.5 h-4.5 shrink-0" />
                ) : (
                  <LayoutDashboard
                    size={18}
                    className="text-gray-400 shrink-0"
                  />
                )}
                Dashboard
                {selectedOption === "Dashboard" && (
                  <span className="ml-auto w-1 h-5 rounded-full bg-green-600" />
                )}
              </li>
            )}

            {hasComplaints && (
              <li
                onClick={() => {
                  dispatch(setSelectedOption("Complaints" as any));
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors
                ${
                  selectedOption === "Complaints"
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {selectedOption === "Complaints" ? (
                  <span className="w-4.5 h-4.5 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-gray-400 shrink-0" />
                )}
                Complaints
                {selectedOption === "Complaints" && (
                  <span className="ml-auto w-1 h-5 rounded-full bg-green-600" />
                )}
              </li>
            )}

            {hasDistrictAdmins && userType === "ADMIN" && (
              <li
                onClick={() => {
                  dispatch(setSelectedOption("District Admins" as any));
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors
                ${
                  selectedOption === "District Admins"
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {selectedOption === "District Admins" ? (
                  <span className="w-4.5 h-4.5 shrink-0" />
                ) : (
                  <Users size={18} className="text-gray-400 shrink-0" />
                )}
                District Admins
                {selectedOption === "District Admins" && (
                  <span className="ml-auto w-1 h-5 rounded-full bg-green-600" />
                )}
              </li>
            )}
          </ul>
        </nav>

        <div
          onClick={() => {
            dispatch(logout());
            navigation("/login");
          }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
        >
          <LogOut size={18} />
          Log out
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
