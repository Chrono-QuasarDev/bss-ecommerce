import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { PremiumMockups } from './components/PremiumMockups';
import { CartDrawer } from './components/CartDrawer';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { SheetConfigModal } from './components/SheetConfigModal';
import { Footer } from './components/Footer';
import { fetchProductsFromGoogleSheet } from './utils/csvParser';
import { CONFIG } from './config';

export function App() {
  // Products and Google Sheets CMS state
  const [products, setProducts] = useState(CONFIG.FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sheetStatus, setSheetStatus] = useState('cached'); // 'synced' | 'cached' | 'error'

  // Custom Sheet URL state (persisted so client can test different sheets)
  const [customSheetUrl, setCustomSheetUrl] = useState(() => {
    try {
      return localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_SHEET_URL) || CONFIG.SHEET_CSV_URL;
    } catch {
      return CONFIG.SHEET_CSV_URL;
    }
  });

  const [isSheetConfigOpen, setIsSheetConfigOpen] = useState(false);

  // Client-Side Category Filtering
  const [selectedCategory, setSelectedCategory] = useState('All');

  /**
   * Google Sheets CMS Fetcher
   * Fetches published Google Sheet CSV, parses CSV into product objects,
   * with graceful fallback to built-in atelier catalog if offline.
   */
  const loadProducts = async (targetUrl) => {
    setLoading(true);
    setError(null);

    const sheetUrl = targetUrl || customSheetUrl;

    try {
      // If the URL is the placeholder, we use fallback immediately with simulated fast sync
      if (!sheetUrl || sheetUrl.includes('placeholder')) {
        console.info('[Atelier CMS] Using built-in curated catalog (placeholder sheet configured).');
        setProducts(CONFIG.FALLBACK_PRODUCTS);
        setSheetStatus('cached');
        setLoading(false);
        return;
      }

      const fetchedProducts = await fetchProductsFromGoogleSheet(sheetUrl);

      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        setSheetStatus('synced');
      } else {
        throw new Error('Parsed product list was empty.');
      }
    } catch (err) {
      console.warn('[Atelier CMS] Google Sheets fetch notice:', err.message);
      setError(err.message);
      // Fallback to built-in catalog so application remains completely usable
      setProducts(CONFIG.FALLBACK_PRODUCTS);
      setSheetStatus('cached');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(customSheetUrl);
  }, []);

  const handleSaveCustomSheetUrl = (newUrl) => {
    setCustomSheetUrl(newUrl);
    try {
      if (newUrl) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_SHEET_URL, newUrl);
      } else {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CUSTOM_SHEET_URL);
      }
    } catch (e) {
      console.error(e);
    }
    loadProducts(newUrl);
  };

  // Derive unique categories from currently loaded products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Compute category item counts for the filter pills
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => {
      const cat = p.category ? p.category.trim() : 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Client-Side Filtered Products (Instantaneous in-memory filtering)
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => (p.category || '').trim() === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenSheetConfig={() => setIsSheetConfigOpen(true)} />

      {/* Hero Section */}
      <Hero
        productCount={products.length}
        sheetStatus={sheetStatus}
      />

      {/* Sticky Horizontal Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Product Grid */}
      <main className="flex-1">
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          error={error}
          onRetry={() => loadProducts(customSheetUrl)}
          activeCategory={selectedCategory}
        />

        {/* The VIP Pass Premium Mock-up Component */}
        <PremiumMockups />
      </main>

      {/* Slide-out Cart Drawer with WhatsApp Handoff Sequence */}
      <CartDrawer />

      {/* Order History Modal (Saved in localStorage) */}
      <OrderHistoryModal />

      {/* Google Sheets CMS Setup & Tester Modal */}
      <SheetConfigModal
        isOpen={isSheetConfigOpen}
        onClose={() => setIsSheetConfigOpen(false)}
        currentUrl={customSheetUrl}
        onSaveUrl={handleSaveCustomSheetUrl}
        onReload={() => loadProducts(customSheetUrl)}
        isLiveSynced={sheetStatus === 'synced'}
      />

      {/* Atelier Footer */}
      <Footer onOpenSheetConfig={() => setIsSheetConfigOpen(true)} />
    </div>
  );
}

export default App;
