// import React from "react"
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <>
      <nav>
        <ul style={{ display: "flex", gap: "20px", listStyle: "none" }}>
          <li>
            <Link to="/">Dashboard</Link>
          </li>

          <li>
            <Link to="/category">Categories</Link>
          </li>

          <li>
            <Link to="/subcategory">SubCategories</Link>
          </li>

          <li>
            <Link to="/product">Products</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar