import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const TaskForm = ({ show, handleClose, addTask, editTask, taskToEdit }) => {
  const [task, setTask] = useState({
    name: '',
    priority: 'Medium',
    status: 'To Do',
    notes: '',
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTask({
        name: taskToEdit.name || '',
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'To Do',
        notes: taskToEdit.notes || '',
      });
    } else {
      setTask({
        name: '',
        priority: 'Medium',
        status: 'To Do',
        notes: '',
      });
    }
    setValidated(false);
  }, [taskToEdit, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.name.trim()) {
      setValidated(true);
      return;
    }

    if (taskToEdit) {
      editTask({
        ...taskToEdit,
        name: task.name.trim(),
        priority: task.priority,
        status: task.status,
        notes: task.notes.trim(),
      });
    } else {
      addTask({
        name: task.name.trim(),
        priority: task.priority,
        status: task.status,
        notes: task.notes.trim(),
      });
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <i
            className={`bi ${taskToEdit ? 'bi-pencil-square text-primary' : 'bi-plus-circle-fill text-purple'}`}
            style={{ color: '#7c3aed' }}
          ></i>
          <span>{taskToEdit ? 'Edit Tugas' : 'Tambah Tugas Baru'}</span>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body className="py-3">
          {/* Task Name */}
          <Form.Group className="mb-3" controlId="taskName">
            <Form.Label className="fw-semibold small text-secondary">
              Nama Kegiatan / Tugas <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Contoh: Belajar React 19, Beli sayur, dll..."
              value={task.name}
              onChange={handleChange}
              isInvalid={validated && !task.name.trim()}
              autoFocus
              className="py-2"
              required
            />
            <Form.Control.Feedback type="invalid">
              Nama tugas wajib diisi!
            </Form.Control.Feedback>
          </Form.Group>

          {/* Row Priority & Status */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <Form.Group controlId="taskPriority">
                <Form.Label className="fw-semibold small text-secondary">
                  Prioritas
                </Form.Label>
                <Form.Select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                  className="py-2"
                >
                  <option value="High">🔴 High (Tinggi)</option>
                  <option value="Medium">🟡 Medium (Sedang)</option>
                  <option value="Low">🟢 Low (Rendah)</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-6">
              <Form.Group controlId="taskStatus">
                <Form.Label className="fw-semibold small text-secondary">
                  Status
                </Form.Label>
                <Form.Select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                  className="py-2"
                >
                  <option value="To Do">⚪ To Do</option>
                  <option value="In Progress">🔵 In Progress</option>
                  <option value="Done">🟢 Done</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          {/* Optional Notes */}
          <Form.Group controlId="taskNotes">
            <Form.Label className="fw-semibold small text-secondary">
              Catatan Tambahan (Opsional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              placeholder="Tambahkan detail atau catatan jika diperlukan..."
              value={task.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={handleClose} className="px-3 rounded-pill">
            Batal
          </Button>
          <Button
            type="submit"
            className="btn-add-task px-4"
            style={{ borderRadius: '50rem' }}
          >
            <i className="bi bi-check-lg me-1"></i>
            {taskToEdit ? 'Simpan Perubahan' : 'Tambahkan'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskForm;
