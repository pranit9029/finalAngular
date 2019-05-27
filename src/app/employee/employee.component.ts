import { Component, OnInit } from '@angular/core';  
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { EmployeeService } from '../employee.service';  
import { Employee } from '../employee';  

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {  
  dataSaved = false;  
  employeeForm: any;  
  allEmployees: Observable<Employee[]>;  
  employeeIdUpdate = null;  
  massage = null;  
  
  constructor(private formbulider: FormBuilder, private employeeService:EmployeeService) { }  
  
  ngOnInit() {  
    this.employeeForm = this.formbulider.group({  
      
      Username: ['', [Validators.required]],  
      Password: ['', [Validators.required]],  
      Email: ['', [Validators.required]]
      
    });  
    this.loadAllEmployees();  
  }  
  loadAllEmployees() {  
    this.allEmployees = this.employeeService.getAllEmployee();  
  }  
  onFormSubmit() {  
    this.dataSaved = false;  
    const employee = this.employeeForm.value;  
    this.CreateEmployee(employee);  
    this.employeeForm.reset();  
  }  
  loadEmployeeToEdit(employeeId: string) {  
    this.employeeService.getEmployeeById(employeeId).subscribe(employee=> {  
      this.massage = null;  
      this.dataSaved = false;  
      this.employeeIdUpdate = employee.UserId;  
      this.employeeForm.controls['Username'].setValue(employee.Username);  
      this.employeeForm.controls['Password'].setValue(employee.Password);  
      this.employeeForm.controls['Email'].setValue(employee.Email);  
// tslint:disable-next-line: no-trailing-whitespace
      // this.employeeForm.controls['Role'].setValue(employee.Role);  
      // this.employeeForm.controls['UserType'].setValue(employee.UserType);
       
    });  
  
  }  
  CreateEmployee(employee: Employee) {  
    if (this.employeeIdUpdate == null) {  
      this.employeeService.createEmployee(employee).subscribe(  
        () => {  
          this.dataSaved = true;  
          this.massage = 'Record saved Successfully';  
          this.loadAllEmployees();  
          this.employeeIdUpdate = null;  
          this.employeeForm.reset();  
        }  
      );  
    } else {  
      employee.UserId = this.employeeIdUpdate;  
      this.employeeService.updateEmployee(employee).subscribe(() => {  
        this.dataSaved = true;  
        this.massage = 'Record Updated Successfully';  
        this.loadAllEmployees();  
        this.employeeIdUpdate = null;  
        this.employeeForm.reset();  
      });  
    }  
  }   
  deleteEmployee(employeeId: string) {  
    if (confirm("Are you sure you want to delete this ?")) {   
    this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {  
      this.dataSaved = true;  
      this.massage = 'Record Deleted Succefully';  
      this.loadAllEmployees();  
      this.employeeIdUpdate = null;  
      this.employeeForm.reset();  
  
    });  
  }  
}  
  resetForm() {  
    this.employeeForm.reset();  
    this.massage = null;  
    this.dataSaved = false;  
  }  
}  