import './components/data.js';
import './components/calculations.js';
import './components/projects.js';
import './components/employees.js';
import './components/assignments.js';
import './components/ui.js';

import { initData } from './components/data.js';
import { renderProjectsTable, updateCompanyFilterOptions  } from './components/projects.js';
import { randerEmployeesTable } from './components/employees.js';


initData();
renderProjectsTable();
randerEmployeesTable();


document.addEventListener('dataUpdated', () => {
    renderProjectsTable();
    randerEmployeesTable();
    if (typeof updateCompanyFilterOptions === 'function') {
        updateCompanyFilterOptions();
    }
});

const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');

if (monthSelect) {
    monthSelect.addEventListener('change', () => {
        renderProjectsTable();
        randerEmployeesTable();
    });
}

if (yearSelect) {
    yearSelect.addEventListener('change', () => {
        renderProjectsTable();
        randerEmployeesTable();
    });
}

const seedBtn = document.querySelector('.seed-btn');
if (seedBtn) {
    seedBtn.addEventListener('click', () => {
        import('./components/data.js').then(module => {
            module.seedData();
            renderProjectsTable();
            randerEmployeesTable();
            updateCompanyFilterOptions();
        });
    });
}