import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import Product from "./pages/Product";
import Basket from "./pages/Basket";
import AddressForm from "./pages/AddressForm";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/Seller/SellerLogin";
import SellerLayout from "./components/Seller/SellerLayout";
import AddProducts from "./components/Seller/AddProducts";
import ProductList from "./components/Seller/ProductList";
import Orders from "./components/Seller/Orders";
import {
  RequireAdmin,
  RequireSeller,
  RequireUser,
} from "./components/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import PendingSellers from "./components/Admin/PendingSellers";
import AllUsers from "./components/Admin/AllUsers";
import AllAdminProducts from "./components/Admin/AllProducts";
import SellerRegister from "./components/Seller/SellerRegister";
import { RecipeProvider } from "./context/RecipeContext";
import Recipes from "./pages/recipes/Recipe";
import SavedRecipes from "./pages/recipes/SavedRecipe";
import RecipeDetail from "./pages/recipes/RecipeDetail";
import CommunityRecipeDetail from "./pages/comunityRecipe/RecipeDetail";
import MyRecipes from "./pages/comunityRecipe/MyRecipe";
import SubmitRecipe from "./pages/comunityRecipe/SubmitRecipe";
import PendingRecipes from "./components/Admin/PendingRecipes";
import AllRecipes from "./components/Admin/AllRecipes";

const App = () => {
  const isLoginPath =
    useLocation().pathname.includes("seller/login") ||
    useLocation().pathname.includes("seller/register");
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <div>
      {isLoginPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<Product />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/add-address" element={<AddressForm />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route
            path="/seller"
            element={
              <RequireSeller>
                <SellerLayout />
              </RequireSeller>
            }
          >
            <Route index element={isSeller ? <AddProducts /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<PendingSellers />} />
            <Route path="recipes" element={<PendingRecipes />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="products" element={<AllAdminProducts />} />
            <Route path="/admin/recipes/all" element={<AllRecipes />} />
          </Route>

          {/* Recipe */}
          <Route
            path="/community-recipes/:id"
            element={<CommunityRecipeDetail />}
          />
          <Route
            path="/submit-recipe"
            element={
              <RequireUser>
                <SubmitRecipe />
              </RequireUser>
            }
          />
          <Route
            path="/my-recipes"
            element={
              <RequireUser>
                <MyRecipes />
              </RequireUser>
            }
          />
          <Route
            path="/recipes"
            element={
              <RecipeProvider>
                <Recipes />
              </RecipeProvider>
            }
          />
          <Route
            path="/recipes/saved"
            element={
              <RecipeProvider>
                <SavedRecipes />
              </RecipeProvider>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <RecipeProvider>
                <RecipeDetail />
              </RecipeProvider>
            }
          />
        </Routes>
      </div>
      <Outlet />
      {isLoginPath ? null : <Footer />}
    </div>
  );
};

export default App;
