import { useState, useEffect } from "react";
import * as echarts from "echarts";
import LogoutButton from "../components/logoutButton.jsx";
import UserProfile from "../components/UserProfile.jsx";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { toggleTheme } from "../features/themeSlice.js";
import axios from "axios";
import dayjs from "dayjs";
import AddTaskModal from "../components/AddTaskModal.jsx";
import DashGrid from "../components/DashGrid.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const url = import.meta.env.VITE_API_URI
  const isDarkMode = useAppSelector((s) => s.theme.mode === "dark"); // true | false
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  /* ─────────────  TASK STATE  ───────────── */
  const [tasks, setTasks] = useState([]); // all tasks from backend

  /* ─────────────  MODAL / UI TOGGLES  ───────────── */
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("Dashboard"); // "Kanban Board" | "Dashboard"

  /* ─────────────  INITIAL FETCH  ───────────── */
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`${url}/task`); // returns tasks assigned to or by user
        setTasks(data);
      } catch (err) {
        console.error(err.response?.data?.message || "Failed to load tasks");
      }
    };
    fetchTasks();
  }, [url]);

  /* ---------- BAR: tasks created per day (Mon‑Sat) ---------- */
  useEffect(() => {
    if (!tasks.length) return; // nothing yet
    const chartDom = document.getElementById("taskBarChart");
    if (!chartDom) return;

    const counts = [0, 0, 0, 0, 0, 0];
    const startOfWeek = dayjs().startOf("week").add(1, "day");

    tasks.forEach((t) => {
      const created = dayjs(t.createdAt);
      const diff = created.diff(startOfWeek, "day");
      if (diff >= 0 && diff < 6) counts[diff] += 1;
    });

    const myChart = echarts.init(chartDom);
    myChart.setOption({
      animation: false,
      grid: { left: 0, right: 0, top: "10%", bottom: 0, containLabel: false },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        show: false,
      },
      yAxis: { type: "value", show: false },
      series: [
        {
          data: counts,
          type: "bar",
          itemStyle: {
            color: (p) =>
              p.dataIndex === new Date().getDay() - 1
                ? "#E66000"
                : isDarkMode
                ? "#666"
                : "#333",
            borderRadius: [3, 3, 0, 0],
          },
        },
      ],
    });

    const handle = () => myChart.resize();
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
      myChart.dispose();
    };
  }, [tasks, isDarkMode]);

  /* ---------- GAUGE: % tasks completed ---------- */
  useEffect(() => {
    if (!tasks.length) return;
    const dom = document.getElementById("circularProgressChart");
    if (!dom) return;

    const completed = tasks.filter((t) => t.status === "Done").length;
    const percent = Math.round((completed / tasks.length) * 100);

    const gauge = echarts.init(dom);
    gauge.setOption({
      animation: false,
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: {
            show: true,
            roundCap: true,
            clip: false,
            overlap: false,
            itemStyle: { color: "#E66000" },
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [percent / 100, "#E66000"],
                [1, isDarkMode ? "#444" : "#f5f5f5"],
              ],
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: false,
            offsetCenter: [0, 0],
            fontSize: 40,
            fontWeight: "bold",
            formatter: "{value}%",
            color: isDarkMode ? "#fff" : "#000",
          },
          data: [{ value: percent }],
        },
      ],
    });

    const handle = () => gauge.resize();
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
      gauge.dispose();
    };
  }, [tasks, isDarkMode]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed h-screen w-16 bg-black rounded-r-3xl flex flex-col items-center py-4 space-y-6">
          {/* Avatar */}
          <img
            src={
              user?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
            }
            alt="avatar"
            onClick={() => setShowUserDashboard(!showUserDashboard)}
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-orange-600 hover:border-orange-700 transition-colors"
          />

          {/* Icon Button */}
          {[
            {
              icon: "fa-plus",
              onClick: () => setShowAddModal(true),
              label: "Add Task",
            },
            {
              icon: "fa-columns",
              onClick: () => setView("Kanban Board"),
              label: "Kanban Board",
              active: view === "Kanban Board",
            },
            {
              icon: "fa-th-large",
              onClick: () => setView("Dashboard"),
              label: "Dashboard",
              active: view === "Dashboard",
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 text-white hover:bg-orange-600 ${
                item.active ? "text-orange-500" : ""
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              {/* Tooltip */}
              <span className="absolute left-14 whitespace-nowrap bg-black text-white text-sm cursor-pointer px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {item.label}
              </span>
            </button>
          ))}

          <LogoutButton />
        </div>

        {/* Main Content */}
        <div className="ml-16 w-[calc(100%-4rem)] p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{view}</h1>
            <div className="flex items-center space-x-4">
              <button
                className="cursor-pointer !rounded-button whitespace-nowrap"
                onClick={() => dispatch(toggleTheme())}
              >
                <i
                  className={`fas ${
                    isDarkMode
                      ? "fa-sun text-yellow-400"
                      : "fa-moon text-gray-600"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* KanBan Board */}
          {view == "Kanban Board" && (
            <KanbanBoard tasks={tasks} setTasks={setTasks} />
          )}
          {/* Dashboard Grid */}
          {view == "Dashboard" && <DashGrid />}
        </div>

        {/* User Dashboard Modal */}
        {showUserDashboard && (
          <UserProfile open onClose={() => setShowUserDashboard(false)} />
        )}

        {/* Add Task Modal */}
        <AddTaskModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onTaskAdded={(task) => setTasks((prev) => [...prev, task])}
        />
      </div>
    </div>
  );
};

export default Dashboard;
