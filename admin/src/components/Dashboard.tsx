import { AlertCircle, Check, Clock, Users } from "lucide-react";
import PieChart from "./PieChart";
import { useDispatch, useSelector } from "react-redux";
import type { ApiDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { getStats } from "@/store/slices/auth";

function Dashboard() {
  const dispatch = useDispatch<ApiDispatch>();
  const { stats, statsloading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getStats());
  }, []);

  const resolved = (stats?.totalComplaints ?? 0) - (stats?.totalPendingComplaints ?? 0); // 👈 resolved = total - pending

  const navItems = [
    { icon: AlertCircle, label: "Total Complaints",   value: stats?.totalComplaints ?? 0 },
    { icon: Clock,       label: "Pending Complaints", value: stats?.totalPendingComplaints ?? 0 },
    { icon: Check,       label: "Resolved Complaints",value: resolved },
    { icon: Users,       label: "Total Admins",       value: stats?.totalComplaintsAdmin ?? 0 },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mt-2">
        <h1 className="font-bold text-2xl md:text-3xl">Dashboard</h1>
        <span className="text-gray-500 text-sm md:text-base">
          Welcome back. Here's what's happening today.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {statsloading ? (
          // skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg w-10 h-10 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          navItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon size={22} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
        <PieChart values={[resolved, stats?.totalPendingComplaints ?? 0]} /> {/* 👈 fixed */}
      </div>
    </div>
  );
}

export default Dashboard;