import { useState, useEffect } from "react";

// Icon Components
const EditIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

function SubCategory() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  let [editingId, setEditingId] = useState(null);
  // const [allSubCategories, setAllSubCategories] = useState([])

  useEffect(() =>{
    loadCategories();
    loadSubCategories();
  }, []);

    const getHeaders = () => ({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    });

  async function loadCategories(){
    const res = await fetch('/api/category/all',{headers : getHeaders()});
    const data = await res.json();
    setCategories(data.data)
  }

  async function loadSubCategories() {
    const res = await fetch("/api/subCategory/all", { headers: getHeaders() });
    const data = await res.json();
    setSubCategories(data.data);
    // setAllSubCategories(data.data);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(editingId){
      const res = await fetch(`/api/subCategory/update/${editingId}`,{
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({parentCategory: selectedParent, name, slug, status})
      });
      const data = await res.json();
      if(data.success){
        alert("Category updated successfully :)");
        loadSubCategories();
        setEditingId(null)
      }
    }else{
      const res = await fetch('/api/subCategory/create',{
        method : "POST",
        headers: getHeaders(),
        body: JSON.stringify({parentCategory: selectedParent, name, slug, status})
      })
      const data = await res.json();
      if(data.success){
        loadSubCategories();
        setSelectedParent("")
        setName("");
        setSlug("");
        setStatus("Active");
      }else{
        alert(data.message);
      }
    }
  };

  const handleEdit = (sub) =>{
    setEditingId(sub._id);
    setSelectedParent(sub.parentCategory._id);
    setName(sub.name);
    setSlug(sub.slug);
    setStatus(sub.status);
  }

  const handleDelete = async (id)=>{
    const res = await fetch(`/api/subCategory/delete/${id}`,{
      method: "DELETE",
      headers: getHeaders(),
    })  ;
    const data = await res.json();
    if(data.success){
      loadSubCategories();
    }
  };



  return (
    <>
        <div className="container">
        <h1>Manage Sub Categories</h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Parent Category */}
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
          >
            <option value="">Select Parent Category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Sub Category Name */}
          <input
            type="text"
            placeholder="Enter sub category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Slug */}
          <input
            type="text"
            placeholder="Enter slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          {/* Status */}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Submit */}
          <button type="submit">Add Sub Category</button>
        </form>

        {/* Table */}
        <div className="table-container">
          <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Parent Category</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subCategories.map((subCategory) => (
              <tr key={subCategory._id}>
                <td>{subCategory.parentCategory?.name}</td>

                <td>{subCategory.name}</td>

                <td>{subCategory.slug}</td>

                <td>{subCategory.status}</td>

                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(subCategory)}
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        borderRadius: "10px",
                        background: "#eff6ff",
                        color: "#3b82f6",
                        border: "1px solid #bfdbfe",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Edit"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(subCategory._id)}
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        borderRadius: "10px",
                        background: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      </div>
    </>
  );
}

export default SubCategory;
