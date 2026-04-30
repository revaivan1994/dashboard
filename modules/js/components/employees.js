import { getData, getDataPeriod, saveData } from "./data.js";
import { calculateAge, formatCurrency } from "./calculations.js";

function randerEmployeesTable() {
    const { year, month } = getDataPeriod();
    const data = getData(year, month);

    const tbody = document.getElementById("employeesBody");
    tbody.innerHTML = '';

    data.employees.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.surname}</td>
            <td>${calculateAge(employee.dateOfBirth)}</td>
            <td>${employee.position}</td>
            <td>${formatCurrency(employee.salary)}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td><button class="delete-btn" data-id="${employee.id}">Delete</button></td>
        `;
        tbody.appendChild(tr);

        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteEmployee(employee.id);
        });
    });
}

const employeeName = document.getElementById('employeeName');
const employeeNameError = document.getElementById('employeeNameError');
const employeeSurname = document.getElementById('employeeSurname');
const employeeSurnameError = document.getElementById('employeeSurnameError');
const employeeDob = document.getElementById('employeeDob');
const employeeDobError = document.getElementById('employeeDobError');
const employeePosition = document.getElementById('employeePosition');
const employeePositionError = document.getElementById('employeePositionError');
const employeeSalary = document.getElementById('employeeSalary');
const employeeSalaryError = document.getElementById('employeeSalaryError');

function deleteEmployee(id) {
    const { year, month } = getDataPeriod();
    const data = getData(year, month);
    const employees = data.employees.find(p => p.id === id);

    if (!confirm(`Delete employee "${employees.name}"?`)) return;

    data.employees = data.employees.filter(p => p.id !== id);
    saveData(year, month, data);
    randerEmployeesTable();
}

function validateEmployeeName(value) {
    const reg = /^[a-zA-Z0-9 ]+$/;
    return value.trim().length >= 3 && reg.test(value.trim());
}

function validateEmployeeSurname(value) {
    const reg = /^[a-zA-Z0-9 ]+$/;
    return value.trim().length >= 3 && reg.test(value.trim());
}

function validateEmployeeDob(value) {
    if (!value) {
        employeeDobError.textContent = "Date of birth is required";
        return false;
    }
    if (!isAdult(value)) {
        employeeDobError.textContent = "The employee must be over 18 years old.";
        return false;
    }
    employeeDobError.textContent = "";
    return true;
}

function validateEmployeePosition(value) {
    if (value === "") {
        employeePositionError.textContent = "Please select a position from the list";
        employeePosition.classList.add('error');
        return false;
    }
    return true;
}

function validateEmployeeSalary(value) {
    const num = Number(value);
    return Number(num) && num >= 1;
}


function isAdult(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const threshold = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return dob <= threshold;
}


function validateEmployeeForm() {
    if (!validateEmployeeName(employeeName.value)) {
        employeeName.classList.add('input-error');
        employeeNameError.innerText = "Please use only English letters (2-30 chars)";
    } else {
        employeeName.classList.remove('input-error');
        employeeNameError.innerText = "";
    }

    if (!validateEmployeeSurname(employeeSurname.value)) {
        employeeSurname.classList.add('input-error');
        employeeSurnameError.innerText = "Please use only English letters (2-30 chars)";
    } else {
        employeeSurname.classList.remove('input-error');
        employeeSurnameError.innerText = "";
    }

    if (!validateEmployeeDob(employeeDob.value)) {
        employeeDob.classList.add('input-error');
        employeeDobError.innerText = "The employee must be over 18 years old";
    } else {
        employeeDob.classList.remove('input-error');
        employeeDobError.innerText = "";
    }

    if (!validateEmployeePosition(employeePosition.value)) {
        employeePosition.classList.add('input-error');
        employeePositionError.innerText = "Please select a position from the list";
    } else {
        employeePosition.classList.remove('input-error');
        employeePositionError.innerText = "";
    }

    if (!validateEmployeeSalary(employeeSalary.value)) {
        employeeSalary.classList.add('input-error');
        employeeSalaryError.innerText = "Please only positive number";
    } else {
        employeeSalary.classList.remove('input-error');
        employeeSalaryError.innerText = "";
    }

    const submitBtn = document.getElementById('submitEmployee');
    const isValid = validateEmployeeName(employeeName.value) &&
        validateEmployeeSurname(employeeSurname.value) &&
        validateEmployeeDob(employeeDob.value) &&
        validateEmployeePosition(employeePosition.value) &&
        validateEmployeeSalary(employeeSalary.value);

    submitBtn.disabled = !isValid;
}

employeeName.addEventListener('input', validateEmployeeForm);
employeeSurname.addEventListener('input', validateEmployeeForm);
employeeDob.addEventListener('input', validateEmployeeForm);
employeePosition.addEventListener('change', validateEmployeeForm);
employeeSalary.addEventListener('input', validateEmployeeForm);

function addEmployee() {
     const employee = {
        id: Date.now(),
        name: document.getElementById('employeeName').value,
        surname: document.getElementById('employeeSurname').value,
        dateOfBirth: document.getElementById('employeeDob').value,
        position: document.getElementById('employeePosition').value,
        salary : Number(document.getElementById('employeeSalary').value),
        assignments: [],
        vacationDays: [],
    }
    return employee;
}

const panelOverlay = document.getElementById('panelOverlay');
const addEmployeePanel = document.getElementById('addEmployeePanel');

function saveEmployee () {
    const { year, month } = getDataPeriod();
    const data = getData(year, month);
    const newEmployee = addEmployee();

    data.employees.push(newEmployee);
    saveData(year, month, data);

    employeeName.value = '';
    employeeSurname.value = '';
    employeeDob.value = '';
    employeePosition.value = '';
    employeeSalary.value = '';
    validateEmployeeForm();

    randerEmployeesTable();

    panelOverlay.classList.remove('active');
    addEmployeePanel.classList.remove('active');
}

document.getElementById('submitEmployee').addEventListener('click', saveEmployee);


export { randerEmployeesTable };