import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LoginPage from "./pages/Login";
import { Toaster } from "sonner";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
     <Toaster richColors position="top-right" />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <div className="flex">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="flex-1">
              <Topbar setIsOpen={setIsOpen} />
              <Home />
            </div>
          </div>
        }
      />
    </Routes>
    </>
  );
}

export default App;