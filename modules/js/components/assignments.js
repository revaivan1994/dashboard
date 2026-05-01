import { getData, getDataPeriod, saveData } from './data.js';
import { getEffectiveCapacity } from './calculations.js';

let currentEmployeeId = null;

function openAssignPopup(employeeId, buttonEl) {
   currentEmployeeId = employeeId;
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const select = document.getElementById('assignProject');
   select.innerHTML = '';
   data.projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      select.appendChild(option);
   });

   const popup = document.getElementById('assignPopup');
   const rect = buttonEl.getBoundingClientRect();
   popup.style.top = rect.bottom + 8 + 'px';
   popup.style.left = rect.left + 'px';
   popup.classList.add('active');

   const popupRect = popup.getBoundingClientRect();
   if (popupRect.right > window.innerWidth) {
      popup.style.left = (rect.right - 300) + 'px';
   }
}

document.getElementById('capacitySlider').addEventListener('input', (e) => {
   document.getElementById('capacityValue').textContent = e.target.value;
});

document.getElementById('fitSlider').addEventListener('input', (e) => {
   document.getElementById('fitValue').textContent = e.target.value;
});

document.getElementById('assignCancel').addEventListener('click', () => {
   document.getElementById('assignPopup').classList.remove('active');
});

document.getElementById('assignConfirm').addEventListener('click', () => {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const projectId = Number(document.getElementById('assignProject').value);
   const capacity = Number(document.getElementById('capacitySlider').value);
   const fit = Number(document.getElementById('fitSlider').value);

   const employee = data.employees.find(e => e.id === currentEmployeeId);

   employee.assignments.push({
      projectId,
      capacity,
      fit
   });

   saveData(year, month, data);
   document.dispatchEvent(new CustomEvent('dataUpdated'));
   document.getElementById('assignPopup').classList.remove('active');
});

document.getElementById('assignConfirm').addEventListener('click', () => {
   const { year, month } = getDataPeriod();
   const data = getData(year, month);

   const projectId = Number(document.getElementById('assignProject').value);
   const capacity = Number(document.getElementById('capacitySlider').value);
   const fit = Number(document.getElementById('fitSlider').value);

   const employee = data.employees.find(e => e.id === currentEmployeeId);

   employee.assignments.push({ projectId, capacity, fit });
   saveData(year, month, data);
   document.getElementById('assignPopup').classList.remove('active');

   employee.assignments.push({
      projectId,
      capacity,
      fit
   });

   saveData(year, month, data);
   document.getElementById('assignPopup').classList.remove('active');
});

export { openAssignPopup };