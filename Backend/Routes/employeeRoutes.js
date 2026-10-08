import express from "express";
import { create,getEmployees,deleteEmployee,editEmployee } from "../Controllers/employeecontrols.js";

const router=express.Router();

router.post('/create',create);
router.get('/employees',getEmployees);
router.put('/edit/:id',editEmployee)
router.delete('/delete/:id',deleteEmployee)

export default router;