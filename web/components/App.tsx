import {
  SignedInOrRedirect,
  SignedOut,
  SignedOutOrRedirect,
  SignedIn,
  useSignOut,
} from "@gadgetinc/react";
import { AppType, Provider } from "@gadgetinc/react-shopify-app-bridge";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Navigate,
} from "react-router-dom";
import { api } from "../api";
import Index from "../routes/index";
import SignedInPage from "../routes/signed-in";
import SignInPage from "../routes/sign-in";
import SignUpPage from "../routes/sign-up";
import ResetPasswordPage from "../routes/reset-password";
import VerifyEmailPage from "../routes/verify-email";
import ChangePassword from "../routes/change-password";
import ForgotPassword from "../routes/forgot-password";
import Landing from "../routes/landing";
import "./App.css";
import { AuthProvider, ShopProvider } from "../providers";
import SyncDashboard from "../routes/sync-dashboard";
import Settings from "../routes/settings";
import "../styles/globals.css";
import { Button } from "../components/ui/button";
import NotFound from "../routes/not-found";
import Test from "../routes/test.tsx";
import Callback from "../routes/callback";  

const App = () => {
  useEffect(() => {
    document.title = `${process.env.GADGET_APP}`;
  }, []);
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        {/* Root route with conditional redirect */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/sync-dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/home" replace />
              </SignedOut>
            </>
          }
        />

        {/* Public route */}
        <Route
          path="/home"
          element={
            <SignedOutOrRedirect path="/sync-dashboard">
              <Landing />
            </SignedOutOrRedirect>
          }
        />

        {/* Protected route */}
        <Route
          path="/sync-dashboard"
          element={
            <SignedInOrRedirect path="/home">
              <SyncDashboard />
            </SignedInOrRedirect>
          }
        />

        <Route
          path="signed-in"
          element={
            <SignedInOrRedirect>
              <AuthProvider>
                <ShopProvider>
                  <SignedInPage />
                </ShopProvider>
              </AuthProvider>
            </SignedInOrRedirect>
          }
        />
        <Route 
          path="sync-dashboard" 
          element={
            <SignedInOrRedirect>
              <SyncDashboard />
            </SignedInOrRedirect>
          }
        />  
        <Route
          path="settings"
          element={
            <SignedInOrRedirect>
              <Settings />
            </SignedInOrRedirect>
          }
        />

        <Route
          path="callback"
          element={
            <SignedInOrRedirect>
              <Callback />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route 
          path="test" 
          element={
            <SignedInOrRedirect>
              <Test />
            </SignedInOrRedirect>
          }
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <NotFound signedIn={true} />
              </SignedIn>
              <SignedOut>
                <NotFound signedIn={false} />
              </SignedOut>
            </>
          }
        />
        {/*<Route path="onboarding" element={<Onboarding />} />*/}
      </Route>
    )
  );

  return (
    <Provider
      type={AppType.Standalone}
      shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
      api={api}
    >
      <Suspense fallback={<></>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
};

const Layout = () => {
  return (
    // Provider set to `AppType.Standalone` so tht it doesn't try to embed the app in the Shopify admin
    <AuthProvider>
      <ShopProvider>
        <Provider
          type={AppType.Standalone}
          shopifyApiKey={window.gadgetConfig.apiKeys.shopify}
          api={api}
      >
          <Header />
          <div className="app">
            <div className="app-content">
              <div className="main">
                <Outlet />
              </div>
            </div>
          </div>
        </Provider>
      </ShopProvider>
    </AuthProvider>
  );
};

const Header = () => {
  const signOut = useSignOut();

  return (
    <div className="header w-full flex justify-between">
      <div className="flex justify-between">  
        <SignedOut>
          <Link to="/home" className="logo">
            <h3 className="text-1rem font-semibold">sssync</h3>
            {/*{process.env.GADGET_APP}*/}
          </Link>
        </SignedOut>
      </div>

      <div className="header-content flex justify-end w-full">
        <SignedOut>
          <Link to="/sign-in" style={{ color: "black" }}>
            Sign in
          </Link>
          <Link to="/sign-up" style={{ color: "black" }}>
            Sign up
          </Link>
        </SignedOut>
        <AuthProvider>
          <ShopProvider>
            <SignedIn>
              <div className="flex justify-between align-center w-full">
                <div className="flex align-center">
              <Link to="/sync-dashboard" style={{ color: "black", margin: "1rem", fontSize: "1rem" }}>
                Dashboard
              </Link>
              <Link to="/settings" style={{ color: "black", margin: "1rem", fontSize: "1rem" }}>
                Settings
              </Link>
              <Link to="/test" style={{ color: "black", margin: "1rem", fontSize: "1rem" }}>
                Test
              </Link>
            </div>
            <div>
              <Link to="/signed-in" style={{ color: "black", margin: "1rem", fontSize: "1rem" }}>
                Profile
              </Link>
              <Button className="m-2" onClick={signOut}>
                Sign Out
              </Button>
            </div>
              </div>
            </SignedIn>
          </ShopProvider>
        </AuthProvider>
      </div>
    </div>
  );
};

export default App;
