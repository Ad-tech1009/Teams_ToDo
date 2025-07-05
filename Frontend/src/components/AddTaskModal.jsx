import { useState, useEffect } from "react";
import axios from "axios";          
import { useAppSelector } from "../app/hooks";

export default function AddTaskModal({ open, onClose, onTaskAdded }) {
  /* ─────────── Redux state ─────────── */
  const dark        = useAppSelector((s) => s.theme.mode) === "dark";
  // const currentUser = useAppSelector((s) => s.auth.user);      // { id, … }

  /* ─────────── Form state ─────────── */
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate]         = useState("");
  const [priority, setPriority]       = useState("Medium");
  const [status, setStatus]           = useState("ToDo");
  const [assignee, setAssignee]       = useState("");

  const [teamMembers, setTeamMembers] = useState([]);
  const [saving, setSaving]           = useState(false);
  const [err, setErr]                 = useState("");
  const url = import.meta.env.VITE_API_URI

  /* ─────────── Fetch team members when modal opens ─────────── */
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const { data } = await axios.get(`${url}/user/all`,{withCredentials: true});
        setTeamMembers(data);
      } catch {
        setTeamMembers([]);
      }
    })();
  }, [open,url]);

  /* ─────────── Helpers ─────────── */
  const resetForm = () => {
    setTitle(""); setDescription(""); setDueDate("");
    setPriority("Medium"); setStatus("ToDo"); setAssignee("");
    setErr(""); setSaving(false);
  };

  const submit = async () => {
    if (!title.trim() || !assignee || !dueDate) {
      return setErr("Title, Due date and Assignee are required.");
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        dueDate,
        priority,
        status,
        assignedTo: assignee,
      };
      const { data } = await axios.post(`${url}/task/`, payload,{withCredentials: true});
      onTaskAdded(data.task);         
      onClose();
      resetForm();
    } catch (e) {
      setErr(e.response?.data?.message || "Could not create task.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  /* ─────────── UI ─────────── */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        className={`w-full max-w-xl rounded-2xl p-6 ${
          dark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Task</h2>
          <button
            onClick={() => { onClose(); resetForm(); }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title *"
            className="p-2 rounded bg-gray-100 dark:bg-gray-700"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            <option>ToDo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 col-span-full"
          >
            <option value="">Assign to * </option>
            {teamMembers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 col-span-full"
          />
        </div>

        {err && <p className="text-red-500 mt-3">{err}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => { onClose(); resetForm(); }}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={submit}
            className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

