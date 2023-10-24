import React from 'react';
import { useAppSelector } from './redux/hooks/hooks';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Login';
import ContentPage from './Pages/Content';
import 'bootstrap/dist/css/bootstrap.min.css'



const App: React.FC = () => {

  const { isAuthenticated } = useAppSelector(state => state.login)
  const [user, setUser] = React.useState<string | null>('')
  
  React.useEffect(() => {

    const user = localStorage.getItem('user')
    setUser(user)

  }, [])
  
  return (
    <>
      <Router>
          <Routes>
            <Route path='/' element={isAuthenticated || user ? <ContentPage /> : <Navigate to='/login' />} />
            <Route path='/login' element={isAuthenticated || user ? <ContentPage /> : <LoginPage />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>

      </Router>
    </>
  );
}

export default App;
