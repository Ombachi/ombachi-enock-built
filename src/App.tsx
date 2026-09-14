import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index.tsx";
import ProjectPage from "./pages/ProjectPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import PostPage from "./pages/PostPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import LibraryPage from "./pages/LibraryPage.tsx";
import LibraryProductPage from "./pages/LibraryProductPage.tsx";
import LibraryCollectionPage from "./pages/LibraryCollectionPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useAnalytics();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/work/:slug" element={<ProjectPage />} />
      <Route path="/writing/category/:category" element={<CategoryPage />} />
      <Route path="/writing/:slug" element={<PostPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/library/collections/:slug" element={<LibraryCollectionPage />} />
      <Route path="/library/:slug" element={<LibraryProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
