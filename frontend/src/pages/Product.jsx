import { useState, useEffect } from "react"

function Product() {
  const[products, setProducts] = useState([])
  const[categories, setCategories] = useState([])
  const[subcategories, setSubCategories] = useState([])
  const[allsubcategories, setAllSubCategories] = useState([])
  const[selectedParent, setSelectedParent] = useState("")
  const[selectedCategory, setSelectedCategory] = useState("")
  const[name, setName] = useState("")
  const[brand, setBrand] = useState("")
  const[price, setPrice] = useState("")
  const[discountPercent, setDiscountPercent] = useState("")
  const[status, setStatus] = useState("Active")
  const[editingId, setEditingId] = useState(null)

     useEffect(() => {
    loadCategories();
    loadSubCategories();
    loadProducts();
  }, []);

  async function loadCategories() {
    const res = await fetch('/api/category/all');
    const data = await res.json();
    setCategories(data.data);
  }

  async function loadSubCategories() {
    const res = await fetch('/api/subCategory/all');
    const data = await res.json();
    setSubCategories(data.data);
    setAllSubCategories(data.data);
  }

  async function loadProducts() {
    const res = await fetch('/api/product/all');
    const data = await res.json();
    setProducts(data.data);
  }

 

   function filterSubCategories(parentId) {
    const filtered = allsubcategories.filter(
      (sub) => sub.parentCategory._id === parentId,
    );

    setSubCategories(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const res = await fetch(`/api/product/update/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentCategory: selectedParent,
          subCategory: selectedCategory,
          name,
          brand,
          price,
          discountPercent,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product updated successfully :)");
        loadProducts();
        setEditingId(null);
      }
    } else {
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentCategory: selectedParent,
          subCategory: selectedCategory,
          name,
          brand,
          price,
          discountPercent,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadProducts();
        setSelectedParent("");
        setSubCategories([]);
        setName("");
        setBrand("");
        setPrice("");
        setDiscountPercent("");
        setStatus("Active");
      } else {
        alert(data.message);
      }
    }
  };

  const handleEdit = (product) => {
    console.log("product:", product);
    setEditingId(product._id);
    setSelectedParent(product.subCategory.parentCategory._id);
    filterSubCategories(product.subCategory.parentCategory._id)
    setSelectedCategory(product.subCategory._id)
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price);
    setDiscountPercent(product.discountPercent);
    setStatus(product.status);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/product/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      loadProducts();
    }
  };


return (
  <div className="container">
    <h1>Manage Products</h1>

    {/* Form */}
    <form onSubmit={handleSubmit}>
      {/* Parent Category */}
      <select
        value={selectedParent}
        onChange={(e) => {
          setSelectedParent(e.target.value);
          filterSubCategories(e.target.value);
        }}
      >
        <option value="">Select Parent Category</option>

        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Sub Category */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Sub Category</option>

        {subcategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>

      {/* Product Name */}
      <input
        type="text"
        placeholder="Enter product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Brand */}
      <input
        type="text"
        placeholder="Enter brand name"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Enter price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* Discount Percent */}
      <input
        type="number"
        placeholder="Enter discount percent"
        value={discountPercent}
        onChange={(e) => setDiscountPercent(e.target.value)}
      />

      {/* Status */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      {/* Submit Button */}
      <button type="submit">
        {editingId ? "Update Product" : "Add Product"}
      </button>
    </form>

    {/* Table */}
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Parent Category</th>
          <th>Sub Category</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Discounted Percent</th>
          <th>Discounted Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product.subCategory?.parentCategory?.name}</td>

            <td>{product.subCategory?.name}</td>

            <td>{product.name}</td>

            <td>{product.brand}</td>

            <td>₹{product.price}</td>

            <td>{product.discountPercent}%</td>
            <td>₹{product.discountPrice || "-"}</td>

            <td>{product.status}</td>

            <td>
              <button onClick={() => handleEdit(product)}>Edit</button>

              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}

export default Product