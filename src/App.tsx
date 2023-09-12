import CustomRoutes from './routes/routes';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <CustomRoutes />
    </AuthContextProvider>
  );
}

export default App;
