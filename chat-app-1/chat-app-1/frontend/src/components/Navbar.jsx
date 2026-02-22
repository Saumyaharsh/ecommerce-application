import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { MessageSquare, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold px-4">Chatty</h1>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to={"/settings"}>
              <Settings className="w-4 h-4" />
            </Link>
            {/* <a>Link</a> */}
          </li>
          {authUser && (
            <>
              <li>
                <Link to={"/profile"}>
                  <User className="w-4 h-4" />
                </Link>
              </li>
              <li>
                <button className="" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
