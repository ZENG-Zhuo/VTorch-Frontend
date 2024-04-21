import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import LoginPage from "./routes/Login/LoginPage";
import RegisterPage from "./routes/Login/RegisterPage";
import HomePage from "./routes/HomePage/HomePage.jsx";
import { error } from "console";
import TestPage from "./routes/TestPage";
import DatasetPage, {
    DatasetContext,
} from "./routes/DatasetBuilding/DatasetPage";
import CodeGenerationPage from "./routes/CodeGeneration/CodeGenerationPage";
import { DatasetInfo } from "./common/datasetTypes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/HomePage",
        element: <HomePage key="page2" isMobile={false} />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/modelpage",
        element: <App />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/LoginPage",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/RegisterPage",
        element: <RegisterPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/test",
        element: <TestPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dataset",
        element: <DatasetPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/codeGeneration",        
        element: <CodeGenerationPage />,
        errorElement: <ErrorPage />,
    },
]);

const datasets: Map<string, DatasetInfo> = new Map();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <DatasetContext.Provider value={datasets}>
            <RouterProvider router={router} />
        </DatasetContext.Provider>
    </React.StrictMode>
);

reportWebVitals();
