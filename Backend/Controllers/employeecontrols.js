import pool from "../db.js";


export const create=async (req,res) => {
    try {
        const {name,department,position}=req.body;
        if(!name || !department ||!position){
            return res.status(400).json({
                message:"All fields are required for employee creation"
            })
        }
        const result=await pool.query(`INSERT INTO employees(name,department,position) VALUES ($1,$2,$3) RETURNING *`,[name,department,position]);

        const employee=await pool.query(
            `SELECT 
            e.id,
            e.name,
            d.dept_name,
            p.position_name FROM employees e
            JOIN departments d
            ON e.department=d.id
            JOIN positions p
            ON e.position=p.id
            WHERE e.id=$1`,[result.rows[0].id]
        )
        res.status(201).json({
            message:`Employee ${name} created successfully`,
            data:employee.rows[0]
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Error encountered in employee creation",
            error:error
        })
        
    }
}

export const getEmployees=async (req,res) => {
    try {
        const result=await pool.query(`SELECT e.id,e.name,d.dept_name,p.position_name FROM employees e
JOIN
departments d
ON e.department=d.id
JOIN positions p
ON e.position=p.id;`);
res.status(200).json({
    message:"Employees fetched successfully",
    data:result.rows
})
    } catch (error) {
         console.error(error);
        res.status(500).json({
            message:"Error encountered in geting employees",
            error:error
        })
    }
}

export const deleteEmployee=async (req,res) => {
    try {
        const {id}=req.params;
        const result=await pool.query(`DELETE FROM employees WHERE id=$1`,[id]);
        res.status(200).json({
            message:"Delete successfull"
        })
    } catch (error) {
         console.error(error);
        res.status(500).json({
            message:"Error encountered in deleting employees",
            error:error
        })
    }
}


export const editEmployee=async (req,res) => {
    try {
        const {id}=req.params;
        const {name,department,position}=req.body;
        const result=await pool.query(
            `UPDATE employees SET name=$1 , department=$2 ,position=$3
            WHERE id=$4`,[name,department,position,id]
        );
        res.status(200).json({
            message:"Update successful"
        })
    } catch (error) {
            console.error(error);
        res.status(500).json({
            message:"Error encountered in updating employees",
            error:error
        })
    }
}