import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./taskcard.css";
import { formatDate, isDateOverdue } from "../utils/dateHelpers.js";
import { Draggable } from "@hello-pangea/dnd";
import { useUsers } from "../contexts/UsersContext.jsx";
import TimeZone from "./TimeZone.jsx";


/**
 * TaskCard
 *
 * Presentational component for displaying a single task inside a board column.
 * - Does not make any API calls.
 * - Expects a populated `task` object to be passed in as a prop.
 * - The parent column / list is responsible for loading tasks from the backend
 *   and passing the correct data into this component.
 */
export default function TaskCard({ task, index }) {
  const navigate = useNavigate();

  const { users } = useUsers();
  const [showAssigneeTime, setShowAssigneeTime] = useState(false);
  const [showReporterTime, setShowReporterTime] = useState(false);

  if (!task || task.id == null) {
    return null;
  }

  const {
    id,
    title,
    reporter_id,
    assignee_id,
    start_date,
    due_date,
  } = task;

  const isOverdue = isDateOverdue(due_date);

  const assigneeUser = assignee_id != null ? users.find((u) => u.id === Number(assignee_id)) : null;
  const reporterUser = reporter_id != null ? users.find((u) => u.id === Number(reporter_id)) : null;

  function getUserLabel(userId) {
    if (userId == null) return null;
    const user = users.find((u) => u.id === Number(userId));
    if (!user) return `User ${userId}`;
    return user.display_name || user.email || `User ${user.id}`;
  }

  return (
    <Draggable draggableId={String(id)} index={index}> 
      {(provided) => (
    <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      className="task-card"
      onClick={() => navigate(`/task/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/task/${id}`);
        }
      }}
    >
      <div className="task-card__header">
        <h3 className="task-card__title">{title}</h3>
      </div>

      <dl className="task-card__meta">
        {assignee_id != null && (
          <div>
            <dt>Assignee</dt>
            <dd className="relative">
              <span
                onMouseEnter={() => setShowAssigneeTime(true)}
                onMouseLeave={() => setShowAssigneeTime(false)}
              >
                {getUserLabel(assignee_id)}
              </span>
              {showAssigneeTime && (
                <div>
                  <TimeZone user={assigneeUser} />
                </div>
              )}
            </dd>
          </div>
        )}
        {reporter_id != null && (
          <div>
            <dt>Reporter</dt>
            <dd className="relative">
              <span
                onMouseEnter={() => setShowReporterTime(true)}
                onMouseLeave={() => setShowReporterTime(false)}
              >
                {getUserLabel(reporter_id)}
              </span>
              {showReporterTime && (
                <div>
                  <TimeZone user={reporterUser} />
                </div>
              )}
            </dd>
          </div>
        )}
        <div className="task-card__dates-row">
          <div>
            <dt>Start</dt>
            <dd>{formatDate(start_date)}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd className={isOverdue ? "task-card__due task-card__overdue" : "task-card__due"}>
              {formatDate(due_date)}
            </dd>
          </div>
        </div>
      </dl>
    </div>
    )}
    </Draggable>
  );
}
