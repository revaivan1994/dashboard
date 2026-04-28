const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.tab-panel');

// tabs
function switchTab(targetId) {
   tabs.forEach(btn => btn.classList.remove('active'));
   document.querySelector(`.tab[data-tab="${targetId}"]`).classList.add('active');

   navItems.forEach(btn => btn.classList.remove('active'));
   document.querySelector(`.nav-item[data-tab="${targetId}"]`).classList.add('active');

   panels.forEach(panel => {
    panel.classList.remove('active');
    if (panel.id === 'panel-' + targetId) {
      panel.classList.add('active');
    }
  });
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