import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ProductPage from "@/pages/ProductPage";
import CampaignPage from "@/pages/CampaignPage";
import AdminPage from "@/pages/AdminPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import TrackingPage from "@/pages/TrackingPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { CampaignProvider } from "@/context/CampaignContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProductPage} />
      <Route path="/campana/:id" component={CampaignPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/pago-confirmado/:campaignId/:productId?" component={PaymentSuccessPage} />
      <Route path="/seguimiento/:trackingId" component={TrackingPage} />
      <Route path="/widget" component={WidgetEmbed} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampaignProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
          <Navbar />
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Router />
            </div>
          </main>
          <Footer />
          <Toast />
        </div>
        <Toaster />
      </CampaignProvider>
    </QueryClientProvider>
  );
}

export default App;
