import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pool from './db.js';
import EmployeeRoutes from './Routes/employeeRoutes.js';

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(cors());

app.use('/infinix',EmployeeRoutes)

const port=Number(process.env.PORT || 3000);
app.listen(port,()=>{
    console.log(`Server live and running on port ${port}`);
    
})