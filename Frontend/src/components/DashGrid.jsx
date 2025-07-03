import { useState, useEffect } from "react";
import * as echarts from "echarts";
import TiltedCard from "../components/TiltedCard.jsx";
import { useAppSelector } from "../app/hooks";
import axios from "axios";
import dayjs from "dayjs";

const DashGrid = () => {
  const isDarkMode = useAppSelector((s) => s.theme.mode === "dark"); // true | false
  const user = useAppSelector((s) => s.auth.user); // { profilePicture, … }

  /* ─────────────  TASK STATE  ───────────── */
  const [tasks, setTasks] = useState([]);

  /* ─────────────  MODAL / UI TOGGLES  ───────────── */
  const [showAverageTasks, setShowAverageTasks] = useState(false);
  const [showUnassignedTasks, setShowUnassignedTasks] = useState(false);
  const [showHighPriorityTasks, setShowHighPriorityTasks] = useState(false);
  const url = import.meta.env.VITE_API_URI

  /* ─────────────  INITIAL FETCH  ───────────── */
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
  }, []);

  /* ─────────────  DERIVED LISTS  ───────────── */
  const averageTasks = tasks.filter((t) => t.status === "In Progress");
  const unassignedTasks = tasks.filter((t) => !t.assignedTo);
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === "High" && t.status !== "Done"
  );

  /* ─────────────  UI TOGGLE FUNCTIONS  ───────────── */
  const toggleHighPriorityTasks = () => setShowHighPriorityTasks((p) => !p);
  const toggleAverageTasks = () => setShowAverageTasks((p) => !p);
  const toggleUnassignedTasks = () => setShowUnassignedTasks((p) => !p);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ─────────── DONE TASKS (team) ─────────── */}
      <div
        className={`rounded-2xl p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-black mr-2" />
          <span>Done tasks (all)</span>
        </div>
        <div className="flex items-end mb-2">
          <span className="text-4xl font-bold">
            {tasks.filter((t) => t.status === "Done").length}
          </span>
          <span className="ml-2 text-gray-500">/ {tasks.length}</span>
        </div>
        <div className="text-gray-500 mb-1">
          {tasks.length ? "Great work!" : "Start by creating your first task"}
        </div>
        <div
          className="h-1 bg-orange-500 rounded-full"
          style={{
            width:
              tasks.length === 0
                ? "0%"
                : `${
                    (tasks.filter((t) => t.status === "Done").length /
                      tasks.length) *
                    100
                  }%`,
          }}
        />
      </div>

      {/* ─────────── RESOLVED BY ME ─────────── */}
      <div
        className={`rounded-2xl p-4 col-span-2 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div className="flex justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 border border-black flex items-center justify-center mr-2">
                <i className="fas fa-check text-xs" />
              </div>
              <span>Resolved by {user.name}</span>
            </div>
            <div className="flex items-end">
              <span className="text-4xl font-bold">
                {
                  tasks.filter(
                    (t) => t.assignedTo === user.id && t.status === "Done"
                  ).length
                }
              </span>
              <div className="ml-3 text-gray-500">
                of your {tasks.filter((t) => t.assignedTo === user.id).length}{" "}
                tasks
              </div>
            </div>
          </div>

          {/* simple sparkline of last 30 tasks (done vs not) */}
          <div className="grid grid-cols-6 gap-1">
            {tasks
              .slice(-30)
              .map((t) => t.status === "Done")
              .map((done, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    done
                      ? "bg-orange-600"
                      : isDarkMode
                      ? "bg-gray-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
          </div>
        </div>
      </div>

      {/* ─────────── UNASSIGNED ─────────── */}
      <div className="rounded-2xl p-4 bg-black text-white flex items-center">
        <div className="mr-2 w-2 h-2 bg-white rounded-full" />
        <div className="flex-grow">
          <div className="text-3xl font-bold text-orange-500">
            {unassignedTasks.length}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span>Unassigned tasks</span>
              <div className="text-gray-400 text-sm">
                {tasks.length
                  ? Math.round((unassignedTasks.length / tasks.length) * 100)
                  : 0}
                % of all
              </div>
            </div>
            <button
              onClick={toggleUnassignedTasks}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700"
            >
              <i
                className={`fas ${
                  showUnassignedTasks ? "fa-times" : "fa-arrow-right"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {showUnassignedTasks && (
        <div
          className={`rounded-2xl p-4 col-span-2 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          } relative`}
        >
          <button
            onClick={toggleUnassignedTasks}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300"
          >
            <i className="fas fa-times" />
          </button>
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            <span className="text-lg font-semibold">Unassigned Tasks</span>
          </div>

          {unassignedTasks.length === 0 && (
            <p className="text-sm text-gray-500">All tasks are assigned 🎉</p>
          )}

          <div className="space-y-3">
            {unassignedTasks.map((t) => (
              <div
                key={t._id}
                className={`p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{t.title}</span>
                  <span
                    className={`text-sm ${
                      t.priority === "High"
                        ? "text-red-500"
                        : t.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────── AVERAGE BY OTHERS ─────────── */}
      {/* — unchanged visually, but uses averageTasks derived from tasks array — */}
      <div
        className={`rounded-2xl p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-black mr-2 flex items-center justify-center">
              <div className="w-2 h-[1px] bg-white" />
            </div>
            <div>
              <div>Average tasks by other</div>
              <div>users in platform</div>
            </div>
          </div>
          <button
            onClick={toggleAverageTasks}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300"
          >
            <i
              className={`fas ${
                showAverageTasks ? "fa-times" : "fa-arrow-right"
              }`}
            />
          </button>
        </div>

        <div className="flex items-end">
          <span className="text-5xl font-bold">
            {tasks.length
              ? Math.round((averageTasks.length / tasks.length) * 100)
              : 0}
            %
          </span>
          <div className="ml-2 mb-2 text-gray-500">
            {averageTasks.length} tasks by others
          </div>
        </div>

        <div id="taskBarChart" className="w-full h-24" />
      </div>

      {showAverageTasks && (
        <div
          className={`rounded-2xl p-4 col-span-2 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-black mr-2 flex items-center justify-center">
                <div className="w-2 h-[1px] bg-white" />
              </div>
              <span className="text-lg font-semibold">
                Tasks by other users
              </span>
            </div>
            <button
              onClick={toggleAverageTasks}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          {averageTasks.length === 0 && (
            <p className="text-sm text-gray-500">No tasks by other users.</p>
          )}

          <div className="space-y-3">
            {averageTasks.map((t) => (
              <div
                key={t._id}
                className={`p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-sm text-gray-500">
                    {t.createdBy.name || "Someone"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Card */}
      <div
        className={`rounded-2xl p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        } flex flex-col items-center justify-center`}
      >
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-1">
            <i className="fas fa-user-circle mr-1"></i>
            <span>All products that your</span>
          </div>
          <div>team made by all</div>
          <div>Admins</div>
        </div>

        <div id="circularProgressChart" className="w-40 h-40"></div>
      </div>

      {/* High Priority Tasks Card - Original */}
      <div
        className={`rounded-2xl p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-2">
              <i className="fas fa-caret-up"></i>
            </div>
            <span>High priority tasks</span>
          </div>
          <div
            className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={toggleHighPriorityTasks}
          >
            <i
              className={`fas ${
                showHighPriorityTasks ? "fa-times" : "fa-arrow-right"
              }`}
            ></i>
          </div>
        </div>

        <div className="flex space-x-1">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex-1">
                <div
                  className={`w-0 h-0 
                            border-l-[12px] border-l-transparent 
                            border-r-[12px] border-r-transparent 
                            border-b-[20px] ${
                              i === 2
                                ? "border-b-orange-500"
                                : isDarkMode
                                ? "border-b-gray-600"
                                : "border-b-gray-300"
                            }`}
                ></div>
              </div>
            ))}
        </div>
      </div>

      {/* High Priority Tasks Card - Expanded */}
      {showHighPriorityTasks && (
        <div
          className={`rounded-2xl p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          } col-span-2 relative`}
        >
          <div
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={toggleHighPriorityTasks}
          >
            <i className="fas fa-times"></i>
          </div>

          <div className="flex items-center mb-4">
            <i className="fas fa-caret-up mr-2"></i>
            <div className="text-lg font-semibold">High Priority Tasks</div>
          </div>

          <div className="space-y-3">
            {highPriorityTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{task.title}</div>
                  <div
                    className={`text-sm ${
                      task.assignee === "Unassigned"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {task.assignee}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Due: {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TiltedCard
        imageSrc="https://tse1.mm.bing.net/th/id/OIP.lWs20RVpPYdJ1sR13nLgpAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3"
        altText="Kendrick Lamar - GNX Album Cover"
        containerHeight="300px"
        containerWidth="300px"
        imageHeight="300px"
        imageWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.2}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="tilted-card-demo-text px-5 py-9 bold">
            Was it worth today ?
          </p>
        }
      />
    </div>
  );
};

export default DashGrid;
