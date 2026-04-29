function getData(year, month) {
   const rawData = localStorage.getItem('monthlyData');
   const allData = JSON.parse(rawData) || {};
   const key = `${year}-${month}`;
   const monthData = allData[key];
   if(monthData) {
      return monthData;
   } else {
      return { employees: [], projects: []};
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

export { getData, saveData, initData, getDataPeriod };