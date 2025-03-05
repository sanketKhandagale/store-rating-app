import { useState, useEffect } from "react";
import axios from "axios";

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStores(res.data))
      .catch(() => setError("Failed to load stores"));
  }, []);

  const handleDelete = (storeId) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:5000/api/admin/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setStores(stores.filter((store) => store.id !== storeId)))
      .catch(() => alert("Failed to delete store"));
  };

  const handleCreateStore = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:5000/api/admin/stores", newStore, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStores([...stores, res.data.store]))
      .catch(() => alert("Failed to create store"));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Stores</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Store Form */}
      <form onSubmit={handleCreateStore} className="mb-6">
        <input
          type="text"
          placeholder="Store Name"
          className="p-2 border rounded mr-2"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded mr-2"
          value={newStore.email}
          onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          className="p-2 border rounded mr-2"
          value={newStore.address}
          onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
          required
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Add Store
        </button>
      </form>

      {/* Stores Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Store Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="text-center">
              <td className="border p-2">{store.name}</td>
              <td className="border p-2">{store.email}</td>
              <td className="border p-2">{store.address}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(store.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStores;
