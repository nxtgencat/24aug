import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App(){
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router}/>
        <ToastContainer position="top-right" autoClose={2000} theme="light"/>
      </NotificationProvider>
    </AuthProvider>
  );
}
