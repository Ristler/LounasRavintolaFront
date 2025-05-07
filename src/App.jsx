import { Layout, ConfigProvider } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

import HeaderMenu from './components/menu';
import Profile from './components/profile'; 
import Login from './components/login';
import OrderFood from "./components/orderFood";
import Register from "./components/register";
import ProtectedRoute from "./components/protectedRoute";
import AdminPage from "./components/adminPage"; 

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
                  {/* Public routes */}
                  <Route path="/" element={<OrderFood />} />
                  <Route path="/kirjaudu" element={<Login />} />
                  <Route path="/liity" element={<Register />} />

               
              
            
                     
                  
                  {/* Protected routes */}
                  <Route 
                    path="/profiili" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />


                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly >
                        <AdminPage />
                      </ProtectedRoute>
                    }
                    />
             
                </Routes>
              </Content>

              <Footer className="!bg-gray-800 !text-white text-center flex-none">
              Mättötie 3B, 12345 Ruokakaupunki.
              Puh: 123-456-7890
              </Footer>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
