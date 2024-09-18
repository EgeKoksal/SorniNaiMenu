import React, { useState } from "react";
import { Link } from "react-router-dom";

const Cart = ({ items, sales, clearCart, removeFromCart }) => {
  const [showModal, setShowModal] = useState(false); // satış penceresi için ekledik

  // her item için adet tutma
  const [quantities, setQuantities] = useState(
    items.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  // adet arttırımı için kullanılan fonksiyon
  const increaseQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: prevQuantities[itemId] + 1,
    }));
  };

  // adet arttırımı için kullanılan fonksiyon
  const decreaseQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(prevQuantities[itemId] - 1, 1),
    }));
  };

  const buyItems = () => {
    const orderData = items.map(item => ({
      id: item.id,
      quantity: quantities[item.id], // Her item'ın adet bilgisi
    }));
  
    fetch("http://localhost:5017/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sipariş gönderildi:", data);
        clearCart(); // Sepeti boşalt
        setShowModal(true); // Onay penceresini göster
      })
      .catch((error) => console.error("Sipariş gönderme hatası:", error));
  };



  // total fiyat hesapla
  const totalPrice = items.reduce(
    (accumulator, item) => accumulator + item.price * quantities[item.id],
    0
  );

  return (
    <div>
        
      <div className="tabbar">
      <div className="back_to_menu">
        <Link to="/" className="back_to_menu_link">
        <i className="fa-solid fa-arrow-left"></i>
        </Link>
      </div>
        <h2 className="baslik">Your Cart</h2>
        
        <h2 className="total">Total: ${totalPrice.toFixed(2)}</h2>
      </div>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li className="menü" key={item.id}>
              <img
                src={item.img}
                alt={item.title}
                style={{ width: "220px", height: "150px", marginRight: "10px" }}
              />
              <div>
                <span className="çarpı" onClick={() =>removeFromCart(item.id)}><i className="fa-regular fa-circle-xmark"></i></span>
                <span className="cart_title">{item.title}</span>
                <span className="cart_desc">{item.desc}</span>
                <span className="cart_price">${item.price}</span>
              </div>
              <div className="adetler">
                <button
                  className="arttır"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
                <p className="adet">{quantities[item.id]}</p>
                <button
                  className="azalt"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length === 0 ? (
        <p>Add Item</p>
      ) : (
        <div className="cart_button">
          <button className="clear" onClick={clearCart}>
            Clear
          </button>
          <button
            className="sales"
            onClick={() => {
              buyItems();
              sales();
              setShowModal(true); // Modal'ı aç
            }}
          >
            <span>Buy</span>
            <span>||</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}
      {showModal && (
        <div className="modal_overlay">
          <div className="modal_content">
          <h2 className="tik"><i className="fa-regular fa-circle-check"></i></h2>
            <h1>Purchase Confirmed</h1>
            <button className="modal_close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    
    
    </div>
  );
};

export default Cart;
