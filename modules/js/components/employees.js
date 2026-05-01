import { getData, getDataPeriod, saveData } from "./data.js";
import { calculateAge, formatCurrency, getEmployeeCost, getEffectiveCapacity, getProjectRevenue } from "./calculations.js";
import { openAssignPopup } from './assignments.js';
import { renderProjectsTable } from './projects.js';

let sortField = null;
let sortDirection = 'asc';
let positionFilter = 'all';

function randerEmployeesTable() {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const tbody = document.getElementById("employeesBody");
   tbody.innerHTML = '';

   let employees = [...data.employees];

   if (sortField) {
      employees.sort((a, b) => {
         let valA = a[sortField];
         let valB = b[sortField];

         if (sortField === 'age') {
            valA = calculateAge(a.dateOfBirth);
            valB = calculateAge(b.dateOfBirth);
         }

         if (typeof valA === 'string') {
            return sortDirection === 'asc'
               ? valA.localeCompare(valB)
               : valB.localeCompare(valA);
         }
         return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
   }

   let filteredEmployees = [...employees];
   if (positionFilter !== 'all') {
      filteredEmployees = filteredEmployees.filter(e => e.position === positionFilter);
   }

   filteredEmployees.forEach(employee => {
      const estPayment = employee.assignments.length > 0
         ? employee.assignments.reduce((sum, a) => sum + getEmployeeCost(a, employee), 0)
         : employee.salary * 0.5;

      const projIncome = employee.assignments.reduce((sum, assignment) => {
         const project = data.projects.find(p => p.id === assignment.projectId);
         if (!project) return sum;

         const effectiveCap = getEffectiveCapacity(assignment, employee, year, month);
         const totalRevenue = getProjectRevenue(project, data.employees, year, month);
         const capacityForRevenue = Math.max(project.capacity,
            data.employees.reduce((s, e) => {
               const a = e.assignments.find(a => a.projectId === project.id);
               return a ? s + getEffectiveCapacity(a, e, year, month) : s;
            }, 0)
         );
         const revenuePerUnit = project.budget / capacityForRevenue;
         const revenue = revenuePerUnit * effectiveCap;
         const cost = getEmployeeCost(assignment, employee);
         return sum + revenue - cost;
      }, 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.surname}</td>
            <td>${calculateAge(employee.dateOfBirth)}</td>
            <td class="editable-position" data-id="${employee.id}">${employee.position}</td> 
            <td class="editable-salary" data-id="${employee.id}">${formatCurrency(employee.salary)}</td>
            <td>${formatCurrency(estPayment)}</td>
            <td>
   ${employee.assignments.length > 0
            ? `<button class="show-assignments-btn" data-employee-id="${employee.id}">Show Assignments (${employee.assignments.length})</button>`
            : '-'}
               </td>
            <td class="${projIncome >= 0 ? 'income-pos' : 'income-neg'}">${formatCurrency(projIncome)}</td>
            <td>
               <button class="assign-btn" data-id="${employee.id}">Assign</button>
               <button class="vacation-btn" data-id="${employee.id}">Vacation</button>
               <button class="delete-btn" data-id="${employee.id}">Delete</button>
            </td>
        `;
      tbody.appendChild(tr);

      const positionCell = tr.querySelector('.editable-position');
      positionCell.addEventListener('click', () => {
         const select = document.createElement('select');
         select.size = 6;
         ['Junior', 'Middle', 'Senior', 'Lead', 'Architect', 'BO'].forEach(pos => {
            const option = document.createElement('option');
            option.value = pos;
            option.textContent = pos;
            if (pos === employee.position) option.selected = true;
            select.appendChild(option);
         });

         positionCell.innerHTML = '';
         positionCell.appendChild(select);
         select.focus();

         select.addEventListener('change', () => {
            const { year, month } = getDataPeriod();
            const data = getData(year, month);
            const emp = data.employees.find(e => e.id === employee.id);
            emp.position = select.value;
            saveData(year, month, data);
            randerEmployeesTable();
         });
      });

      const salaryEmp = tr.querySelector('.editable-salary');
      salaryEmp.addEventListener('click', () => {
         const input = document.createElement('input');
         input.type = 'number';
         input.value = employee.salary;

         salaryEmp.innerHTML = '';
         salaryEmp.appendChild(input);
         input.focus();

         input.addEventListener('blur', () => {
            const { year, month } = getDataPeriod();
            const data = getData(year, month);
            const emp = data.employees.find(e => e.id === employee.id);
            emp.salary = Number(input.value);
            saveData(year, month, data);
            randerEmployeesTable();
         });

         input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') randerEmployeesTable();
         });
      });

      const deleteBtn = tr.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
         deleteEmployee(employee.id);
      });

      const assignBtn = tr.querySelector('.assign-btn');
      assignBtn.addEventListener('click', (e) => {
         openAssignPopup(employee.id, e.target);
      });

      const vacationBtn = tr.querySelector('.vacation-btn');
      if (vacationBtn) {
         vacationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openVacationPopup(employee.id);
         });
      }

      const showAssignmentsBtn = tr.querySelector('.show-assignments-btn');
      if (showAssignmentsBtn) {
         showAssignmentsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEmployeeAssignments(employee.id);
         });
      }
   });

   updateSortIcons();
}

function initEmployeeFilters() {
   const positionFilterSelect = document.getElementById('positionFilter');
   const clearBtn = document.getElementById('clearEmployeesFilters');

   if (!positionFilterSelect || !clearBtn) return;

   if (positionFilterSelect) {
      positionFilterSelect.addEventListener('change', (e) => {
         positionFilter = e.target.value;
         randerEmployeesTable();
      });
   }

   if (clearBtn) {
      clearBtn.addEventListener('click', () => {
         positionFilter = 'all';
         if (positionFilterSelect) positionFilterSelect.value = 'all';
         randerEmployeesTable();
      });
   }
}

function updateSortIcons() {
   document.querySelectorAll('#panel-employees th[data-sort]').forEach(th => {
      const icon = th.querySelector('.sort-icon');
      const field = th.dataset.sort;
      if (sortField === field) {
         icon.textContent = sortDirection === 'asc' ? '↑' : '↓';
      } else {
         icon.textContent = '⇅';
      }
   });
}

function initSortHandlers() {
   document.querySelectorAll('#panel-employees th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
         const field = th.dataset.sort;
         if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
         } else {
            sortField = field;
            sortDirection = 'asc';
         }
         randerEmployeesTable();
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
   const employee = data.employees.find(e => e.id === id);

   if (!confirm(`Delete employee "${employee.name}"?`)) return;

   data.employees = data.employees.filter(e => e.id !== id);
   saveData(year, month, data);
   randerEmployeesTable();
}

function validateEmployeeName(value) {
   const reg = /^[a-zA-Z ]+$/;
   return value.trim().length >= 3 && reg.test(value.trim());
}

function validateEmployeeSurname(value) {
   const reg = /^[a-zA-Z ]+$/;
   return value.trim().length >= 3 && reg.test(value.trim());
}

function validateEmployeeDob(value) {
   if (!value) {
      return false;
   }
   return isAdult(value);
}

function validateEmployeePosition(value) {
   return value !== "";
}

function validateEmployeeSalary(value) {
   const num = Number(value);
   return !isNaN(num) && num >= 1;
}

function isAdult(dateOfBirth) {
   const dob = new Date(dateOfBirth);
   const today = new Date();
   const age = today.getFullYear() - dob.getFullYear();
   const monthDiff = today.getMonth() - dob.getMonth();
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      return age - 1 >= 18;
   }
   return age >= 18;
}

function validateEmployeeForm() {
   let isValid = true;

   if (!validateEmployeeName(employeeName.value)) {
      employeeName.classList.add('input-error');
      employeeNameError.innerText = "Please use only English letters (min 3 chars)";
      isValid = false;
   } else {
      employeeName.classList.remove('input-error');
      employeeNameError.innerText = "";
   }

   if (!validateEmployeeSurname(employeeSurname.value)) {
      employeeSurname.classList.add('input-error');
      employeeSurnameError.innerText = "Please use only English letters (min 3 chars)";
      isValid = false;
   } else {
      employeeSurname.classList.remove('input-error');
      employeeSurnameError.innerText = "";
   }

   if (!validateEmployeeDob(employeeDob.value)) {
      employeeDob.classList.add('input-error');
      employeeDobError.innerText = "Must be 18+ years old";
      isValid = false;
   } else {
      employeeDob.classList.remove('input-error');
      employeeDobError.innerText = "";
   }

   if (!validateEmployeePosition(employeePosition.value)) {
      employeePosition.classList.add('input-error');
      employeePositionError.innerText = "Please select a position";
      isValid = false;
   } else {
      employeePosition.classList.remove('input-error');
      employeePositionError.innerText = "";
   }

   if (!validateEmployeeSalary(employeeSalary.value)) {
      employeeSalary.classList.add('input-error');
      employeeSalaryError.innerText = "Please enter positive number";
      isValid = false;
   } else {
      employeeSalary.classList.remove('input-error');
      employeeSalaryError.innerText = "";
   }

   const submitBtn = document.getElementById('submitEmployee');
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
      name: document.getElementById('employeeName').value.trim(),
      surname: document.getElementById('employeeSurname').value.trim(),
      dateOfBirth: document.getElementById('employeeDob').value,
      position: document.getElementById('employeePosition').value,
      salary: Number(document.getElementById('employeeSalary').value),
      assignments: [],
      vacationDays: [],
   };
   return employee;
}

const panelOverlay = document.getElementById('panelOverlay');
const addEmployeePanel = document.getElementById('addEmployeePanel');

function saveEmployee() {
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



function showEmployeeAssignments(employeeId) {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const employee = data.employees.find(e => e.id === employeeId);
   if (!employee) return;

   const popupBody = document.getElementById('assignmentsPopupBody');
   const popup = document.getElementById('assignmentsPopup');
   const overlay = document.getElementById('assignmentsPopupOverlay');

   if (employee.assignments.length === 0) {
      popupBody.innerHTML = '<div class="loading">No assignments for this employee</div>';
   } else {
      popupBody.innerHTML = employee.assignments.map(assignment => {
         const project = data.projects.find(p => p.id === assignment.projectId);
         const projectName = project ? project.name : 'Unknown Project';
         const companyName = project ? project.company : 'Unknown';

         return `
            <div class="assignment-list-item">
                <div class="assignment-info">
                    <div class="assignment-project">${projectName}</div>
                    <div class="assignment-details">
                        ${companyName} | Capacity: ${assignment.capacity} | Fit: ${assignment.fit}
                    </div>
                </div>
                <button class="unassign-btn" data-project-id="${assignment.projectId}" data-employee-id="${employee.id}">Unassign</button>
            </div>
         `;
      }).join('');
   }

   popup.classList.add('active');
   overlay.classList.add('active');

   document.querySelectorAll('#assignmentsPopup .unassign-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
         e.stopPropagation();
         const projectId = Number(btn.dataset.projectId);
         const empId = Number(btn.dataset.employeeId);
         unassignEmployee(empId, projectId);
      });
   });
}

function closeAssignmentsPopup() {
   const popup = document.getElementById('assignmentsPopup');
   const overlay = document.getElementById('assignmentsPopupOverlay');
   if (popup) popup.classList.remove('active');
   if (overlay) overlay.classList.remove('active');
}

function unassignEmployee(employeeId, projectId) {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);
   const employee = data.employees.find(e => e.id === employeeId);

   if (!employee) return;

   const assignmentIndex = employee.assignments.findIndex(a => a.projectId === projectId);
   if (assignmentIndex !== -1) {
      employee.assignments.splice(assignmentIndex, 1);
      saveData(year, month, data);
      randerEmployeesTable();
      document.dispatchEvent(new CustomEvent('dataUpdated'));
      closeAssignmentsPopup();
   }
}

function initAssignmentsPopupHandlers() {
   const overlay = document.getElementById('assignmentsPopupOverlay');
   const closeBtn = document.querySelector('#assignmentsPopup .popup-close');

   if (overlay) {
      overlay.addEventListener('click', closeAssignmentsPopup);
   }
   if (closeBtn) {
      closeBtn.addEventListener('click', closeAssignmentsPopup);
   }
}


let currentVacationEmployee = null;
let currentVacationDays = [];

function openVacationPopup(employeeId) {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);
   const employee = data.employees.find(e => e.id === employeeId);

   if (!employee) return;

   currentVacationEmployee = employee;
   currentVacationDays = [...(employee.vacationDays || [])];

   document.getElementById('vacationEmployeeName').textContent =
      `${employee.name} ${employee.surname} - Vacation Days`;

   const popup = document.getElementById('vacationPopup');
   const overlay = document.getElementById('vacationPopupOverlay');

   renderCalendar();

   popup.classList.add('active');
   overlay.classList.add('active');
}

function renderCalendar() {
   const month = parseInt(document.getElementById('vacationMonthSelect').value);
   const year = parseInt(document.getElementById('vacationYearSelect').value);

   const firstDay = new Date(year, month, 1);
   const startDayOfWeek = firstDay.getDay();
   const daysInMonth = new Date(year, month + 1, 0).getDate();

   const calendarGrid = document.getElementById('calendarGrid');
   calendarGrid.innerHTML = '';

   const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
   weekdays.forEach(day => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-weekday';
      dayDiv.textContent = day;
      calendarGrid.appendChild(dayDiv);
   });

   for (let i = 0; i < startDayOfWeek; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDiv);
   }

   for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isVacation = currentVacationDays.includes(day);

      const dayDiv = document.createElement('div');
      dayDiv.className = `calendar-day ${isWeekend ? 'weekend' : ''} ${isVacation ? 'vacation' : ''}`;
      dayDiv.textContent = day;

      if (!isWeekend) {
         dayDiv.addEventListener('click', () => {
            dayDiv.classList.toggle('vacation');
            const dayNum = parseInt(dayDiv.textContent);
            const index = currentVacationDays.indexOf(dayNum);
            if (index === -1) {
               currentVacationDays.push(dayNum);
            } else {
               currentVacationDays.splice(index, 1);
            }
         });
      }

      calendarGrid.appendChild(dayDiv);
   }
}

function saveVacationDays() {
   if (!currentVacationEmployee) return;

   const { year, month } = getDataPeriod();
   const data = getData(year, month);
   const employee = data.employees.find(e => e.id === currentVacationEmployee.id);

   if (employee) {
      employee.vacationDays = [...currentVacationDays];
      saveData(year, month, data);

      randerEmployeesTable();

      if (typeof renderProjectsTable !== 'undefined') {
         renderProjectsTable();
      } else {
         document.dispatchEvent(new CustomEvent('dataUpdated'));
      }
   }

   closeVacationPopup();
}

function closeVacationPopup() {
   const popup = document.getElementById('vacationPopup');
   const overlay = document.getElementById('vacationPopupOverlay');
   if (popup) popup.classList.remove('active');
   if (overlay) overlay.classList.remove('active');
   currentVacationEmployee = null;
   currentVacationDays = [];
}

function initVacationPopupHandlers() {
   const overlay = document.getElementById('vacationPopupOverlay');
   const closeBtn = document.querySelector('#vacationPopup .popup-close');
   const saveBtn = document.getElementById('saveVacationBtn');
   const monthSelect = document.getElementById('vacationMonthSelect');
   const yearSelect = document.getElementById('vacationYearSelect');

   if (overlay) overlay.addEventListener('click', closeVacationPopup);
   if (closeBtn) closeBtn.addEventListener('click', closeVacationPopup);
   if (saveBtn) saveBtn.addEventListener('click', saveVacationDays);

   if (monthSelect) {
      monthSelect.addEventListener('change', () => {
         if (currentVacationEmployee) renderCalendar();
      });
   }

   if (yearSelect) {
      yearSelect.addEventListener('change', () => {
         if (currentVacationEmployee) renderCalendar();
      });
   }
}


initAssignmentsPopupHandlers();
initEmployeeFilters();
initSortHandlers();

initVacationPopupHandlers();
randerEmployeesTable();

export { randerEmployeesTable };