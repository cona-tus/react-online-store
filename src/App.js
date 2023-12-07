import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import useScrollToTop from './hooks/useScrollToTop';
import SkipNav from './components/Navbar/SkipNav';

const queryClient = new QueryClient();

function App() {
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SkipNav />
        <Navbar />
        <Outlet />
        <Footer />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
