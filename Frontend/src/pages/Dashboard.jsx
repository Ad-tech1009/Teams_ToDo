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
  const url = import.meta.env.VITE_API_URI;
  const isDarkMode = useAppSelector((s) => s.theme.mode === "dark");
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("Dashboard");

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`${url}/task`);
        setTasks(data);
      } catch (err) {
        console.error(err.response?.data?.message || "Failed to load tasks");
      }
    };
    fetchTasks();
  }, [url]);

  useEffect(() => {
    if (!tasks.length) return;
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
      <div className="flex flex-col md:flex-row">
        <div className="hidden md:flex fixed h-screen w-16 bg-black rounded-r-3xl flex-col items-center py-4 space-y-6 z-20">
          <img
            src={
              user?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
            }
            alt="avatar"
            onClick={() => setShowUserDashboard(!showUserDashboard)}
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-orange-600 hover:border-orange-700 transition-colors"
          />

          {["fa-plus", "fa-columns", "fa-th-large"].map((icon, index) => (
            <button
              key={index}
              onClick={() => {
                if (icon === "fa-plus") setShowAddModal(true);
                else if (icon === "fa-columns") setView("Kanban Board");
                else if (icon === "fa-th-large") setView("Dashboard");
              }}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 text-white hover:bg-orange-600 hover:text-orange-400 focus:bg-orange-600 focus:text-orange-400`}
            >
              <i className={`fas ${icon}`}></i>
              <span className="absolute left-14 whitespace-nowrap bg-black text-white text-sm cursor-pointer px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {icon === "fa-plus"
                  ? "Add Task"
                  : icon === "fa-columns"
                  ? "Kanban Board"
                  : "Dashboard"}
              </span>
            </button>
          ))}

          <LogoutButton />
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black py-2 flex justify-around items-center z-20 rounded-t-3xl">
          {["fa-plus", "fa-columns", "fa-th-large", "fa-user"].map((icon, index) => (
            <button
              key={index}
              className="text-white text-xl flex flex-col items-center hover:text-orange-400"
              onClick={() => {
                if (icon === "fa-plus") setShowAddModal(true);
                else if (icon === "fa-columns") setView("Kanban Board");
                else if (icon === "fa-th-large") setView("Dashboard");
                else if (icon === "fa-user") setShowUserDashboard(!showUserDashboard);
              }}
            >
              <i className={`fas ${icon}`}></i>
              <span className="text-xs mt-1">
                {icon === "fa-plus"
                  ? "Add"
                  : icon === "fa-columns"
                  ? "Board"
                  : icon === "fa-th-large"
                  ? "Dash"
                  : "Profile"}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-4 pb-20 md:pb-4 md:pt-0 md:ml-16 w-full md:w-[calc(100%-4rem)] p-4">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h1 className="text-2xl font-bold">{view}</h1>
            <button
              className="cursor-pointer rounded-full p-2 hover:bg-orange-600/20"
              onClick={() => dispatch(toggleTheme())}
            >
              <i
                className={`fas ${
                  isDarkMode ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"
                }`}
              ></i>
            </button>
          </div>

          {view === "Kanban Board" && (
            <KanbanBoard tasks={tasks} setTasks={setTasks} />
          )}

          {view === "Dashboard" && <DashGrid />}
        </div>

        {(showUserDashboard || showAddModal) && (
          <div className="fixed inset-0 flex justify-center items-center p-4 z-30 overflow-auto bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-auto p-4 shadow-xl overflow-y-auto max-h-[90vh]">
              {showUserDashboard && (
                <UserProfile open onClose={() => setShowUserDashboard(false)} />
              )}
              {showAddModal && (
                <AddTaskModal
                  open
                  onClose={() => setShowAddModal(false)}
                  onTaskAdded={(task) => setTasks((prev) => [...prev, task])}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
