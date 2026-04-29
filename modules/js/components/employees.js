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

function deleteEmployee(id) {
    const { year, month } = getDataPeriod();
    const data = getData(year, month);
    const employees = data.employees.find(p => p.id === id);
    
    if(!confirm(`Delete employee "${employees.name}"?`)) return;
    
    data.employees = data.employees.filter(p => p.id !== id);
    saveData(year, month, data);
    randerEmployeesTable();
}



export { randerEmployeesTable };