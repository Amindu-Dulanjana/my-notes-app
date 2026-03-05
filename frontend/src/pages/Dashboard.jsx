import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers,
      });
      console.log("Notes fetched:", res.data);
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search notes
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      fetchNotes();
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/notes/search?q=${encodeURIComponent(value)}`,
        { headers },
      );
      console.log("Search results:", res.data);
      setNotes(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Create new note
  const createNote = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/notes",
        { title: newTitle, content: "" },
        { headers },
      );

      setShowModal(false);
      setNewTitle("");

      navigate(`/notes/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete note
  const deleteNote = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, { headers });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + New Note
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Search notes..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        {/* Notes Grid */}
        {loading ? (
          <p className="text-center text-gray-400 mt-20">Loading...</p>
        ) : notes.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">No notes yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "+ New Note" to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes
              .filter(
                (note) => note.title !== "Untitled Note" || note.content !== "",
              )
              .map((note) => (
                <div
                  key={note._id}
                  onClick={() => navigate(`/notes/${note._id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">
                    {note.title}
                  </h3>
                  <p
                    className="text-gray-500 text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: note.content || "No content",
                    }}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => deleteNote(note._id, e)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">New Note</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createNote()}
              placeholder="Enter note title..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTitle("");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={createNote}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
