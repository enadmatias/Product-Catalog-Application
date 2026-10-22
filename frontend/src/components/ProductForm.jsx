import { useState } from "react";
import {
    createProduct,
    updateProduct
} from "../services/productService";

function ProductForm({ editingProduct, onSaved, onCancel }) {

    const [name, setName] = useState(editingProduct?.name ?? "");
    const [price, setPrice] = useState(editingProduct?.price ?? "");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            const product = {
                name,
                price: Number(price)
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, product);
            } else {
                await createProduct(product);
            }

            setName("");
            setPrice("");

            onSaved();

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Failed to save product"
            );
        }
    };

    return (
        <section className="form-card" aria-labelledby="form-title">
            <div className="form-card-heading">
                <p className="section-kicker">QUICK ACTION</p>
                <h2 id="form-title">
                    {editingProduct ? "Edit product" : "Add a product"}
                </h2>
                <p>{editingProduct ? "Update the details below." : "Add an item to your catalog."}</p>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="product-name">Product name</label>
                    <input
                        id="product-name"
                        type="text"
                        placeholder="e.g. Ceramic coffee mug"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="product-price">Price</label>
                    <input
                        id="product-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button className="primary-button" type="submit">
                        {editingProduct ? "Save changes" : "+ Add product"}
                    </button>
                    {editingProduct && (
                        <button className="secondary-button" type="button" onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default ProductForm;