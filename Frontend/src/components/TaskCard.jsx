import React, { useState } from 'react';

const TaskCard = ({ isDarkMode }) => {
  const [showTasks, setShowTasks] = useState(false);

  const handleToggle = () => {
    setShowTasks(prev => !prev);
  };

  return (
    <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
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
          className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          onClick={handleToggle}
        >
          <i className={`fas fa-arrow-${showTasks ? 'down' : 'right'}`}></i>
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

      {showTasks && (
        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-gray-700 shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Tasks</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <li>Design login page layout</li>
            <li>Fix API integration bug</li>
            <li>Write unit tests for dashboard</li>
            <li>Optimize image loading</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
