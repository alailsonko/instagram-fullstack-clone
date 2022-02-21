import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'main/pages/Home';
import SignUp from 'main/pages/SignUp';

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accounts/emailsignup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesApp;
