import { useState, useEffect } from "react";
import * as echarts from "echarts";
import TiltedCard from "../components/TiltedCard.jsx";
import LogoutButton from "../components/logoutButton.jsx";
import UserProfile from "../components/UserProfile.jsx";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { toggleTheme } from "../features/themeSlice.js";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((s) => s.theme.mode === "dark"); // true | false
  const user = useAppSelector((s) => s.auth.user); // { profilePicture, … }

  const [showAverageTasks, setShowAverageTasks] = useState(false);
  const [showUnassignedTasks, setShowUnassignedTasks] = useState(false);
  const [showHighPriorityTasks, setShowHighPriorityTasks] = useState(false);
  const [showAddTasks, setShowAddTasks] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasksList, setTasksList] = useState([]);

  // Toggle functions
  const toggleAddTasks = () => {
    setShowAddTasks(!showAddTasks);
  };

  const handleAddTask = (e) => {
    if (e.key === "Enter" && newTask.trim() !== "") {
      setTasksList([
        ...tasksList,
        {
          id: Date.now(),
          text: newTask.trim(),
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasksList(
      tasksList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasksList(tasksList.filter((task) => task.id !== id));
  };

  const toggleHighPriorityTasks = () => {
    setShowHighPriorityTasks(!showHighPriorityTasks);
  };

  const toggleAverageTasks = () => {
    setShowAverageTasks(!showAverageTasks);
  };

  const toggleUnassignedTasks = () => {
    setShowUnassignedTasks(!showUnassignedTasks);
  };

  // Sample tasks data
  const averageTasks = [
    {
      id: 1,
      title: "Complete project documentation",
      user: "Sarah Johnson",
      progress: 75,
    },
    {
      id: 2,
      title: "Review UI/UX designs",
      user: "Michael Chen",
      progress: 90,
    },
    {
      id: 3,
      title: "Implement API endpoints",
      user: "David Wilson",
      progress: 60,
    },
    { id: 4, title: "Write unit tests", user: "Emma Davis", progress: 45 },
    {
      id: 5,
      title: "Prepare client presentation",
      user: "James Miller",
      progress: 30,
    },
  ];

  // Unassigned tasks data
  const unassignedTasks = [
    {
      id: 1,
      title: "Fix login page responsiveness",
      priority: "High",
      daysUnassigned: 3,
    },
    {
      id: 2,
      title: "Update documentation for API v2",
      priority: "Medium",
      daysUnassigned: 5,
    },
    {
      id: 3,
      title: "Create dashboard analytics",
      priority: "High",
      daysUnassigned: 2,
    },
    {
      id: 4,
      title: "Review pull requests",
      priority: "Low",
      daysUnassigned: 7,
    },
    {
      id: 5,
      title: "Setup CI/CD pipeline",
      priority: "High",
      daysUnassigned: 4,
    },
  ];

  // High priority tasks data
  const highPriorityTasks = [
    {
      id: 1,
      title: "Fix critical security vulnerability",
      dueDate: "Today",
      assignee: "Unassigned",
    },
    {
      id: 2,
      title: "Resolve production outage",
      dueDate: "ASAP",
      assignee: "John Doe",
    },
    {
      id: 3,
      title: "Complete client demo preparation",
      dueDate: "Tomorrow",
      assignee: "Sarah Smith",
    },
    {
      id: 4,
      title: "Address compliance audit findings",
      dueDate: "End of week",
      assignee: "Legal Team",
    },
  ];

  useEffect(() => {
    // Initialize the bar chart
    const chartDom = document.getElementById("taskBarChart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        grid: {
          left: "0%",
          right: "0%",
          top: "10%",
          bottom: "0%",
          containLabel: false,
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          show: false,
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            data: [25, 40, 85, 30, 60, 45],
            type: "bar",
            itemStyle: {
              color: (params) => {
                return params.dataIndex === 2
                  ? "#E66000"
                  : isDarkMode
                  ? "#666"
                  : "#333";
              },
              borderRadius: [3, 3, 0, 0],
            },
          },
        ],
      };

      myChart.setOption(option);

      window.addEventListener("resize", () => {
        myChart.resize();
      });

      return () => {
        window.removeEventListener("resize", () => {
          myChart.resize();
        });
        myChart.dispose();
      };
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize the circular progress chart
    const progressChartDom = document.getElementById("circularProgressChart");
    if (progressChartDom) {
      const progressChart = echarts.init(progressChartDom);
      const option = {
        animation: false,
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: { show: false },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: "#E66000",
              },
            },
            axisLine: {
              lineStyle: {
                width: 15,
                color: [
                  [0.7, isDarkMode ? "#444" : "#f5f5f5"],
                  [1, "#E66000"],
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
              formatter: "{value}",
              color: isDarkMode ? "#fff" : "#000",
            },
            data: [{ value: 25 }],
          },
        ],
      };

      progressChart.setOption(option);

      window.addEventListener("resize", () => {
        progressChart.resize();
      });

      return () => {
        window.removeEventListener("resize", () => {
          progressChart.resize();
        });
        progressChart.dispose();
      };
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed h-screen w-16 bg-black rounded-r-3xl flex flex-col items-center py-4">
          <img
            src={
              user?.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
            }
            alt="avatar"
            onClick={() => setShowUserDashboard(!showUserDashboard)}
            className="
              w-10 h-10 rounded-full object-cover mb-12 cursor-pointer
              border-2 border-orange-600 hover:border-orange-700
              transition-colors
            "
          />
          <LogoutButton />
        </div>

        {/* Main Content */}
        <div className="ml-16 w-[calc(100%-4rem)] p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
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

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Tasks Card - Original */}
            <div
              className={`rounded-2xl p-4 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              } flex items-center`}
            >
              <div className="mr-2 w-2 h-2 bg-black rounded-full"></div>
              <div className="flex-grow">
                <div className="text-3xl font-bold">Add Tasks</div>
                <div className="flex justify-between items-center">
                  <span>Open Tasks</span>
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={toggleAddTasks}
                  >
                    <i
                      className={`fas ${
                        showAddTasks ? "fa-times" : "fa-arrow-right"
                      }`}
                    ></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Tasks Card - Expanded */}
            {showAddTasks && (
              <div
                className={`rounded-2xl p-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } col-span-2 relative`}
              >
                <div
                  className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={toggleAddTasks}
                >
                  <i className="fas fa-times"></i>
                </div>

                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                  <div className="text-lg font-semibold">Add New Tasks</div>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleAddTask}
                    placeholder="Type a task and press Enter..."
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-900"
                    } border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tasksList.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="mr-3 h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span
                          className={`${
                            task.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Done Tasks Card */}
            <div
              className={`rounded-2xl p-4 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-black mr-2"></div>
                <span>Done Tasks by team</span>
              </div>
              <div className="flex items-end mb-2">
                <span className="text-4xl font-bold">56</span>
                <span className="ml-2 text-gray-500">/ 68</span>
              </div>
              <div className="text-gray-500 mb-1">Good job!</div>
              <div className="h-1 bg-orange-500 w-4/5 rounded-full"></div>
            </div>

            {/* Resolved Tasks Card */}
            <div
              className={`rounded-2xl p-4 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              } col-span-2`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 border border-black flex items-center justify-center mr-2">
                      <i className="fas fa-check text-xs"></i>
                    </div>
                    <span>Resolved Tasks by Ali Karimi</span>
                  </div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">27</span>
                    <div className="ml-3">
                      <div className="text-green-600">+15%</div>
                      <div className="text-gray-500">Since last week</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {Array(30)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${
                          [2, 5, 15, 17, 21, 25].includes(i)
                            ? "bg-orange-600"
                            : isDarkMode
                            ? "bg-gray-600"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                </div>
              </div>
            </div>

            {/* Unassigned Tasks Card - Original */}
            <div className="rounded-2xl p-4 bg-black text-white flex items-center">
              <div className="mr-2 w-2 h-2 bg-white rounded-full"></div>
              <div className="flex-grow">
                <div className="text-3xl font-bold text-orange-500">12</div>
                <div className="flex justify-between items-center">
                  <div>
                    <span>Unassigned tasks</span>
                    <div className="text-gray-400 text-sm">8% of all tasks</div>
                  </div>
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={toggleUnassignedTasks}
                  >
                    <i
                      className={`fas ${
                        showUnassignedTasks ? "fa-times" : "fa-arrow-right"
                      }`}
                    ></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Unassigned Tasks Card - Expanded */}
            {showUnassignedTasks && (
              <div
                className={`rounded-2xl p-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } col-span-2 relative`}
              >
                <div
                  className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={toggleUnassignedTasks}
                >
                  <i className="fas fa-times"></i>
                </div>

                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  <div className="text-lg font-semibold">Unassigned Tasks</div>
                </div>

                <div className="space-y-3">
                  {unassignedTasks.map((task) => (
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
                            task.priority === "High"
                              ? "text-red-500"
                              : task.priority === "Medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {task.priority}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Unassigned for {task.daysUnassigned} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Average Tasks Card - Original */}
            <div
              className={`rounded-2xl p-4 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-black mr-2 flex items-center justify-center">
                    <div className="w-2 h-[1px] bg-white"></div>
                  </div>
                  <div>
                    <div>Average tasks by other</div>
                    <div>users in platform</div>
                  </div>
                </div>
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={toggleAverageTasks}
                >
                  <i
                    className={`fas ${
                      showAverageTasks ? "fa-times" : "fa-arrow-right"
                    }`}
                  ></i>
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-5xl font-bold">83%</div>
                <div className="ml-2 mb-2">
                  <div>20.Sep</div>
                  <div className="text-gray-500">Most tasks</div>
                </div>
              </div>

              <div id="taskBarChart" className="w-full h-24"></div>
            </div>

            {/* Average Tasks Card - Expanded */}
            {showAverageTasks && (
              <div
                className={`rounded-2xl p-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                } col-span-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-black mr-2 flex items-center justify-center">
                      <div className="w-2 h-[1px] bg-white"></div>
                    </div>
                    <div className="text-lg font-semibold">
                      Average Tasks by Other Users
                    </div>
                  </div>
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={toggleAverageTasks}
                  >
                    <i className="fas fa-times"></i>
                  </div>
                </div>

                <div className="space-y-3">
                  {averageTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.user}</div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="rounded-2xl bg-orange-600 text-white p-6 row-span-2 relative overflow-hidden">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  How to add new tasks during meet in our team?
                </h3>
              </div>

              <div className="absolute right-4 bottom-4 w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-4xl font-bold">!</span>
              </div>
            </div>

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

              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold">15</span>
                <span className="ml-2 text-gray-500">/ 12%</span>
                <span className="ml-1 text-gray-500">Of all tasks</span>
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
                  <div className="text-lg font-semibold">
                    High Priority Tasks
                  </div>
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

            {/* Create Custom Dashboard Card */}
            <div className="rounded-2xl bg-black text-white p-6 col-span-2 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-4">
                  <i className="fas fa-pencil-alt mr-2"></i>
                  <span>My dashboard</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">Create your custom</h3>
                <h3 className="text-2xl font-bold">
                  dashboard with dashbordic
                </h3>
              </div>

              <div className="flex flex-col items-end justify-between h-full">
                <button className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-plus"></i>
                </button>
                <div className="text-sm text-gray-400 mt-auto">
                  It takes you just 5 mins
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Dashboard Modal */}
        {showUserDashboard && (
          <UserProfile open onClose={() => setShowUserDashboard(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
