import { useState, useEffect } from "react";

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
  },[]);

  async function loadCategories(){
    const res = await fetch('/api/category/all');
    const data = await res.json();
    setCategories(data.data)
  }

  async function loadSubCategories() {
    const res = await fetch('/api/subCategory/all');
    const data = await res.json();
    setSubCategories(data.data);
    // setAllSubCategories(data.data);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(editingId){
      const res = await fetch(`/api/subCategory/update/${editingId}`,{
        method: "PUT",
        headers: {"Content-Type":"application/json"},
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
        headers: {"Content-Type": "application/json"},
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
                  <button onClick={() => handleEdit(subCategory)}>Edit</button>

                  <button onClick={() => handleDelete(subCategory._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SubCategory;
