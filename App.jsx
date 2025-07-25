import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_12345"); // Replace with your real Stripe publishable key

export default function HomePage() {
  return (
    <Elements stripe={stripePromise}>
      <ShopPage />
    </Elements>
  );
}

function ShopPage() {
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const products = [
    { title: "Fringe Denim Jacket", price: 6800, category: "Outerwear" },
    { title: "Turquoise Concho Belt", price: 4400, category: "Accessories" },
    { title: "Boho Western Dress", price: 7200, category: "Dresses" },
  ];

  const addToCart = (product) => setCart([...cart, product]);
  const filteredProducts = filter === "All" ? products : products.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="bg-black text-white p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-lime-400">Golden Sass Boutique</h1>
          <p className="text-sm text-white">Today's Western Fashion</p>
        </div>
        <div>
          <span className="text-white">🛒 {cart.length}</span>
        </div>
      </header>

      <main className="p-6 space-y-10">
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-2">New Arrivals</h2>
          <div className="mb-4">
            <label className="mr-2 font-medium">Filter:</label>
            <select onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
              <option>All</option>
              <option>Outerwear</option>
              <option>Accessories</option>
              <option>Dresses</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((p, i) => (
              <ProductCard key={i} title={p.title} price={p.price} addToCart={() => addToCart(p)} />
            ))}
          </div>
        </section>

        <section className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <ul className="mb-4">
            {cart.map((item, index) => (
              <li key={index} className="text-sm">{item.title} - ${(item.price / 100).toFixed(2)}</li>
            ))}
          </ul>
          {cart.length > 0 && <CheckoutForm cart={cart} />}
        </section>

        <section className="bg-lime-100 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">About Us</h2>
          <p>
            Golden Sass Boutique brings bold western flair to modern fashion. We carry a curated selection
            of quality pieces—from everyday ranch wear to night-out sparkle.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-xl font-bold mb-2">Follow Us</h2>
          <p className="text-sm">@GoldenSassBoutique on Instagram, Facebook, and TikTok</p>
        </section>

        <section className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <form className="space-y-4">
            <input className="w-full p-2 border rounded" placeholder="Your Name" required />
            <input className="w-full p-2 border rounded" placeholder="Your Email" type="email" required />
            <textarea className="w-full p-2 border rounded" placeholder="Your Message" rows="4" required></textarea>
            <button type="submit" className="px-4 py-2 bg-lime-400 text-white rounded-xl hover:bg-lime-500">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="bg-black text-white text-center py-4 mt-10">
        <p className="text-sm">© {new Date().getFullYear()} Golden Sass Boutique. All rights reserved.</p>
      </footer>
    </div>
  );
}

function ProductCard({ title, price, addToCart }) {
  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg p-4">
      <div className="h-40 bg-gray-200 rounded mb-4" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-600">${(price / 100).toFixed(2)}</p>
      <button onClick={addToCart} className="mt-2 px-4 py-2 bg-lime-400 text-white rounded-xl hover:bg-lime-500">
        Add to Cart
      </button>
    </div>
  );
}

function CheckoutForm({ cart }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (error) {
      console.error(error);
    } else {
      alert("Payment method created: " + paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded" />
      <button
        type="submit"
        className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
        disabled={!stripe}
      >
        Pay ${(cart.reduce((acc, item) => acc + item.price, 0) / 100).toFixed(2)}
      </button>
    </form>
  );
}