import { getData, getDataPeriod, saveData } from "./data.js";
import { formatCurrency, getTotalEstimatedIncome, getProjectRevenue, getEmployeeCost } from "./calculations.js";

let sortField = null;
let sortDirection = 'asc';
let companyFilter = 'all';

function showProjectEmployees(projectId) {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const project = data.projects.find(p => p.id === projectId);
   if (!project) return;

   const assignedEmployees = data.employees.filter(employee =>
      employee.assignments.some(a => a.projectId === projectId)
   );

   const popupBody = document.getElementById('employeesPopupBody');
   const popup = document.getElementById('employeesPopup');
   const overlay = document.getElementById('employeesPopupOverlay');

   if (assignedEmployees.length === 0) {
      popupBody.innerHTML = '<div class="loading">No employees assigned to this project</div>';
   } else {
      popupBody.innerHTML = assignedEmployees.map(employee => {
         const assignment = employee.assignments.find(a => a.projectId === projectId);
         return `
            <div class="employee-list-item">
                <div class="employee-info">
                    <div class="employee-name">${employee.name} ${employee.surname}</div>
                    <div class="employee-details">
                        ${employee.position} | Capacity: ${assignment?.capacity || 0} | Fit: ${assignment?.fit || 0}
                    </div>
                </div>
            </div>
         `;
      }).join('');
   }

   popup.classList.add('active');
   overlay.classList.add('active');
}

function closeEmployeesPopup() {
   const popup = document.getElementById('employeesPopup');
   const overlay = document.getElementById('employeesPopupOverlay');
   if (popup) popup.classList.remove('active');
   if (overlay) overlay.classList.remove('active');
}

function initPopupHandlers() {
   const overlay = document.getElementById('employeesPopupOverlay');
   const closeBtn = document.querySelector('#employeesPopup .popup-close');

   if (overlay) {
      overlay.addEventListener('click', closeEmployeesPopup);
   }
   if (closeBtn) {
      closeBtn.addEventListener('click', closeEmployeesPopup);
   }
}

