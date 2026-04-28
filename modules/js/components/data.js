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