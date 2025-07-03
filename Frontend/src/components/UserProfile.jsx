import { useEffect, useState } from "react";
import axios from "axios";                 // axios instance withCredentials=true
import { useAppSelector } from "../app/hooks";

export default function UserProfile({ open, onClose }) {
  const darkMode  = useAppSelector((s) => s.theme.mode) === "dark";
  const userId    = useAppSelector((s) => s.auth.user?.id);
  const [user, setUser]       = useState(null);
  const [edit, setEdit]       = useState(false);
  const [form, setForm]       = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // ─────────── Fetch profile ───────────
  useEffect(() => {
    if (!open || !userId) return;
    const fetchMe = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/user/${userId}`);
        setUser(data);
        setForm({
          name:  data.name,
          phone: data.phone,
          profilePicture: data.profilePicture,
          teams:  data.teams.join(", "),
          skills: data.skills.join(", "),
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [open, userId]);

  if (!open) return null;

  // ─────────── Handlers ───────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const payload = {
        name:  form.name,
        phone: form.phone,
        profilePicture: form.profilePicture,
        teams:  form.teams.split(",").map((t) => t.trim()).filter(Boolean),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await axios.patch(`/api/user/${userId}`, payload);
      setUser(data.user);
      setEdit(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  // ─────────── UI helpers ───────────
  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <i className={`fas ${icon} text-gray-500 w-5 pt-[2px]`} />
      <div className="flex-1">
        <span className="font-medium">{label}:</span> {value}
      </div>
    </div>
  );

  // ─────────── Render ───────────
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-2xl p-6 w-full max-w-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-center py-8">Loading…</p>}
        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        {/* Profile */}
        {user && !loading && (
          <>
            {/* Avatar + name */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={user.profilePicture}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              {!edit ? (
                <>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-orange-600 capitalize">{user.role}</p>
                </>
              ) : (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-center rounded bg-gray-200/20 px-2 py-1"
                />
              )}
            </div>

            {/* Details */}
            {!edit ? (
              <div className="space-y-4">
                <InfoRow icon="fa-envelope" label="Email" value={user.email} />
                <InfoRow icon="fa-phone" label="Phone" value={user.phone} />
                <InfoRow
                  icon="fa-calendar-alt"
                  label="Joined"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />

                {/* Teams */}
                {user.teams.length > 0 && (
                  <InfoBlock title="Teams" items={user.teams} color="orange" />
                )}

                {/* Skills */}
                {user.skills.length > 0 && (
                  <InfoBlock title="Skills" items={user.skills} color="blue" />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className="font-medium">Phone</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded bg-gray-200/20 px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Profile Picture URL</span>
                  <input
                    name="profilePicture"
                    value={form.profilePicture}
                    onChange={handleChange}
                    className="mt-1 w-full rounded bg-gray-200/20 px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Teams (comma‑sep)</span>
                  <input
                    name="teams"
                    value={form.teams}
                    onChange={handleChange}
                    className="mt-1 w-full rounded bg-gray-200/20 px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Skills (comma‑sep)</span>
                  <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    className="mt-1 w-full rounded bg-gray-200/20 px-3 py-2"
                  />
                </label>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              {!edit ? (
                <button
                  onClick={() => setEdit(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEdit(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Tag list block
function InfoBlock({ title, items, color }) {
  const bg =
    color === "orange"
      ? "bg-orange-100 text-orange-800"
      : "bg-blue-100 text-blue-800";
  return (
    <div className="pt-4 border-t border-gray-200">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((x) => (
          <span key={x} className={`px-3 py-1 rounded-full text-sm ${bg}`}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
