import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [catRes, subRes, prodRes] = await Promise.all([
      fetch("/api/category/all"),
      fetch("/api/subCategory/all"),
      fetch("/api/product/all"),
    ]);
    const catData = await catRes.json();
    const subData = await subRes.json();
    const prodData = await prodRes.json();

    setCategories(catData.data);
    setSubCategories(subData.data);
    setProducts(prodData.data);
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="stats">
        <div className="card">
          <h2>Total Categories</h2>
          <p>{categories.length}</p>
        </div>
        <div className="card">
          <h2>Total SubCategories</h2>
          <p>{subCategories.length}</p>
        </div>
        <div className="card">
          <h2>Total Products</h2>
          <p>{products.length}</p>
        </div>
      </div>

      <div className="table-wrapper">
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Parent Category</th>
              <th>SubCategory</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Discount Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(
                (product) =>
                  product.name.toLowerCase().includes(search.toLowerCase()) ||
                  product.brand.toLowerCase().includes(search.toLowerCase()) ||
                  product.subCategory?.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  product.subCategory?.parentCategory?.name
                    .toLowerCase()
                    .includes(search.toLowerCase()),
              )
              .map((product) => (
                <tr key={product._id}>
                  <td>{product.subCategory?.parentCategory?.name || "-"}</td>
                  <td>{product.subCategory?.name || "-"}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.price}</td>
                  <td>₹{product.discountPrice || "-"}</td>
                  <td>{product.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Products Table */}
    </div>
  );
}

export default Dashboard;
