import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        createdBy: '',
        search: '',
        Status:'Open',
        priority: 'Low',
    });
    const [filter, setFilter] = useState({
        Status: 'All',
        priority: 'All',
    });

    const fetchTasks = async () => {
        try {
            const response = await
                fetch('http://localhost:5000/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error(
                'Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
            
        });
        console.log(filter)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await
                fetch('http://localhost:5000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    
                });
                console.log(formData)
            const newTask = await response.json();
            setTasks([...tasks, newTask]);
            setFormData({
                title: '',
                description: '',
                createdBy: '',
                search: '',
                Status:'',
                priority: 'Low'
            });
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleSearch = async (query) => {
        // Trim white spaces and convert to lowercase
        const searchQuery = query.toLowerCase().trim();

        if (searchQuery !== '') {
            const searchedTasks = tasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchQuery) ||
                    task.description.toLowerCase().includes(searchQuery) ||
                    task.createdBy.toLowerCase().includes(searchQuery)
            );

            setTasks(searchedTasks);
        } else {
            // If search query is empty, revert to original list of tasks
            fetchTasks(); // Refetch tasks from the server
        }
    };



    const handleDelete = async (taskId) => {
        try {
            await
                fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                    method: 'DELETE',
                });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handlePriorityChange = async (taskId, newPriority) => {
        try {
            const response = await
                fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ priority: newPriority }),
                });

            const updatedTask = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? {
                        ...task,
                        priority: updatedTask.priority,
                        Status:updatedTask.Status
                    } : task
                )
            );
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };
    const handleStatusChange = async (taskId, newStatus) => {
      try {
          const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ Status: newStatus }),
          });
  
          const updatedTask = await response.json();
          console.log('Updated Task:', updatedTask); // Debugging line
  
          setTasks((prevTasks) =>
              prevTasks.map((task) =>
                  task._id === taskId ? {
                      ...task,
                      Status: updatedTask.Status
                  } : task
              )
          );
      } catch (error) {
          console.error('Error updating status:', error);
      }
  };
  

    const filteredTasks = tasks.filter((task) => {
        const StatusFilter =
            filter.Status === 'All' ?
                true : task.Status === filter.Status;
        const priorityFilter =
            filter.priority === 'All' ?
                true : task.priority === filter.priority;
      console.log(filter.Status,filter.priority)

        return StatusFilter && priorityFilter;
    });
    function getPriorityColor(priority) {
        switch (priority) {
            case 'Low':
                return '#aafaae'; // Green
            case 'Medium':
                return '#fcee68'; // Yellow
            case 'High':
                return '#fc8181'; // Red
            default:
                return '#fff'; // White for no priority
        }
    }
    return (
        <div className="App">
          <div className='ops'>
            <div className='header'><h1>Task Manager</h1></div>
            
            <div className='form'>
            <form onSubmit={handleSubmit}>
              
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Created By:
                    <input
                        type="text"
                        name="createdBy"
                        value={formData.createdBy}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Status:
                    <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleInputChange}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </label>
                <label>
                    Priority:
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
            </div>
            
            
            <ul>
              <li>
            <label>
                Status:
                <select name="Status"
                    value={filter.Status}
                    onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </label>
            </li>
            <li>
            <label>
                Priority:
                <select name="priority"
                    value={filter.priority}
                    onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </label>
            </li>
            <li>
            <label>
                Search:
                <input
                    type="text"
                    name="search"
                    value={formData.search}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            search: e.target.value
                        }); // Update formData.search
                        // Invoke handleSearch with the input value
                        handleSearch(e.target.value);
                    }}
                />


            </label>
            </li>
            </ul>
            </div>
            
            <h2>Tasks</h2>
            <div className="card-container">
                {filteredTasks.map((task) => (
                    <div
                        key={task._id}
                        className="card"
                        style={{
                            backgroundColor: getPriorityColor(task.priority)
                        }}
                    >

                        <div className="card-content">

                            <strong>{task.title}</strong> <br />
                            {task.description}<br />
                            (Created by: {task.createdBy})
                        </div>
                        <br />
                        <div className="card-actions">
                            <span>Priority: {task.priority}</span>
                            <br />
                            <br />
                            <label>
                                Update Status:
                                <br />
                                <br />

                                <select
                                    value={task.Status}
                                    onChange={(e) =>
                                        handleStatusChange(task._id,
                                            e.target.value)
                                    }
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </label>
                            <label>
                                Update Priority:
                                <br />
                                <br />

                                <select
                                    value={task.priority}
                                    onChange={(e) =>
                                        handlePriorityChange(task._id,
                                            e.target.value)
                                    }
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </label>
                            <button
                                onClick={() => handleDelete(task._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            
    );
}

export default App;