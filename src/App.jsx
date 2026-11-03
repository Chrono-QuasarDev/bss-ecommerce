import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { PremiumMockups } from './components/PremiumMockups';
import { CartDrawer } from './components/CartDrawer';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { SheetConfigModal } from './components/SheetConfigModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Footer } from './components/Footer';
import { fetchProductsFromGoogleSheet } from './utils/csvParser';
import { CONFIG } from './config';

export function App() {
  const [products, setProducts] = useState(CONFIG.FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheetStatus, setSheetStatus] = useState('cached');

  const [customSheetUrl, setCustomSheetUrl] = useState(() => {
    try {
      return localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_SHEET_URL) || CONFIG.SHEET_CSV_URL;
    } catch {
      return CONFIG.SHEET_CSV_URL;
    }
  });

  const [isSheetConfigOpen, setIsSheetConfigOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  /**
   * Google Sheets CMS Fetcher with Timeout & Fallback Safety
   */
  const loadProducts = async (targetUrl) => {
    const sheetUrl = targetUrl || customSheetUrl;

    // If unconfigured or placeholder URL, immediately use curated fallback without delay
    if (!sheetUrl || sheetUrl.includes('placeholder') || sheetUrl.includes('REPLACE_WITH')) {
      setProducts(CONFIG.FALLBACK_PRODUCTS);
      setSheetStatus('cached');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedProducts = await fetchProductsFromGoogleSheet(sheetUrl, 4500);

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        setSheetStatus('synced');
      } else {
        throw new Error('Parsed product list was empty.');
      }
    } catch (err) {
      console.warn('[Atelier CMS] Google Sheets Notice:', err.message);
      setError(err.message);
      // Guarantee products are always available via cached collection
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

  // Derive unique categories from available products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Compute category counts taking into account any active search query so counts never disagree with results
  const categoryCounts = useMemo(() => {
    const counts = { All: 0 };
    categories.forEach((cat) => {
      counts[cat] = 0;
    });

    const trimmedQuery = searchQuery.toLowerCase().trim();

    products.forEach((p) => {
      const cat = p.category ? p.category.trim() : 'General';
      const matchesSearch = !trimmedQuery || (
        (p.name && p.name.toLowerCase().includes(trimmedQuery)) ||
        (p.category && p.category.toLowerCase().includes(trimmedQuery)) ||
        (p.description && p.description.toLowerCase().includes(trimmedQuery)) ||
        (p.fabric && p.fabric.toLowerCase().includes(trimmedQuery))
      );

      if (matchesSearch) {
        counts.All = (counts.All || 0) + 1;
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    return counts;
  }, [products, categories, searchQuery]);

  // Client-Side Search, Category Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => (p.category || '').trim() === selectedCategory);
    }

    // 2. Real-time Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.fabric && p.fabric.toLowerCase().includes(query))
      );
    }

    // 3. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#060607] text-[#f2f2f4] flex flex-col font-sans selection:bg-amber-300 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenSheetConfig={() => setIsSheetConfigOpen(true)}
        onOpenSearch={() => {
          const el = document.getElementById('catalog-search');
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      />

      {/* Cinematic Hero */}
      <Hero
        productCount={products.length}
        sheetStatus={sheetStatus}
        onFeaturedClick={() => setQuickViewProduct(CONFIG.FALLBACK_PRODUCTS[1])}
      />

      {/* Sticky Category Filter & Search Bar */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main Product Grid */}
      <main className="flex-1">
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          error={error}
          onRetry={() => loadProducts(customSheetUrl)}
          activeCategory={selectedCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onResetFilters={handleResetFilters}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* The VIP Pass Cyber-Vault Component */}
        <PremiumMockups />
      </main>

      {/* Slide-out Cart Drawer with WhatsApp Handoff Sequence */}
      <CartDrawer />

      {/* Local Order History Modal */}
      <OrderHistoryModal />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Google Sheets CMS Config Modal */}
      <SheetConfigModal
        isOpen={isSheetConfigOpen}
        onClose={() => setIsSheetConfigOpen(false)}
        currentUrl={customSheetUrl}
        onSaveUrl={handleSaveCustomSheetUrl}
        onReload={() => loadProducts(customSheetUrl)}
        isLiveSynced={sheetStatus === 'synced'}
      />

      {/* Footer - Keeping Backstage & Merchant CMS Intact */}
      <Footer onOpenSheetConfig={() => setIsSheetConfigOpen(true)} />
    </div>
  );
}

export default App;
