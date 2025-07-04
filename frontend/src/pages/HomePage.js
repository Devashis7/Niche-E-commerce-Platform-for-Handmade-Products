import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { toast } from 'react-toastify'; // ✅ Import toast

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
        const res = await axios.get('http://localhost:5000/api/products');
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
    toast.success('Logged out successfully ✅'); // ✅ Toast on logout
    navigate('/');
  };

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat}`);
  };

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <h1>Desi-Etsy 🧵</h1>
        <nav>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</Link>
          <Link to="/cart">🛒 Cart</Link>
          {user ? (
            <div className="profile-container" ref={dropdownRef}>
              <span className="profile-name" onClick={() => setShowDropdown(!showDropdown)}>
                👋 {user.name} ▾
              </span>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/orders">📦 My Orders</Link>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      {/* Banner */}
      <div className="banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>Not Just Handmade. Heartmade.</h2>
          <p>Explore art you can feel — straight from the hands of India’s finest creators. 🧵🎨</p>
          <button className="banner-btn" onClick={() => navigate('/cart')}>Shop Now</button>
        </div>
      </div>

      {/* Top Categories */}
      <div className="top-categories">
        <h3>🧵 Top Categories</h3>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card" onClick={() => handleCategoryClick(cat)}>
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Featured Products */}
      <h3 className="section-title">✨ Featured Products</h3>
      <div className="grid-container">
        {(showAll ? filteredProducts : filteredProducts.slice(0, 8)).map(p => (
          <div className="card" key={p._id}>
            <img src={p.image} alt={p.title} />
            <div className="card-content">
              <h4>{p.title}</h4>
              <p>{p.category}</p>
              <p className="price">₹{p.price}</p>
              <Link to={`/product/${p._id}`} className="view-btn">View Product</Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All / Less */}
      {filteredProducts.length > 8 && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'View All Products'}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h4>Desi-Etsy</h4>
          <p>Empowering local artisans across India 🇮🇳</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
          <p className="copyright">© 2025 Desi-Etsy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
