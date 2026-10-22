import { useEffect, useState } from "react";
import "./App.css";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

import {
    getProducts,
    deleteProduct
} from "./services/productService";

function App() {

    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const loadProducts = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await getProducts();

            setProducts(response.data);

        } catch {

            setError(
                "Unable to load products. Make sure Spring Boot is running."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        let active = true;

        getProducts()
            .then((response) => {
                if (active) {
                    setProducts(response.data);
                }
            })
            .catch(() => {
                if (active) {
                    setError("Unable to load products. Make sure Spring Boot is running.");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const handleSaved = () => {
        setEditingProduct(null);
        loadProducts();
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteProduct(id);

            loadProducts();

        } catch {

            setError("Failed to delete product.");

        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    const inventoryValue = products.reduce(
        (total, product) => total + Number(product.price || 0),
        0
    );

    return (
        <div className="app-shell">
            <header className="topbar">
                <a className="brand" href="#top" aria-label="Stockroom home">
                    <span className="brand-mark" aria-hidden="true">S</span>
                    <span>stockroom<span className="brand-period">.</span></span>
                </a>
                <div className="topbar-meta">
                    <span className="status-dot" /> Inventory workspace
                </div>
            </header>

            <main className="dashboard" id="top">
                <section className="page-heading">
                    <div>
                        <p className="eyebrow">OVERVIEW <span>/</span> PRODUCTS</p>
                        <h1>Your inventory<span className="heading-period">.</span></h1>
                        <p className="page-subtitle">A clear view of what you have in stock.</p>
                    </div>
                    <div className="heading-date">
                        <span className="date-icon" aria-hidden="true">◷</span>
                        <span>Inventory dashboard</span>
                    </div>
                </section>

                <section className="stats-grid" aria-label="Inventory summary">
                    <article className="stat-card">
                        <div className="stat-icon stat-icon-violet" aria-hidden="true">▦</div>
                        <div className="stat-copy">
                            <span className="stat-label">Total products</span>
                            <strong>{loading ? "—" : products.length}</strong>
                        </div>
                        <span className="stat-note">in catalog</span>
                    </article>
                    <article className="stat-card">
                        <div className="stat-icon stat-icon-green" aria-hidden="true">₱</div>
                        <div className="stat-copy">
                            <span className="stat-label">Catalog value</span>
                            <strong>{loading ? "—" : `₱${inventoryValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong>
                        </div>
                        <span className="stat-note">combined price</span>
                    </article>
                </section>

                {error && (
                    <div className="alert-banner" role="alert">
                        <span className="alert-icon" aria-hidden="true">!</span>
                        <span>{error}</span>
                    </div>
                )}

                <section className="workspace-grid">
                    <ProductForm
                        key={editingProduct?.id ?? "new-product"}
                        editingProduct={editingProduct}
                        onSaved={handleSaved}
                        onCancel={() => setEditingProduct(null)}
                    />

                    <section className="catalog-card" aria-labelledby="catalog-title">
                        <div className="catalog-header">
                            <div>
                                <p className="section-kicker">YOUR COLLECTION</p>
                                <h2 id="catalog-title">Product catalog</h2>
                            </div>
                            <label className="search-box">
                                <span aria-hidden="true">⌕</span>
                                <input
                                    type="search"
                                    placeholder="Search products"
                                    aria-label="Search products"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </label>
                        </div>

                        {loading ? (
                            <div className="loading-state" role="status">
                                <span className="loading-spinner" />
                                <span>Loading your products…</span>
                            </div>
                        ) : (
                            <ProductList
                                products={filteredProducts}
                                onEdit={setEditingProduct}
                                onDelete={handleDelete}
                                searchTerm={searchTerm}
                            />
                        )}
                        <div className="catalog-footer">
                            <span>Showing <strong>{loading ? "—" : filteredProducts.length}</strong> of <strong>{loading ? "—" : products.length}</strong> products</span>
                            <span className="footer-status"><span className="status-dot" /> Up to date</span>
                        </div>
                    </section>
                </section>

                <footer className="page-footer">Thoughtful inventory management, made simple.</footer>
            </main>
        </div>
    );
}

export default App;