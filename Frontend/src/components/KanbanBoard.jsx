import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppSelector } from "../app/hooks";
import axios from "axios";

/*
 * Kanban board using @dnd-kit (react‑beautiful‑dnd is deprecated)
 * Columns: To‑Do / In Progress / Done
 */
export default function KanbanBoard({ tasks, setTasks }) {
  const dark = useAppSelector((s) => s.theme.mode) === "dark";
  const [activeId, setActiveId] = useState(null);
  const url = import.meta.env.VITE_API_URI

  const columns = ["ToDo", "In Progress", "Done"];
  const colLabels = {
    ToDo: "To-Do",
    "In Progress": "In Progress",
    Done: "Done",
  };

  // map status → tasks
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  /* Dnd‑kit sensors */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  /* ───────── drag handlers ───────── */
  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const fromStatus = findStatus(active.id);
    const toStatus = findStatus(over.id);
    if (!fromStatus || !toStatus) return;

    /* 1. Optimistic local reorder */
    setTasks((prev) => {
      //   const clone = { ...prev };
      // remove from old column
      const fromTasks = prev.filter((t) =>
        t._id === active.id ? false : true
      );
      let working = fromTasks;
      // update status locally
      working = working.map((t) =>
        t._id === active.id ? { ...t, status: toStatus } : t
      );
      return working;
    });

    /* 2. Persist backend */
    try {
      await axios.patch(`${url}/task/${active.id}`, { status: toStatus });
    } catch (e) {
      console.error("Failed to update", e);
    }
  };

  const findStatus = (id) => tasks.find((t) => t._id === id)?.status;

  /* ───────── render ───────── */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-[calc(100vh-4rem)] overflow-x-auto">
        {columns.map((status) => (
          <Column
            key={status}
            status={status}
            label={colLabels[status]}
            tasks={tasksByStatus[status]}
            dark={dark}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <TaskCard task={tasks.find((t) => t._id === activeId)} dark={dark} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* Column component */
function Column({ status, label, tasks, dark }) {
  return (
    <div
      className={`${
        dark ? "bg-gray-800" : "bg-gray-200"
      } rounded-2xl flex flex-col`}
    >
      <div className="p-4 border-b border-gray-500 flex justify-between items-center">
        <span className="font-semibold">{label}</span>
        <span
          className={`text-xs w-6 h-6 flex items-center justify-center rounded-full text-white ${
            status === "ToDo"
              ? "bg-gray-500"
              : status === "In Progress"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto p-4">
          {tasks.map((task) => (
            <SortableTask key={task._id} task={task} dark={dark} />
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-sm text-gray-500">No tasks</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

/* Task wrapper that makes each card sortable */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function SortableTask({ task, dark }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} dark={dark} />
    </div>
  );
}

/* visual card */
function TaskCard({ task, dark }) {
  return (
    <div
      className={`p-3 rounded-lg shadow mb-2 ${
        dark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="font-medium truncate mb-1">{task.title}</div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{task.priority}</span>
        {task.dueDate && (
          <span>
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
