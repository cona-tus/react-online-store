import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './pages/ProtectedRoute';
import NewProduct from './pages/NewProduct';
import MyBags from './pages/MyBags';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />,
      },
      {
        path: '/products/:id',
        element: <ProductDetail />,
      },
      {
        path: '/shop',
        element: <Shop />,
      },
      {
        path: '/shop/:category',
        element: <Shop />,
      },
      {
        path: '/products/new',
        element: (
          <ProtectedRoute requireAdmin>
            <NewProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: '/bags',
        element: (
          <ProtectedRoute>
            <MyBags />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
