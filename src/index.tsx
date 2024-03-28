import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import LoginPage from './routes/Login/LoginPage';
import RegisterPage from './routes/Login/RegisterPage';
import HomePage from './routes/HomePage/HomePage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "/HomePage",
    element: <HomePage key="page2" isMobile={false}/>,
    errorElement: <ErrorPage />
  },
  {
    path: "/modelpage",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/LoginPage",
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/RegisterPage',
    element: <RegisterPage />,
    errorElement: <ErrorPage />
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
