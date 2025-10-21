import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import FundraiserPage from "./pages/FundraiserPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CompleteSignupForm from "./components/CompleteSignupForm.jsx";
import CreateFundraiserPage from "./pages/CreateFundraiserPage.jsx";
import EditFundraiserPage from "./pages/EditFundraiserPage.jsx";
import PledgeForm from "./components/PledgeForm.jsx";

import NavBar from "./components/NavBar.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import AboutPage from "./pages/AboutPage.jsx";
 
const router = createBrowserRouter([
  {
      path: "/",
      element: <NavBar />,
      children: [
          { path: "/", element: <HomePage /> },
          { path: "/login/", element: <LoginPage /> },
          { path: "/signup/", element: <SignupPage /> },
          { path: "/about/", element: <AboutPage /> },
          { path: "/complete-signup/", element: <CompleteSignupForm /> },
          { path: "/fundraiser/:id/", element: <FundraiserPage /> },
          { path: "/create-fundraiser/", element: <CreateFundraiserPage />},
          { path: "/fundraiser/:id/edit", element: <EditFundraiserPage />},
          { path: "/fundraiser/:id/pledge", element: <PledgeForm />},
      ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);