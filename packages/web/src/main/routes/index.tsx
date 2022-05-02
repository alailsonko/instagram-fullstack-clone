import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from 'main/pages/Home';
import SignUp from 'main/pages/SignUp';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, memo, ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { authPersist } from 'infra/auth/jwt';

interface Props {
  children: ReactElement;
}

const Animation = ({ children }: Props) => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.5
      }
    },
    exit: {
      x: '-100vh',
      transition: {
        ease: 'easeInOut'
      }
    }
  };
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      {children}
    </motion.div>
  );
};

const ProtectedRoute: FC<Props> = memo(({ children }: Props): ReactElement<any, any> => {
  const isAuthenticated = useRecoilValue(authPersist);
  if (!isAuthenticated) {
    return <> </>;
  }
  return <Animation>{children}</Animation>;
});

const UnprotectedRoute: FC<Props> = memo(({ children }: Props): ReactElement<any, any> => {
  const isAuthenticated = useRecoilValue(authPersist);
  if (isAuthenticated) {
    return <> </>;
  }
  return <Animation>{children}</Animation>;
});

const UnprotectedRedirectRoute: FC<Props> = memo(({ children }: Props): ReactElement<any, any> => {
  const isAuthenticated = useRecoilValue(authPersist);
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <Animation>{children}</Animation>;
});

const Hello: FC<{}> = () => <div>Hello</div>;

function RoutesApp() {
  return (
    <BrowserRouter>
      <AnimatePresence exitBeforeEnter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <UnprotectedRoute>
                  <Home />
                </UnprotectedRoute>
                <ProtectedRoute>
                  <Hello />
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path="/accounts/emailsignup"
            element={
              <UnprotectedRedirectRoute>
                <SignUp />
              </UnprotectedRedirectRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default RoutesApp;
