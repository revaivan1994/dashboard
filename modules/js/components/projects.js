import { getData, getDataPeriod, saveData } from "./data.js";
import { formatCurrency } from "./calculations.js";

function renderProjectsTable() {
    const { year, month } = getDataPeriod();
    const data = getData(year, month);

    const tbody = document.getElementById("projectsBody");
    tbody.innerHTML = '';

    data.projects.forEach(project => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.company}</td>
            <td>${project.name}</td>
            <td>${formatCurrency(project.budget)}</td>
            <td>${project.capacity}</td>
            <td>-</td>
            <td>-</td>
            <td><button class="delete-btn" data-id="${project.id}">Delete</button></td>
        `;
        tbody.appendChild(tr);

        const deleteBtn = tr.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteProject(project.id);
        });
    });
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
    if (!validateName(projectName.value)) {
        projectName.classList.add('input-error');
        projectNameError.innerText = "Please use only English letters (2-30 chars)";
    } else {
        projectName.classList.remove('input-error');
        projectNameError.innerText = "";
    }

    if (!validateCompanyName(companyName.value)) {
        companyName.classList.add('input-error');
        companyNameError.innerText = "Please minimum 2 characters, letters and numbers only";
    } else {
        companyName.classList.remove('input-error');
        companyNameError.innerText = "";
    }

    if (!validateBudget(projectBudget.value)) {
        projectBudget.classList.add('input-error');
        projectBudgetError.innerText = "Please use only positive number";
    } else {
        projectBudget.classList.remove('input-error');
        projectBudgetError.innerText = "";
    }

    if (!validateCapacity(projectCapacity.value)) {
        projectCapacity.classList.add('input-error');
        projectCapacityError.innerText = "Please use only integer number, minimum 1";
    } else {
        projectCapacity.classList.remove('input-error');
        projectCapacityError.innerText = "";
    }

    const submitBtn = document.getElementById('submitProject');
    const isValid = validateName(projectName.value) &&
        validateCompanyName(companyName.value) &&
        validateBudget(projectBudget.value) &&
        validateCapacity(projectCapacity.value);

    submitBtn.disabled = !isValid;
}

projectName.addEventListener('input', validateProjectForm);
companyName.addEventListener('input', validateProjectForm);
projectBudget.addEventListener('input', validateProjectForm);
projectCapacity.addEventListener('input', validateProjectForm);

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

    projectName.value = '';
    companyName.value = '';
    projectBudget.value = '';
    projectCapacity.value = '';
    validateProjectForm();

    renderProjectsTable();

    panelOverlay.classList.remove('active');
    addProjectPanel.classList.remove('active');
}

document.getElementById('submitProject').addEventListener('click', saveProject);

function deleteProject(id) {
    const { year, month } = getDataPeriod();
    const data = getData(year, month);
    const project = data.projects.find(p => p.id === id);
    
    if(!confirm(`Delete project "${project.name}"?`)) return;
    
    data.projects = data.projects.filter(p => p.id !== id);
    saveData(year, month, data);
    renderProjectsTable();
}



export { renderProjectsTable };