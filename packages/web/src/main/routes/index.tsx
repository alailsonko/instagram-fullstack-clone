import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'main/pages/Home';
import SignUp from 'main/pages/SignUp';
import { AnimatePresence } from 'framer-motion';

function RoutesApp() {
  // const location = useLocation();
  return (
    <BrowserRouter>
      <AnimatePresence exitBeforeEnter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/emailsignup" element={<SignUp />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default RoutesApp;
