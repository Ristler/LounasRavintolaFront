// TopMenu.jsx
import { Menu } from "antd";
import { HomeOutlined, ProfileOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeaderMenu() {
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
    console.log("Token from localStorage:", token); // Debug log
    setIsAuthenticated(!!token); // cleaner boolean check
    console.log("isAuthenticated state:", !!token); // Debug log
  }, [location]);

  
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
      <Menu.Item key="2" icon={<ShoppingCartOutlined />}>Tilaa ruokaa</Menu.Item>
      
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
    </Menu>
  );
}
