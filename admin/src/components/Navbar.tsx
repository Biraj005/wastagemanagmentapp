import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

function Navbar() {
  const name = useSelector((state: RootState) => state.auth.user?.username);

  return (
    <nav className="flex items-center w-full bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex flex-col sm:block">
        <h1 className="text-lg font-semibold text-gray-800">
          Welcome back, {name?.split(" ")[0]} 👋
        </h1>
        <span className="text-xs text-gray-400">
          Here's what's happening today.
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        <div className="w-px h-5 bg-gray-200" />

        <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
            {name?.charAt(0) ?? "U"}
          </div>
          <span className="text-sm text-gray-700 font-medium">{name}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
