function ProductList({
    products,
    onEdit,
    onDelete,
    searchTerm
}) {

    return (
        <div>
            {products.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon" aria-hidden="true">▦</span>
                    <strong>{searchTerm ? "No matching products" : "Your catalog is empty"}</strong>
                    <p>{searchTerm ? "Try a different search term." : "Add your first product to get started."}</p>
                </div>
            ) : (
                <div className="product-table-wrap">
                    <table className="product-table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Product</th>
                            <th scope="col">Price</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="product-id">#{product.id}</td>
                                <td className="product-name-cell">
                                    <span className="product-avatar" aria-hidden="true">{product.name?.charAt(0) || "?"}</span>
                                    <span>{product.name}</span>
                                </td>
                                <td className="price-cell">
                                    ₱{Number(product.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                    <button
                                        className="action-button"
                                        onClick={() =>
                                            onEdit(product)
                                        }
                                        aria-label={`Edit ${product.name}`}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="action-button action-button-danger"
                                        onClick={() =>
                                            onDelete(product.id)
                                        }
                                        aria-label={`Delete ${product.name}`}
                                    >
                                        Delete
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ProductList;