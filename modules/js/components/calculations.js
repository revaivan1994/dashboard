function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthData = new Date(dateOfBirth);
    const age = Math.floor((today - birthData) / (1000 * 60 * 60 * 24 * 365.25));
    return age;
}


function formatCurrency(amount) {
    return amount.toLocaleString('En', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    })
}

function getWorkingDays(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workingDays++;
        }
    }
    return workingDays;
}

function getVacationCoefficient(employee, year, month) {
    const workingDays = getWorkingDays(year, month);
    if (workingDays === 0) return 0;
    let vacationWorkingDays = 0;
    if (employee.vacationDays && Array.isArray(employee.vacationDays)) {
        employee.vacationDays.forEach(dayNumber => {
            const date = new Date(year, month, dayNumber);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                vacationWorkingDays++;
            }
        });
    }
    const vacationCoefficient = (workingDays - vacationWorkingDays) / workingDays;
    return vacationCoefficient;
}

function getEffectiveCapacity(assignment, employee, year, month) {
    const vacCoef = getVacationCoefficient(employee, year, month);
    return assignment.capacity * assignment.fit * vacCoef;
}


function getProjectRevenue(project, employees, year, month) {
    let usedEffectiveCapacity = 0;
    employees.forEach(employee => {
        const assignment = employee.assignments.find(a => a.projectId === project.id);
        if (assignment) {
            usedEffectiveCapacity += getEffectiveCapacity(assignment, employee, year, month);
        }
    });
    const capacityForRevenue = Math.max(project.capacity, usedEffectiveCapacity);
    if (capacityForRevenue === 0) return 0;
    const revenuePerUnit = project.budget / capacityForRevenue;
    return revenuePerUnit * usedEffectiveCapacity;
}

function getEmployeeCost(assignment, employee) {
    return employee.salary * Math.max(0.5, assignment.capacity);
}

function getTotalEstimatedIncome(projects, employees, year, month) {
    let total = 0;
    projects.forEach(project => {
        total += getProjectRevenue(project, employees, year, month);
        employees.forEach(employee => {
            const assignment = employee.assignments.find(a => a.projectId === project.id);
            if (assignment) {
                total -= getEmployeeCost(assignment, employee);
            }
        });
    });

    employees.forEach(employee => {
        const isUnassigned = employee.assignments.length === 0;
        if (isUnassigned) {
            total -= employee.salary * 0.5;
        }
    });

    return total;
}

export {
    formatCurrency,
    calculateAge,
    getWorkingDays,
    getVacationCoefficient,
    getEffectiveCapacity,
    getProjectRevenue,
    getEmployeeCost,
    getTotalEstimatedIncome,
};