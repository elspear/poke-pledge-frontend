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
import ProfilePage from "./pages/ProfilePage.jsx";

import NavBar from "./components/NavBar.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import AuthRequiredPage from "./pages/AuthRequiredPage.jsx";

 
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
          { path: "/create-fundraiser/", element: (
              <RequireAuth>
                <CreateFundraiserPage />
              </RequireAuth>
            )
          },
          { path: "/auth-required/", element: <AuthRequiredPage /> },
          { path: "/fundraiser/:id/edit", element: <EditFundraiserPage />},
          { path: "/fundraiser/:id/pledge", element: <PledgeForm />},

          // Profile routes
          { 
              path: "/profile/", 
              element: (
                  <RequireAuth>
                      <ProfilePage />
                  </RequireAuth>
              )
          },
          { 
              path: "/profile/:id/", 
              element: (
                  <RequireAuth>
                      <ProfilePage />
                  </RequireAuth>
              )
          }
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