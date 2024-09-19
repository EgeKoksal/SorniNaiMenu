import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Menu from "./Menu";
import Categories from "./Categories";
import Cart from "./Cart";

const allCategories = ["all", "breakfast", "lunch", "shakes"]; // Kategorileri manuel ekledik.

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [filteredItems, setFilteredItems] = useState([]); // Yeni state

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5017/products")
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data); 
        setFilteredItems(data); // İlk başta tam listeyi de kaydediyoruz
      })
      .catch((error) => console.error("Veri çekme hatası:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== itemId));
  };

  const filterItems = (category) => {
    if (category === "all") {
      setFilteredItems(menuItems); // Orijinal listeyi geri getir
    } else {
      const newItems = menuItems.filter((item) => item.category === category);
      setFilteredItems(newItems);
    }
  };

  const addToCart = (item) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = [...prevCartItems, item];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setShowModal(false);
  };

  const sales = () => {
    setShowModal(true);
  };

  const cartItemCount = cartItems.length;

  return (
    <Router>
      <main>
        <section className="menu section">
          <div className="title">
            <h2>Sorni Nai menu</h2>
            <div className="underline"></div>
          </div>
          <Link to="/cart" className="cart">
            <i className="fa-solid fa-cart-shopping"></i> {cartItemCount}
          </Link>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Categories categories={allCategories} filterItems={filterItems} />
                  <Menu items={filteredItems} addToCart={addToCart} />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  items={cartItems}
                  clearCart={clearCart}
                  sales={sales}
                  showModal={showModal}
                  removeFromCart={removeFromCart}
                />
              }
            />
          </Routes>
        </section>
      </main>
    </Router>
  );
}

export default App;