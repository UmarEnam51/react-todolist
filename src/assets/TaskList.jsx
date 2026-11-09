import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

const TaskList = ({ tasks, deleteTask, showEditForm, toggleStatus }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="bi bi-clipboard2-check"></i>
        </div>
        <h5 className="fw-semibold text-secondary mb-1">Belum ada tugas</h5>
        <p className="text-muted small mb-0">
          Silakan klik tombol <strong>"+ Add Task"</strong> untuk menambahkan tugas baru.
        </p>
      </div>
    );
  }

  // Priority badge styling
  const renderPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="badge-priority badge-priority-high">
            <i className="bi bi-exclamation-circle me-1"></i>High
          </span>
        );
      case 'medium':
        return (
          <span className="badge-priority badge-priority-medium">
            <i className="bi bi-dash-circle me-1"></i>Medium
          </span>
        );
      case 'low':
        return (
          <span className="badge-priority badge-priority-low">
            <i className="bi bi-arrow-down-circle me-1"></i>Low
          </span>
        );
      default:
        return <span className="badge-priority badge-priority-medium">{priority}</span>;
    }
  };

  // Status pill class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return 'status-done';
      case 'in progress':
        return 'status-inprogress';
      default:
        return 'status-todo';
    }
  };

  // Circular indicator icon
  const renderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return <i className="bi bi-check-circle-fill fs-5 text-success"></i>;
      case 'in progress':
        return <i className="bi bi-circle-half fs-5 text-warning"></i>;
      default:
        return <i className="bi bi-circle fs-5 text-secondary"></i>;
    }
  };

  return (
    <div className="task-list-wrapper">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`task-item-card ${task.status?.toLowerCase() === 'done' ? 'is-done' : ''}`}
        >
          <Card.Body className="p-3">
            <div className="row align-items-center g-3">
              {/* Kolom 1: Task Name & Timestamp */}
              <div className="col-12 col-md-5 col-lg-5">
                <div className="column-label">Task</div>
                <div
                  className="task-name-text"
                  style={{
                    textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                    opacity: task.status === 'Done' ? 0.75 : 1,
                  }}
                >
                  {task.name}
                </div>
                {task.createdAt && (
                  <div className="task-time-text">
                    <i className="bi bi-clock"></i>
                    <span>{task.createdAt}</span>
                  </div>
                )}
              </div>

              {/* Kolom 2: Priority */}
              <div className="col-4 col-md-2 col-lg-2 text-start text-md-center">
                <div className="column-label">Priority</div>
                <div>{renderPriorityBadge(task.priority)}</div>
              </div>

              {/* Kolom 3: Status Badge */}
              <div className="col-4 col-md-2 col-lg-2 text-center">
                <div className="column-label d-none d-md-block">Status</div>
                <span className={`badge-status ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>

              {/* Kolom 4: Status Indicator (Clickable to cycle status) */}
              <div className="col-2 col-md-1 col-lg-1 text-center">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Klik untuk ubah status: {task.status}</Tooltip>}
                >
                  <button
                    type="button"
                    className={`status-indicator-btn ${getStatusClass(task.status)}`}
                    onClick={() => toggleStatus && toggleStatus(task.id)}
                    aria-label={`Ubah status ${task.name}`}
                  >
                    {renderStatusIcon(task.status)}
                  </button>
                </OverlayTrigger>
              </div>

              {/* Kolom 5: Action Buttons (Edit & Delete) */}
              <div className="col-2 col-md-2 col-lg-2 text-end">
                <div className="d-flex justify-content-end gap-1">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit Tugas</Tooltip>}>
                    <button
                      type="button"
                      className="btn-action btn-action-edit"
                      onClick={() => showEditForm(task)}
                      aria-label="Edit Tugas"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </OverlayTrigger>

                  <OverlayTrigger placement="top" overlay={<Tooltip>Hapus Tugas</Tooltip>}>
                    <button
                      type="button"
                      className="btn-action btn-action-delete"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Hapus Tugas"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
