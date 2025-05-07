import { Popover, Button, Badge } from "antd";
import { 
  HomeOutlined, UserOutlined, ShoppingCartOutlined, ShoppingOutlined,
  DeleteOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined, 
  MenuOutlined, SettingOutlined
} from '@ant-design/icons';

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from '../context/CartContext.jsx';
import ShoppingCart from "./shoppingCart";
import { userLogout } from "../hooks/authApiHook.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function HeaderMenu() {
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user && user.rooli === 'admin';
  
  useEffect(() => {
   
  }, [user, isAuthenticated]);

  const handleMenu = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  const handleAuth = async (isAuth) => {
    if (isAuth) {
      try {
  
        await userLogout();
        
        logout();
        
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      navigate("/liity");
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState);
  };

  //DESKTOP MENU
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="hidden md:flex flex-col items-center px-6 py-0 max-w-7xl mx-auto">
        <div className="flex items-center justify-center w-full">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleMenu("/")}
              className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors
                ${location.pathname === "/" 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              <ShoppingOutlined />
              <span>Tilaa ruokaa</span>
            </button>
            
            <button 
              onClick={() => handleMenu(isAuthenticated ? "/profiili" : "/kirjaudu")}
              className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors
                ${(location.pathname === "/profiili" || location.pathname === "/kirjaudu") 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              {isAuthenticated ? <UserOutlined /> : <LoginOutlined />}
              <span>{isAuthenticated ? "Profiili" : "Kirjaudu sisään"}</span>
            </button>
            
            {/* Admin button - only show if user is admin */}
            {isAdmin && (
              <button 
                onClick={() => handleMenu("/admin")}
                className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors
                  ${location.pathname === "/admin" 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              >
                <SettingOutlined />
                <span>Hallinta</span>
              </button>
            )}
            
            <button 
              onClick={() => handleAuth(isAuthenticated)}
              className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors
                ${isAuthenticated 
                  ? "text-red-300 hover:bg-red-900/30 hover:text-red-200" 
                  : "text-green-300 hover:bg-green-900/30 hover:text-green-200"}`}
            >
              {isAuthenticated ? <LogoutOutlined /> : <UserAddOutlined />}
              <span>{isAuthenticated ? "Kirjaudu ulos" : "Rekisteröidy"}</span>
            </button>
          </div>
          
          <div className="border-l border-gray-600 h-8 mx-4"></div>
          
          <Popover 
            content={<ShoppingCart />}
            title={
              <div className="flex items-center justify-between">
                <span className="font-medium">Ostoskori</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {cartItems.length} {cartItems.length === 1 ? 'tuote' : 'tuotetta'}
                </span>
              </div>
            }
            trigger="click"
            placement="bottomRight"
          >
            <Badge count={cartItems.length} size="small" offset={[0, 3]}>
              <button className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-700 rounded-full transition-colors">
                <ShoppingCartOutlined className="text-xl" />
              </button>
            </Badge>
          </Popover>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-3">
          <Popover 
            content={<ShoppingCart />}
            title="Ostoskori"
            trigger="click"
            placement="bottomRight"
          >
            <Badge count={cartItems.length} size="small">
              <button className="w-9 h-9 flex items-center justify-center text-white hover:bg-gray-700 rounded-full transition-colors">
                <ShoppingCartOutlined />
              </button>
            </Badge>
          </Popover>
          
          <button 
            onClick={toggleMobileMenu} 
            className="text-white hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <MenuOutlined />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu*/}
      <div 
        className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'max-h-[500px] opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}
      >
        <div className="px-4 space-y-1">
          <button 
            onClick={() => handleMenu("/")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-3 transition-colors
              ${location.pathname === "/" 
                ? "bg-gray-700 text-white" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            <ShoppingOutlined />
            <span>Tilaa ruokaa</span>
          </button>
          
          <button 
            onClick={() => handleMenu(isAuthenticated ? "/profiili" : "/kirjaudu")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-3 transition-colors
              ${(location.pathname === "/profiili" || location.pathname === "/kirjaudu") 
                ? "bg-gray-700 text-white" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            {isAuthenticated ? <UserOutlined /> : <LoginOutlined />}
            <span>{isAuthenticated ? "Profiili" : "Kirjaudu sisään"}</span>
          </button>
          
          {/* Admin button in mobile menu - only for admins */}
          {isAdmin && (
            <button 
              onClick={() => handleMenu("/admin")}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-3 transition-colors
                ${location.pathname === "/admin" 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
            >
              <SettingOutlined />
              <span>Hallinta</span>
            </button>
          )}
          
          <button 
            onClick={() => handleAuth(isAuthenticated)}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-3 transition-colors
              ${isAuthenticated 
                ? "text-red-300 hover:bg-red-900/30 hover:text-red-200" 
                : "text-green-300 hover:bg-green-900/30 hover:text-green-200"}`}
          >
            {isAuthenticated ? <LogoutOutlined /> : <UserAddOutlined />}
            <span>{isAuthenticated ? "Kirjaudu ulos" : "Rekisteröidy"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
