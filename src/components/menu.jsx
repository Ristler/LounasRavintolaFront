// TopMenu.jsx
import { Menu, Popover, Button, Badge } from "antd";
import { 
  HomeOutlined,
  ProfileOutlined, 
  ShoppingCartOutlined,
  ShoppingOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from '../context/CartContext.jsx';

export default function HeaderMenu() {
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //ASETA TESTI TOKENI LOCAL STORAGEEN
  //localStorage.setItem("token", "testi"); 

  //POISTA TOKEN LOCAL STORAGESTA, TAI SIT BROWSERIN KAUTTA 
  //localStorage.removeItem("token"); 


  //TARKISTA ONKO TOKEN LOCAL STORAGESSA, TÄÄ RUNNAA AINA KUN SIVU LATAUTUU
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); 
    setIsAuthenticated(!!token); 
    console.log("isAuthenticated state:", !!token); 
  }, [location]);

  
  const CartContent = () => (
    <div className="min-w-[250px]">
      {cartItems.length === 0 ? (
        <p>Ostoskori on tyhjä</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <img 
                  src={item.photo} 
                  alt={item.name} 
                  className="w-10 h-10 object-cover rounded"
                />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{item.price}€</span>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item.id)}
                />
              </div>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold mb-2">
              <span>Yhteensä:</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>
            <Button 
              type="primary" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Siirry kassalle
            </Button>
          </div>
        </>
      )}
    </div>
  );



  const handleMenu = (e) => {
    if (e.key === "1") {
      navigate("/");
    } 
    else if (e.key === "2") {
      navigate("/tilaa");
    } 
    else if (e.key === "3") {
      if (isAuthenticated) {
        navigate("/profiili");
      } else {
        navigate("/kirjaudu");
      }
    } 
    else if (e.key === "4") {
      if (isAuthenticated) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
      } else {
        navigate("/liity");
      }
    }
  };

  const selectedKey =
    location.pathname === "/" ? "1" :
    location.pathname === "/tilaa" ? "2" :
    location.pathname === "/profiili" || location.pathname === "/kirjaudu" ? "3" :

    "";

  return (
    <Menu
      mode="horizontal"
      theme="dark"
      onClick={handleMenu}
      selectedKeys={[selectedKey]}
      className="text-center flex justify-center w-full bg-gray-800"
    >
      <Menu.Item key="1" icon={<HomeOutlined />}>Kotiin</Menu.Item>
      <Menu.Item key="2" icon={<ShoppingOutlined/>}>Tilaa ruokaa</Menu.Item>
      
      <Menu.Item key="3" icon={<ProfileOutlined />}>
        {isAuthenticated ? (
          <span>Profiili</span>
        ) : (
          <span>Kirjaudu sisään</span>
        )}
      </Menu.Item>

      <Menu.Item key="4" icon={<ProfileOutlined />}>
        {isAuthenticated ? (
          <span>Kirjaudu ulos</span>
        ) : (
          <span>Rekisteröidy</span>
        )}
      </Menu.Item>



      <Menu.Item key="5">
        <Popover 
          content={<CartContent />}
          title="Ostoskori"
          trigger="click"
          placement="bottom"
        >
          <Badge count={cartItems.length} offset={[17, 3]}>
            <ShoppingCartOutlined className=" text-white" />
          </Badge>
        </Popover>
      </Menu.Item>
    </Menu>
  );
}
