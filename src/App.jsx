

//IMPORTTAA ANTD KOMPONENTIT
import { Layout, Button, Menu } from "antd";

//IMPORTTAA ANTD ICONS
import { HomeOutlined, ProfileOutlined, ShoppingCartOutlined } from '@ant-design/icons';


//REACT ROUTER
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

//SIVU KOMPONETIT
import Login from './components/login';
import Landing from './components/landing'; 
import Profile from './components/profile'; 

//ANTD LAYOUTIN KOMPONENTIT
const { Header, Footer, Content } = Layout;






//MAIN APP
function App() {
  
  //TODO PITÄIS LÄHETTÄÄ ESIM /PROFIILI JNE
  const handleMenu = (e) => {

    console.log(e.key);
    if(e.key == 1) {
      console.log("Koti näppäintä painettu");


    }
    else if(e.key == 2) {
      console.log("Tilaa ruokaa nappi painettu")
    }
    else if(e.key == 3) {
      console.log("Profiili nappia painettu")
    }
  }


  //ROUTER ON TÄÄLLÄ. / PATH CHANGES VAIKUTTAA PELKÄSTÄÄN
  // NTD KOMPONENTTIIN "CONTENT" ELI NS BODY MUUTTUU,
  //ROUTER AVAA TIETYN KOMPONENTIT, -> PAGES KANSIOSSA.
  //ELI HEADER JA FOOTER PYSYY SAMANA.
  return (


    <Router>
      <Layout>


        <Header theme="dark">
          <Menu mode="horizontal" className="text-center flex justify-center w-full">
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={handleMenu}>
            Kotiin
          </Menu.Item>

         

          <Menu.Item key="2" icon={<ShoppingCartOutlined />} onClick={handleMenu}>
            Tilaa ruokaa
          </Menu.Item>

          <Menu.Item key="3" icon={<ProfileOutlined />} onClick={handleMenu}>
            Profiili
          </Menu.Item>

          </Menu>

        </Header>



        <Content className="flex justify-center items-center min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/profiili" element={<Profile />} />
          </Routes>
        </Content>


        <Footer className='text-center text-white'>Lounasravintola 2025</Footer>
      </Layout>
    </Router>


  );
}

export default App;