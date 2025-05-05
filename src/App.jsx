import { Layout, ConfigProvider } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

import HeaderMenu from './components/menu';
import Landing from './components/landing'; 
import Profile from './components/profile'; 
import Login from './components/login';
import OrderFood from "./components/orderFood";
import Register from "./components/register";

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <ConfigProvider>
      <Router basename="/"> 
        <AuthProvider> 
          <CartProvider>
            <Layout className="h-screen flex flex-col">
              <Header className="bg-gray-800 text-white flex-none p-0">
                <HeaderMenu />
              </Header>
              
              <Content className="flex-auto overflow-y-auto text-center bg-white text-black">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/profiili" element={<Profile />} />
                  <Route path="/kirjaudu" element={<Login />} />
                  <Route path="/tilaa" element={<OrderFood />} />
                  <Route path="/liity" element={<Register />} />
                </Routes>
              </Content>

              <Footer className="!bg-gray-800 !text-white text-center flex-none">
                Lounasravintola 2025
              </Footer>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
