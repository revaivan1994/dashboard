import './components/data.js';
import './components/calculations.js';
import './components/projects.js';
import './components/employees.js';
import './components/assignments.js';
import './components/calendar.js';
import './components/ui.js';

import { initData } from './components/data.js';
import { renderProjectsTable } from './components/projects.js';
import { randerEmployeesTable } from './components/employees.js';

document.getElementById('monthSelect').addEventListener('change', () => {
  renderProjectsTable();
  randerEmployeesTable();
});

document.getElementById('yearSelect').addEventListener('change', () => {
  renderProjectsTable();
  randerEmployeesTable();
});

initData();
renderProjectsTable();
randerEmployeesTable();