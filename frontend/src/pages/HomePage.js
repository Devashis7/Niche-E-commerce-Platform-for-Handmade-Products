import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import bannerImg from '../assets/Banner-img.jpg'; // ✅ import from src/assets

const HomePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const filteredProducts = products.filter(p => {
    const matchesTitle = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesTitle && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`);

        setProducts(res.data);
      } catch (err) {
        toast.error('Failed to load products');
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully ✅');
    navigate('/');
  };

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 pt-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-orange-600 hover:underline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Desi-Etsy 🧵
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                🏠 Home
            </Link>

          <a
            href="#about-us"
            className="hover:underline cursor-pointer"
            onClick={e => {
              e.preventDefault();
              document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            📖 About Us
          </a>
          <Link to="/cart" className="hover:underline">🛒 Cart</Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="font-medium hover:underline"
              >
                👋 {user.name} ▾
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">📦 My Orders</Link>
                  <Link to="/update-password" className="block px-4 py-2 hover:bg-gray-100">🔑 Update Password</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </nav>
      </header>

      {/* Banner */}
      <div
        className="relative bg-cover bg-center h-60 md:h-96"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">Not Just Handmade. Heartmade.</h2>
          <p className="mb-4 max-w-md">Explore art you can feel — straight from the hands of India’s finest creators. 🧵🎨</p>
          <button onClick={() => navigate('/cart')} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white">
            Shop Now
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-8 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-4 text-center">🧵 Top Categories</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(cat)}
              className="bg-white border rounded px-4 py-2 shadow transition-transform duration-300 hover:scale-105 hover:bg-orange-100"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-center items-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-64 max-w-xs text-center"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-48 max-w-xs"
        >
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="px-4">
        <h3 className="text-xl font-semibold mb-4 text-center">✨ Featured Products</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(showAll ? filteredProducts : filteredProducts.slice(0, 8)).map(p => (
            <div
              key={p._id}
              className="bg-white rounded shadow overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img src={p.image} alt={p.title} className="w-full h-48 object-contain bg-white" />
              <div className="p-4">
                <h4 className="font-semibold text-lg">{p.title}</h4>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="text-orange-600 font-bold mt-2">₹{p.price}</p>
                <Link
                  to={`/product/${p._id}`}
                  className="mt-2 inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length > 8 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              {showAll ? 'Show Less' : 'View All Products'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div id ="about-us">
            <h4 className="text-lg font-semibold mb-2">About Desi-Etsy</h4>
            <p className="text-sm text-gray-400">
              Desi-Etsy is dedicated to celebrating India's rich heritage of craftsmanship. We connect talented artisans with customers nationwide, making it easy to discover and purchase authentic, handmade products.<br /><br />
              <span className="italic text-orange-300">Handmade. Heartmade. Just for you.</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
              <Link
                to="/"
                className="hover:underline"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                🏠 Home
              </Link>
            </li>
              <li><Link to="/cart" className="hover:underline">🛒 Cart</Link></li>
              <li>
                <Link
                  to={user ? "/orders" : "/login"}
                  className="hover:underline"
                >
                  📦 My Orders
                </Link>
              </li>
              <li>
                <a href="https://github.com/Rohitsharma97714/Niche-E-commerce-Platform-for-Handmade-Products" target="_blank" rel="noreferrer" className="hover:underline">💻 GitHub Repo</a>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">📄 Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">🔒 Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Newsletter</h4>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 rounded text-gray-900"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">Get updates on new arrivals and offers.</p>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-400">📧 Email: rohitkumar.pr45@gmail.com</p>
            <p className="text-sm text-gray-400">📍 Location: India</p>
            <div className="flex gap-3 mt-3">
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              {/* Instagram SVG */}
              <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="currentColor" fill="none"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              {/* Facebook SVG */}
              <svg className="w-6 h-6 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05h-2.1v-2.9h2.1V9.5c0-2.07 1.23-3.22 3.13-3.22.91 0 1.86.16 1.86.16v2.05h-1.05c-1.03 0-1.35.64-1.35 1.3v1.56h2.3l-.37 2.9h-1.93v7.05A10 10 0 0 0 22 12"/>
              </svg>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
              {/* Twitter SVG */}
              <svg className="w-6 h-6 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 11.1 9.03c0 .34.04.67.1.99A12.13 12.13 0 0 1 3.1 5.1a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/>
              </svg>
            </a>
          </div>
          </div>
        </div>


        {/* Bottom Text */}

        <div className="text-center text-gray-500 text-xs mt-6 border-t border-gray-700 pt-4 flex flex-col items-center gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-orange-400 hover:underline"
          >
            ↑ Back to Top
          </button>
          © {new Date().getFullYear()} Desi-Etsy. All rights reserved.
        </div>
      </footer>
    </div>
  ); 
};
export default HomePage;

