import { Menu } from "lucide-react";

function Topbar({ setIsOpen }: { setIsOpen: (v: boolean) => void }) {
  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
      <button onClick={() => setIsOpen(true)}>
        <Menu size={24} />
      </button>
      <h1 className="font-bold text-green-700">Eco-Reporter</h1>
    </div>
  );
}

export default Topbar;