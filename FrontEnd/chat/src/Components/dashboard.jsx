import { useEffect, useState } from "react";
import axios from 'axios';


function Dashboard(){
    const [employees,setEmployees]=useState([]);//react kindly create a place i can store my employees coming from the backend
    const [showForm,setShowForm]=useState(false);
    const [fullName,setFullName]=useState("");
    const [department,setDepartment]=useState("");
    const [position,setPosition]=useState("");
    const [editingEmployee,setEditingEmployee]=useState(null)

    async function handleSubmit(e) {
    e.preventDefault();

    try {
        let result;

        if (editingEmployee) {//this is if editing is open
            // Update an existing employee
            result = await axios.put(
                `http://localhost:3000/infinix/edit/${editingEmployee.id}`,
                {
                    name: fullName,
                    department: department,
                    position: position
                }
            );

            // Update the employee in React state
            setEmployees(
                employees.map((employee) =>
                    employee.id === editingEmployee.id
                        ? {
                            ...employee,
                            name: fullName,
                            dept_name:
                                department === "1" ? "IT" :
                                department === "2" ? "HR" : "Finance",
                            position_name:
                                position === "1" ? "Developer" :
                                position === "2" ? "HR Officer" :
                                position === "3" ? "Accountant" : "Designer"
                        }
                        : employee
                )
            );

        } else {
            // Create a new employee
            result = await axios.post(
                "http://localhost:3000/infinix/create",
                {
                    name: fullName,
                    department: department,
                    position: position
                }
            );

            setEmployees([...employees, result.data.data]);
        }

        // Reset the form after saving
        setDepartment("");
        setPosition("");
        setFullName("");
        setEditingEmployee(null);
        setShowForm(false);

    } catch (error) {
        console.log(error);
    }
}
    async function handleDelete(id) {
        try {
            const result=await axios.delete(
                `http://localhost:3000/infinix/delete/${id}`,
            );
            setEmployees(employees.filter((employee)=>employee.id !==id))

        } catch (error) {
            console.log(error);
            
        }
    }
    function handleCancel() {
        setFullName("");
        setDepartment("");
        setPosition("");
        setEditingEmployee(null);
        setShowForm(false);
}

        function handleEdit(employee) {
                setEditingEmployee(employee);
                setFullName(employee.name);

               
                // Convert the department name into its ID
                if (employee.dept_name === "IT") {
                    setDepartment("1");
                } else if (employee.dept_name === "HR") {
                    setDepartment("2");
                } else if (employee.dept_name === "Finance") {
                    setDepartment("3");
                }

                // Convert the position name into its ID
                if (employee.position_name === "Developer") {
                    setPosition("1");
                } else if (employee.position_name === "HR Officer") {
                    setPosition("2");
                } else if (employee.position_name === "Accountant") {
                    setPosition("3");
                } else if (employee.position_name === "Designer") {
                    setPosition("4");
                }

                setShowForm(true);
        

        }

    useEffect(()=>{
        const fetchEmployees=async () => {
            const result=await axios.get(
                "http://localhost:3000/infinix/employees"
            );
            setEmployees(result.data.data)

        }
        fetchEmployees()
    },[]);
    return(
        <section className="dashboard">
            <header>
                <div className="navbar">
                    <span className="logo"><i className="ri-building-line"></i></span>
                    <span className="navname">Employee Directory</span>
                </div>
                <div className="right-area">
                    <span className="logo"><i className="ri-admin-fill"></i></span>
                    <span className="navname">Admin</span>
                </div>
                
            </header>
            <div className="content">
                <div className="add-area">
                    <h1>Employee Directory</h1>
                    <button onClick={()=>setShowForm(true)}>
                        <i className="ri-add-large-line"></i>Add Employees
                    </button>
                </div>
                {showForm && (
                    <div className="modal-overlay" onClick={()=>setShowForm(false)}>

                     <form action="" onClick={(e)=>e.stopPropagation()} onSubmit={handleSubmit}>
                        <div className="form-card">
                            <label>Full Name</label>
                             <input type="text" required value={fullName} placeholder="John Doe" onChange={(e)=>setFullName(e.target.value)} />
                        </div>
                         <div className="form-card">
                            <label>Department</label>
                            <select onChange={(e)=>setDepartment(e.target.value)} value={department}>
                                <option value="" disabled>Select Department</option>
                                <option value="1">IT</option>
                                <option value="2">HR</option>
                                <option value="3">Finance</option>

                            </select>
                        </div>
                        <div className="form-card">
                            <label>Position</label>
                            <select onChange={(e)=>setPosition(e.target.value)} value={position}>
                                <option value="" disabled>Select Position</option>
                                <option value="1">Developer</option>
                                <option value="2">HR Officer</option>
                                <option value="3">Accountant</option>
                                <option value="4">Designer</option>

                            </select>
                        </div>
                        <button type="submit" className="submit-btn">
                            {editingEmployee ? "Update Employee":"Add Employee" }
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                       
                     </form>
                    </div>
                  
                )}
                
                <h2 className="subtitle">Manage and view company employees</h2>
                <div className="grid-area">
                    <div className="grid">
                        <h2>Total Employees</h2>
                        <h4>{employees.length}</h4>
                    </div>
                      <div className="grid">
                        <h2>IT DEPARTMENT</h2>
                        <h4>
                            {employees.filter((employee)=>employee.dept_name ==="IT").length}
                        </h4>
                    </div>
                      <div className="grid">
                        <h2>HR DEPARTMENT</h2>
                        <h4>{employees.filter((employee)=>employee.dept_name ==="HR").length}</h4>
                    </div>
                </div>
                <div className="table-area">
                    <table>
                        <thead>
                            <tr>
                                     <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Actions</th>
                            </tr>
                           
                        </thead>
                        <tbody>
                            {employees.map((employee)=>(
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                  <td>{employee.dept_name}</td>
                                   <td>{employee.position_name}</td>
                                    <td className="action-part">
                                        <button onClick={()=>handleEdit(employee)}>Edit</button>
                                        <button onClick={()=>handleDelete(employee.id)}>
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            
            </div>
        </section>
    );
}

export default Dashboard