function getData(year, month) {
  const rawData = localStorage.getItem('monthlyData');
  const allData = JSON.parse(rawData) || {};
  const key = `${year}-${month}`;
  const monthData = allData[key];
  if (monthData) {
    return monthData;
  } else {
    return { employees: [], projects: [] };
  }
}

function saveData(year, month, newData) {
  const allData = JSON.parse(localStorage.getItem('monthlyData')) || {};
  const key = `${year}-${month}`;
  allData[key] = newData;
  localStorage.setItem('monthlyData', JSON.stringify(allData));
}

function initData() {
  const key = 'monthlyData';
  const existingData = localStorage.getItem(key);

  if (!existingData) {
    const initialData = {
      "2026-0": {
        employees: [
          {
            id: 1,
            name: "Иван",
            surname: "Иванов",
            dateOfBirth: "1990-05-15",
            position: "Junior",
            salary: 3000,
            assignments: [],
            vacationDays: [5, 6, 7]
          },
          {
            id: 2,
            name: "Tony",
            surname: "Bony",
            dateOfBirth: "1996-06-21",
            position: "Middle",
            salary: 5000,
            assignments: [],
            vacationDays: [10, 11, 12],
          },
          {
            id: 3,
            name: "Ann",
            surname: "Fox",
            dateOfBirth: "2003-05-30",
            position: "Senior",
            salary: 6000,
            assignments: [],
            vacationDays: [15, 16, 17]
          },
        ],
        projects: [
          {
            id: 101,
            name: "Alpha Portal",
            company: "TechCorp",
            budget: 50000,
            capacity: 3
          },
          {
            id: 102,
            name: "Shop Animal",
            company: "AniTex",
            budget: 60000,
            capacity: 15
          },
          {
            id: 103,
            name: "Dors Need",
            company: "MetalGroup",
            budget: 100000,
            capacity: 25
          },
        ]
      }
    };

    localStorage.setItem(key, JSON.stringify(initialData));
    console.log('Начальные данные для 2026-0 успешно загружены.');
  }
};

function getDataPeriod() {
  const year = document.getElementById("yearSelect").value;
  const month = document.getElementById("monthSelect").value;
  return { year, month };
}

function seedData() {
  const demoData = {
    "2025-0": generateMonthData(2025, 0),
    "2025-1": generateMonthData(2025, 1),
    "2025-2": generateMonthData(2025, 2),
    "2026-0": generateMonthData(2026, 0),
    "2026-1": generateMonthData(2026, 1),
    "2026-2": generateMonthData(2026, 2),
    "2027-0": generateMonthData(2027, 0),
    "2027-1": generateMonthData(2027, 1),
    "2027-2": generateMonthData(2027, 2)
  };

  localStorage.setItem('monthlyData', JSON.stringify(demoData));

  document.dispatchEvent(new CustomEvent('dataUpdated'));
}

function generateMonthData(year, month) {
  return {
    employees: [
      {
        id: 1001,
        name: "John",
        surname: "Smith",
        dateOfBirth: "1990-05-15",
        position: "Senior",
        salary: 5000,
        vacationDays: [5, 6, 7],
        assignments: [
          { projectId: 201, capacity: 1.0, fit: 1.0 }
        ]
      },
      {
        id: 1002,
        name: "Emma",
        surname: "Johnson",
        dateOfBirth: "1992-08-22",
        position: "Middle",
        salary: 3500,
        vacationDays: [10, 11],
        assignments: [
          { projectId: 202, capacity: 0.8, fit: 1.0 }
        ]
      },
      {
        id: 1003,
        name: "Michael",
        surname: "Brown",
        dateOfBirth: "1988-03-10",
        position: "Lead",
        salary: 7000,
        vacationDays: [15, 16, 17, 18],
        assignments: [
          { projectId: 201, capacity: 0.5, fit: 1.0 },
          { projectId: 203, capacity: 0.5, fit: 0.9 }
        ]
      },
      {
        id: 1004,
        name: "Sarah",
        surname: "Davis",
        dateOfBirth: "1995-11-30",
        position: "Junior",
        salary: 2500,
        vacationDays: [],
        assignments: []
      }
    ],
    projects: [
      {
        id: 201,
        name: "E-Commerce Platform",
        company: "TechCorp",
        budget: 150000,
        capacity: 5
      },
      {
        id: 202,
        name: "Mobile App",
        company: "AppStudio",
        budget: 80000,
        capacity: 3
      },
      {
        id: 203,
        name: "Cloud Migration",
        company: "CloudTech",
        budget: 200000,
        capacity: 4
      }
    ]
  };
}

export { getData, saveData, initData, getDataPeriod, seedData };

