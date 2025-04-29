
import { Popover, Button, Badge } from "antd";
import { 
  HomeOutlined,
  UserOutlined, 
  ShoppingCartOutlined,
  ShoppingOutlined,
  DeleteOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  MenuOutlined
} from '@ant-design/icons';

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from '../context/CartContext.jsx';

export default function HeaderMenu() {
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);
  
  const CartContent = () => (
    <div className="min-w-[280px] max-h-[400px] overflow-y-auto py-2">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center py-6">
          <ShoppingCartOutlined className="text-3xl text-gray-300 mb-2" />
          <p className="text-gray-500">Ostoskori on tyhjä</p>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-3 p-2 hover:bg-gray-50 rounded-lg transition duration-150">
              <div className="flex items-center gap-3">
                <img 
                  src={item.photo} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded-md shadow-sm"
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-orange-500">{item.price}€</span>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center justify-center hover:bg-red-50"
                />
              </div>
            </div>
          ))}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-bold mb-3">
              <span>Yhteensä:</span>
              <span className="text-orange-500">{getCartTotal().toFixed(2)}€</span>
            </div>
            <Button 
              type="primary" 
              className="w-full h-10 text-base font-medium shadow-md bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/')}
            >
              Siirry kassalle
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const handleMenu = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  const handleAuth = (isAuth) => {
    if (isAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      navigate("/");
    } else {
      navigate("/liity");
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    console.log("Toggle mobile menu, current state:", mobileMenuOpen);
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
              <HomeOutlined />
              <span>Kotiin</span>
            </button>
            
            <button 
              onClick={() => handleMenu("/tilaa")}
              className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors
                ${location.pathname === "/tilaa" 
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
            content={<CartContent />}
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
            content={<CartContent />}
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
            <HomeOutlined />
            <span>Kotiin</span>
          </button>
          
          <button 
            onClick={() => handleMenu("/tilaa")}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-3 transition-colors
              ${location.pathname === "/tilaa" 
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
