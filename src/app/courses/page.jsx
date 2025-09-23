"use client";

import { useEffect, useState } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [sell, setSell] = useState("");
  const [buy, setBuy] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      alert(err.message);
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setName("");
    setSell("");
    setBuy("");
    setShowDialog(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setName(course.name);
    setSell(course.sell);
    setBuy(course.buy);
    setShowDialog(true);
  };

  const closeDialog = () => setShowDialog(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      name,
      sell: parseFloat(sell),
      buy: parseFloat(buy),
    };

    try {
      if (editing) {
        // Update
        await fetch(`/api/courses/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });
      } else {
        // Create
        await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });
      }

      await fetchCourses();
      closeDialog();
    } catch (err) {
      alert(err.message);
      console.error("Failed to save course:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete course?")) return;

    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      await fetchCourses();
    } catch (err) {
      alert(err.message);

      console.error("Failed to delete course:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Courses</h2>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
        >
          Add Course
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <table className="w-full text-left text-sm bg-gray-900 rounded overflow-hidden">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="p-3">Course Name</th>
              <th className="p-3">Sell</th>
              <th className="p-3">Buy</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-800 transition">
                <td className="p-3 font-medium">{course.name}</td>
                <td className="p-3">{course.sell}</td>
                <td className="p-3">{course.buy}</td>
                <td className="p-3 flex items-center space-x-2">
                  <button
                    onClick={() => openEdit(course)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">
              {editing ? "Edit Course" : "Add Course"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-white">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Sell</label>
                <input
                  type="number"
                  step="any"
                  value={sell}
                  onChange={(e) => setSell(e.target.value)}
                  required
                  className="w-full bg-gray-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Buy</label>
                <input
                  type="number"
                  step="any"
                  value={buy}
                  onChange={(e) => setBuy(e.target.value)}
                  required
                  className="w-full bg-gray-700 rounded p-2 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                >
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