function renderProjectsTable() {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const tbody = document.getElementById("projectsBody");
   if (!tbody) return;
   tbody.innerHTML = '';

   let projects = [...data.projects];
   if (sortField) {
      projects.sort((a, b) => {
         let valA = a[sortField];
         let valB = b[sortField];
         if (typeof valA === 'string') {
            return sortDirection === 'asc'
               ? valA.localeCompare(valB)
               : valB.localeCompare(valA);
         }
         return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
   }

   let filteredProjects = [...projects];
   if (companyFilter !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.company === companyFilter);
   }

   filteredProjects.forEach(project => {
      const projectIncome = getProjectRevenue(project, data.employees, year, month) -
         data.employees.reduce((sum, employee) => {
            const assignment = employee.assignments.find(a => a.projectId === project.id);
            return assignment ? sum + getEmployeeCost(assignment, employee) : sum;
         }, 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
         <td>${project.company}</td>
         <td>${project.name}</td>
         <td>${formatCurrency(project.budget)}</td>
         <td>${project.capacity}</td>
         <td><button class="show-employees-btn" data-project-id="${project.id}">Show Employees</button></td>
         <td class="${projectIncome >= 0 ? 'income-pos' : 'income-neg'}">${formatCurrency(projectIncome)}</td>
         <td><button class="delete-btn" data-id="${project.id}">Delete</button></td>
      `;
      tbody.appendChild(tr);

      const showEmployeesBtn = tr.querySelector('.show-employees-btn');
      if (showEmployeesBtn) {
         showEmployeesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showProjectEmployees(project.id);
         });
      }

      const deleteBtn = tr.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
         deleteProject(project.id);
      });
   });

   const totalIncome = getTotalEstimatedIncome(data.projects, data.employees, year, month);
   const totalEl = document.getElementById('totalIncome');
   if (totalEl) {
      totalEl.textContent = formatCurrency(totalIncome);
      totalEl.className = totalIncome >= 0 ? 'income-pos' : 'income-neg';
   }

   updateSortIcons();
}


function updateCompanyFilterOptions() {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);
   const companies = [...new Set(data.projects.map(p => p.company))];

   const select = document.getElementById('companyFilter');
   if (!select) return;

   const currentValue = select.value;
   select.innerHTML = '<option value="all">All Companies</option>';
   companies.forEach(company => {
      const option = document.createElement('option');
      option.value = company;
      option.textContent = company;
      select.appendChild(option);
   });
   select.value = currentValue;
}

function updateSortIcons() {
   document.querySelectorAll('#panel-projects th[data-sort]').forEach(th => {
      const icon = th.querySelector('.sort-icon');
      const field = th.dataset.sort;
      if (icon) {
         if (sortField === field) {
            icon.textContent = sortDirection === 'asc' ? '↑' : '↓';
         } else {
            icon.textContent = '⇅';
         }
      }
   });
}

function initSortHandlers() {
   document.querySelectorAll('#panel-projects th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
         const field = th.dataset.sort;
         if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
         } else {
            sortField = field;
            sortDirection = 'asc';
         }
         renderProjectsTable();
      });
   });
}

function initFilters() {
   const companyFilterSelect = document.getElementById('companyFilter');
   const clearBtn = document.getElementById('clearProjectsFilters');

   if (companyFilterSelect) {
      companyFilterSelect.addEventListener('change', (e) => {
         companyFilter = e.target.value;
         renderProjectsTable();
      });
   }

   if (clearBtn) {
      clearBtn.addEventListener('click', () => {
         companyFilter = 'all';
         if (companyFilterSelect) companyFilterSelect.value = 'all';
         renderProjectsTable();
      });
   }
}

const projectName = document.getElementById("projectName");
const projectNameError = document.getElementById("projectNameError");
const companyName = document.getElementById("companyName");
const projectBudget = document.getElementById("projectBudget");
const projectCapacity = document.getElementById("projectCapacity");
const companyNameError = document.getElementById("companyNameError");
const projectBudgetError = document.getElementById("projectBudgetError");
const projectCapacityError = document.getElementById("projectCapacityError");

function validateName(value) {
   const reg = /^[a-zA-Z0-9 ]+$/;
   return value.trim().length >= 3 && reg.test(value.trim());
}

function validateCompanyName(value) {
   const reg = /^[a-zA-Z0-9 ]+$/;
   return value.trim().length >= 2 && reg.test(value.trim());
}

function validateBudget(value) {
   return /^\d+$/.test(value) && Number(value) > 0;
}

function validateCapacity(value) {
   const num = Number(value);
   return Number.isInteger(num) && num >= 1;
}

function validateProjectForm() {
   let isValid = true;

   if (!validateName(projectName.value)) {
      projectName.classList.add('input-error');
      projectNameError.innerText = "Please use only English letters (3-30 chars)";
      isValid = false;
   } else {
      projectName.classList.remove('input-error');
      projectNameError.innerText = "";
   }

   if (!validateCompanyName(companyName.value)) {
      companyName.classList.add('input-error');
      companyNameError.innerText = "Please minimum 2 characters, letters and numbers only";
      isValid = false;
   } else {
      companyName.classList.remove('input-error');
      companyNameError.innerText = "";
   }

   if (!validateBudget(projectBudget.value)) {
      projectBudget.classList.add('input-error');
      projectBudgetError.innerText = "Please use only positive number";
      isValid = false;
   } else {
      projectBudget.classList.remove('input-error');
      projectBudgetError.innerText = "";
   }

   if (!validateCapacity(projectCapacity.value)) {
      projectCapacity.classList.add('input-error');
      projectCapacityError.innerText = "Please use only integer number, minimum 1";
      isValid = false;
   } else {
      projectCapacity.classList.remove('input-error');
      projectCapacityError.innerText = "";
   }

   const submitBtn = document.getElementById('submitProject');
   if (submitBtn) submitBtn.disabled = !isValid;
}

if (projectName) projectName.addEventListener('input', validateProjectForm);
if (companyName) companyName.addEventListener('input', validateProjectForm);
if (projectBudget) projectBudget.addEventListener('input', validateProjectForm);
if (projectCapacity) projectCapacity.addEventListener('input', validateProjectForm);

function addProject() {
   const project = {
      id: Date.now(),
      name: document.getElementById('projectName').value,
      company: document.getElementById('companyName').value,
      budget: Number(document.getElementById('projectBudget').value),
      capacity: Number(document.getElementById('projectCapacity').value),
   }
   return project;
}

const panelOverlay = document.getElementById('panelOverlay');
const addProjectPanel = document.getElementById('addProjectPanel');

function saveProject() {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);
   const newProject = addProject();

   data.projects.push(newProject);
   saveData(year, month, data);

   if (projectName) projectName.value = '';
   if (companyName) companyName.value = '';
   if (projectBudget) projectBudget.value = '';
   if (projectCapacity) projectCapacity.value = '';
   validateProjectForm();

   renderProjectsTable();

   if (panelOverlay) panelOverlay.classList.remove('active');
   if (addProjectPanel) addProjectPanel.classList.remove('active');
}

const submitProjectBtn = document.getElementById('submitProject');
if (submitProjectBtn) submitProjectBtn.addEventListener('click', saveProject);

function deleteProject(id) {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);
   const project = data.projects.find(p => p.id === id);

   if (!confirm(`Delete project "${project.name}"?`)) return;

   data.projects = data.projects.filter(p => p.id !== id);
   saveData(year, month, data);
   renderProjectsTable();
}

initSortHandlers();
initPopupHandlers();
initFilters();       
updateCompanyFilterOptions();
renderProjectsTable();

export { renderProjectsTable, updateCompanyFilterOptions };