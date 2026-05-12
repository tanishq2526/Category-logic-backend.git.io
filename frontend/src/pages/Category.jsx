import { useState, useEffect } from "react";

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  let [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const res = await fetch("/api/category/all");
    const data = await res.json();
    setCategories(data.data);
  }
  const handleDelete = async (id) => {
    const res = await fetch(`/api/category/delete/${id}`,{
      method: "DELETE",
    })
    const data = await res.json();
    if(data.success){
      loadCategories();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editingId){
      const res = await fetch(`/api/category/update/${editingId}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, slug, status}),
      });
      const data = await res.json();
      if (data.success) {
        alert("Category updated successfully :)");
        loadCategories();
        setEditingId(null)
      }
    }else{
      const res = await fetch("/api/category/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, status }),
    });
    const data = await res.json();
    if (data.success) {
      loadCategories(); // reload from DB
      setName("");
      setSlug("");
      setStatus("active");
    } else {
      alert(data.message);
    }
    }
    
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setSlug(category.slug);
    setStatus(category.status);
  };
  return (
    <div className="container">
      <h1>Manage Categories</h1>

      {/* Category Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          name="slug"
          placeholder="Enter category slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit">{editingId ? 'Update Category' : 'Add Category'}</button>
      </form>

      {/* Categories Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.status}</td>
                <td>
                  <button onClick={() => handleEdit(category)}>Edit</button>
                  <button onClick={() => handleDelete(category._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No categories added</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Category;
