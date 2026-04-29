const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.tab-panel');
const mainTitle = document.querySelector('.main-title');

const addBtn = document.querySelector('.add-btn');
const panelOverlay = document.getElementById('panelOverlay');
const addProjectPanel = document.getElementById('addProjectPanel');
const panelClose = document.querySelector('.panel-close');
let currentTab = 'projects';


// tabs
function switchTab(targetId) {
   tabs.forEach(btn => btn.classList.remove('active'));
   document.querySelector(`.tab[data-tab="${targetId}"]`).classList.add('active');

   navItems.forEach(btn => btn.classList.remove('active'));
   document.querySelector(`.nav-item[data-tab="${targetId}"]`).classList.add('active');

   mainTitle.textContent = targetId.charAt(0).toUpperCase() + targetId.slice(1);
   addBtn.textContent = targetId === 'projects' ? '+ Add Project' : '+ Add Employee';

   panels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === 'panel-' + targetId) {
         panel.classList.add('active');
      }
   });
   currentTab = targetId;
}

tabs.forEach(button => {
   button.addEventListener('click', () => {
      switchTab(button.getAttribute('data-tab'));
   });
});

navItems.forEach(button => {
   button.addEventListener('click', () => {
      switchTab(button.getAttribute('data-tab'));
   });
});

// colapse sidebar

const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');

toggleBtn.addEventListener('click', () => {
   sidebar.classList.toggle('collapsed');
   toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '→' : '☰';
});

//slide in

const addEmployeePanel = document.getElementById('addEmployeePanel');

addBtn.addEventListener('click', () => {
   panelOverlay.classList.add('active');
   if (currentTab === 'projects') {
      addProjectPanel.classList.add('active');
   } else {
      addEmployeePanel.classList.add('active');
   }
});

panelOverlay.addEventListener('click', () => {
  panelOverlay.classList.remove('active');
  addProjectPanel.classList.remove('active');
  addEmployeePanel.classList.remove('active');
});

panelClose.addEventListener('click', () => {
   panelOverlay.classList.remove('active');
   addProjectPanel.classList.remove('active');
   addEmployeePanel.classList.remove('active');
});