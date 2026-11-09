import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import TaskList from './assets/TaskList';
import TaskForm from './assets/TaskForm';

// Initial sample data based on assignment layout screenshot
const INITIAL_TASKS = [
  {
    id: 1,
    name: 'Go to gym',
    priority: 'High',
    status: 'To Do',
    notes: 'Latihan cardio dan beban',
    createdAt: '10 Nov 2026, 05:00',
  },
  {
    id: 2,
    name: 'Read a book',
    priority: 'Low',
    status: 'Done',
    notes: 'Membaca buku Clean Code bab 4',
    createdAt: '10 Nov 2026, 05:05',
  },
  {
    id: 3,
    name: 'Go to market',
    priority: 'Medium',
    status: 'In Progress',
    notes: 'Beli bahan makanan mingguan',
    createdAt: '10 Nov 2026, 05:10',
  },
  {
    id: 4,
    name: 'Restart learning Solidworks',
    priority: 'High',
    status: 'To Do',
    notes: 'Review tutorial 3D modeling dasar',
    createdAt: '10 Nov 2026, 05:15',
  },
  {
    id: 5,
    name: 'change slider to scroll',
    priority: 'High',
    status: 'Done',
    notes: 'Update komponen UI slider pada halaman depan',
    createdAt: '10 Nov 2026, 05:20',
  },
  {
    id: 6,
    name: 'To publish the article',
    priority: 'Medium',
    status: 'In Progress',
    notes: 'Review artikel blog teknis sebelum publish',
    createdAt: '10 Nov 2026, 05:25',
  },
];

function App() {
  // Load tasks from localStorage or use initial tasks
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('todolist_react_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Gagal membaca data dari localStorage', e);
    }
    return INITIAL_TASKS;
  });

  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('todolist_react_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Gagal menyimpan data ke localStorage', e);
    }
  }, [tasks]);

  const showNotification = (text, variant = 'success') => {
    setToastMessage({ text, variant });
  };

  const handleShowForm = () => setShowForm(true);

  const handleCloseForm = () => {
    setShowForm(false);
    setTaskToEdit(null);
  };

  // Helper formatting timestamp
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Add Task (Create)
  const addTask = (newTask) => {
    const taskObj = {
      ...newTask,
      id: Date.now(),
      createdAt: getFormattedTime(),
    };
    setTasks([taskObj, ...tasks]);
    showNotification(`Tugas "${newTask.name}" berhasil ditambahkan!`, 'success');
  };

  // Edit Task (Update)
  const editTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    showNotification(`Tugas "${updatedTask.name}" berhasil diperbarui!`, 'info');
  };

  // Delete Task (Delete)
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      showNotification(`Tugas "${taskToDelete.name}" telah dihapus!`, 'warning');
      setTaskToDelete(null);
    }
  };

  const triggerDelete = (id) => {
    const target = tasks.find((t) => t.id === id);
    if (target) {
      setTaskToDelete(target);
    }
  };

  // Toggle status cycle: To Do -> In Progress -> Done -> To Do
  const toggleStatus = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          let nextStatus = 'To Do';
          if (task.status === 'To Do') nextStatus = 'In Progress';
          else if (task.status === 'In Progress') nextStatus = 'Done';
          else if (task.status === 'Done') nextStatus = 'To Do';

          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const showEditForm = (task) => {
    setTaskToEdit(task);
    handleShowForm();
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());
    const matchesStatus =
      statusFilter === 'All' || task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === 'All' || task.priority.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate statistics
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  return (
    <div className="py-4 py-md-5">
      <Container className="todo-app-container">
        {/* Header Row: Title and + Add Task Button */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="app-header-title h2 mb-1">Task List</h1>
            <div className="d-flex gap-2 flex-wrap align-items-center mt-2">
              <span className="stats-badge">
                Total: <span>{totalCount}</span>
              </span>
              <span className="stats-badge">
                To Do: <span>{todoCount}</span>
              </span>
              <span className="stats-badge">
                In Progress: <span>{inProgressCount}</span>
              </span>
              <span className="stats-badge">
                Done: <span>{doneCount}</span>
              </span>
            </div>
          </div>

          <div>
            <button className="btn-add-task" onClick={handleShowForm}>
              <i className="bi bi-plus-lg"></i>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-card p-3 mb-4">
          <Row className="g-2 align-items-center">
            {/* Search Input */}
            <Col xs={12} md={6}>
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Cari nama tugas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchQuery('')}
                    title="Hapus pencarian"
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>

            {/* Filter Priority */}
            <Col xs={6} md={3}>
              <Form.Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter Prioritas"
              >
                <option value="All">Prioritas: Semua</option>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </Form.Select>
            </Col>

            {/* Filter Status */}
            <Col xs={6} md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter Status"
              >
                <option value="All">Status: Semua</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Reset Filters hint if active */}
          {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
              <span className="text-muted small">
                Menampilkan <strong>{filteredTasks.length}</strong> dari {tasks.length} tugas
              </span>
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none p-0 text-danger"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* Task List Component */}
        <TaskList
          tasks={filteredTasks}
          deleteTask={triggerDelete}
          showEditForm={showEditForm}
          toggleStatus={toggleStatus}
        />

        {/* Task Form Modal (Add / Edit) */}
        <TaskForm
          show={showForm}
          handleClose={handleCloseForm}
          addTask={addTask}
          editTask={editTask}
          taskToEdit={taskToEdit}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          show={!!taskToDelete}
          onHide={() => setTaskToDelete(null)}
          centered
          size="sm"
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fs-6 fw-bold text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>Konfirmasi Hapus
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-2">
            Apakah Anda yakin ingin menghapus tugas{' '}
            <strong>"{taskToDelete?.name}"</strong>?
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button
              variant="light"
              size="sm"
              onClick={() => setTaskToDelete(null)}
              className="rounded-pill"
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDeleteTask}
              className="rounded-pill px-3"
            >
              Hapus
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notification */}
        <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1060 }}>
          {toastMessage && (
            <Toast
              onClose={() => setToastMessage(null)}
              show={!!toastMessage}
              delay={3000}
              autohide
              bg={toastMessage.variant}
            >
              <Toast.Header closeButton={true}>
                <strong className="me-auto">
                  <i className="bi bi-bell-fill me-1"></i> Notifikasi
                </strong>
                <small>Baru saja</small>
              </Toast.Header>
              <Toast.Body className={toastMessage.variant === 'light' ? '' : 'text-white'}>
                {toastMessage.text}
              </Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </Container>
    </div>
  );
}

export default App;
