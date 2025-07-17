import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Appworking from './Appworking';

function App() {
   return (
      <Router>
            <Routes>
               <Route path="/traffic-light-app" element={<Appworking />} />   
            </Routes>
      </Router>
   );
}

export default App;