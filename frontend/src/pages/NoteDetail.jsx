import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  //   const [content, setContent] = useState("");
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const editorRef = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes`, {
          headers,
        });
        const note = res.data.find((n) => n._id === id);
        if (note) {
          setTitle(note.title);
          setCollaborators(note.collaborators);
          // Set content via ref — no re-render cursor jump!
          if (editorRef.current) {
            editorRef.current.innerHTML = note.content || "";
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  // Save note
  const saveNote = async () => {
    setSaving(true);
    const currentContent = editorRef.current?.innerHTML || "";
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { title, content: currentContent },
        { headers },
      );
      setMessage("✅ Saved!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("❌ Error saving");
    } finally {
      setSaving(false);
    }
  };

  // Add collaborator
  const addCollaborator = async () => {
    if (!collaboratorEmail.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/notes/${id}/collaborate`,
        { email: collaboratorEmail },
        { headers },
      );
      setCollaborators(res.data.note.collaborators);
      setCollaboratorEmail("");
      setMessage("Collaborator added!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error adding collaborator");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center mt-20 text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold text-gray-800 border-none outline-none bg-transparent mb-4"
          placeholder="Note title..."
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          {/* <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full min-h-[300px] p-4 rounded-xl outline-none resize-none text-gray-700 text-base"
          /> */}

          {/* Toolbar */}
          <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 px-4 py-2 flex gap-2">
            <button
              onClick={() => document.execCommand("bold")}
              className="px-3 py-1 text-sm font-bold border border-gray-200 rounded hover:bg-gray-100"
            >
              B
            </button>
            <button
              onClick={() => document.execCommand("italic")}
              className="px-3 py-1 text-sm italic border border-gray-200 rounded hover:bg-gray-100"
            >
              I
            </button>
            <button
              onClick={() => document.execCommand("underline")}
              className="px-3 py-1 text-sm underline border border-gray-200 rounded hover:bg-gray-100"
            >
              U
            </button>
            <button
              onClick={() => document.execCommand("insertUnorderedList")}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100"
            >
              • List
            </button>
            <button
              onClick={() => document.execCommand("insertOrderedList")}
              className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-100"
            >
              1. List
            </button>
          </div>

          {/* Editable Content Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="bg-white rounded-b-xl border border-gray-200 min-h-[300px] p-4 outline-none text-gray-700 text-base mb-4"
          />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={saveNote}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            <img
              src="/collaborators_img.png"
              alt="logo"
              className="h-8 w-8 object-contain mb-2"
            />{" "}
            Collaborators
          </h3>

          <div className="flex gap-2 mb-4">
            <input
              type="email"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
              placeholder="Enter email to add collaborator..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={addCollaborator}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Add
            </button>
          </div>

          {collaborators.length === 0 ? (
            <p className="text-gray-400 text-sm">No collaborators yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {collaborators.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-xs">
                    {c.name?.charAt(0).toUpperCase()}
                  </span>
                  {c.name} — {c.email}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;
