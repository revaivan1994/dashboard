# 📋 План разработки: Employee & Project Dashboard

**Итого:** 7 этапов · 200 баллов · ~5–8 часов

---

## Этап 1 — Структура проекта + HTML скелет + CSS база (~30 мин)

- **1.1** Создать файлы: `index.html`, `style.css`, `app.js` (или модули)
- **1.2** Сделать базовую разметку: сайдбар, основная область, две вкладки (Projects / Employees)
- **1.3** CSS переменные, шрифты, reset, базовые стили таблиц и кнопок
- **1.4** Сайдбар: выпадающие списки месяца/года, кнопка-гамбургер для скрытия/показа, кнопка Seed Data

> 💡 Сделай коллапс сайдбара через CSS-класс — это легко. Позже не придётся переделывать.

---

## Этап 2 — LocalStorage: архитектура данных + инициализация (~40 мин · 25 баллов)

- **2.1** Определить структуру данных: `{ monthlyData: { "2026-0": { employees: [], projects: [] } } }`
- **2.2** Написать функции `getData(year, month)`, `saveData(year, month, data)`
- **2.3** Создать seed-данные: 3–4 сотрудника, 2–3 проекта для января 2026
- **2.4** При инициализации: если нет данных — записать seed. Иначе — загрузить существующие
- **2.5** Переключение месяца/года — перезагружать данные, обновлять таблицы
- **2.6** Seed Data: попап со списком месяцев, кнопка "Seed" — копировать данные, очищать отпуска

> 💡 Сделай глобальные переменные `currentYear`, `currentMonth`. Все операции читают из них — проще отлаживать.

---

## Этап 3 — CRUD сотрудников + CRUD проектов (~60 мин · 25 баллов)

- **3.1** Форма добавления сотрудника (slide-in панель): Name, Surname, DOB, Position, Salary + валидация
- **3.2** Валидация: имя/фамилия ≥3 буквы, возраст 18+, salary > 0, position обязателен
- **3.3** Кнопка Delete сотрудника: диалог подтверждения → удалить из данных + снять с проектов
- **3.4** Inline-редактирование: клик на Position → dropdown; клик на Salary → input (сохранить blur/Enter, отмена Escape)
- **3.5** Форма добавления проекта: Name, Company, Budget, Capacity + валидация
- **3.6** Кнопка Delete проекта: диалог → удалить проект + снять всех сотрудников

> 💡 Сначала напиши функции `saveEmployee` / `deleteEmployee` / `saveProject` / `deleteProject` без UI — потом подключи к кнопкам.

---

## Этап 4 — Финансовые расчёты — ядро логики (~60 мин · 30 баллов)

- **4.1** Написать `getWorkingDays(year, month)` — считаем будни без выходных
- **4.2** Написать `getVacationCoefficient(employee, year, month)` — учёт отпускных дней
- **4.3** Написать `getEffectiveCapacity(assignment, employee, year, month)` = `capacity × fit × vacCoef`
- **4.4** Написать `getProjectRevenue(project, employees)` — по формуле с `max(capacity, usedEffective)`
- **4.5** Написать `getEmployeeCost(assignment)` = `salary × max(0.5, capacity)`
- **4.6** Написать `getTotalEstimatedIncome(projects, employees)` — сумма прибылей минус bench costs

### Формулы для справки

```
vacationCoefficient = (workingDays - vacationWorkingDays) / workingDays
effectiveCapacity   = assignedCapacity × fit × vacationCoefficient

usedEffectiveCapacity  = сумма effectiveCapacity всех сотрудников проекта
capacityForRevenue     = max(projectCapacity, usedEffectiveCapacity)
revenuePerUnit         = budget / capacityForRevenue
employeeRevenue        = revenuePerUnit × employeeEffectiveCapacity

employeeCost = salary × max(0.5, assignedCapacity)
benchCost    = salary × 0.5   // для неназначенных сотрудников

profit = revenue - cost
```

> 💡 Напиши юнит-тесты прямо в консоли: `console.assert(getVacationCoefficient(...) === 0.8, 'fail')` — сэкономишь часы отладки позже.

---

## Этап 5 — Таблицы: отображение, сортировка, фильтры (~60 мин · 35 баллов)

- **5.1** Рендер таблицы Projects: все столбцы, форматирование capacity "used/total", цвет Estimated Income
- **5.2** Рендер таблицы Employees: все столбцы, возраст из DOB, кнопки Assign / Availability / Delete
- **5.3** Строка Total Estimated Income под таблицей проектов, цветовое кодирование (зелёный/красный)
- **5.4** Сортировка: по клику на заголовок ⇅ → ↑ → ↓; числа численно, строки алфавитно
- **5.5** Фильтры: попапы у заголовков, текстовые поля, dropdown для Position; Apply / Cancel / Enter
- **5.6** Чипсы активных фильтров, кнопка "Clear Filters" при 2+ фильтрах

> 💡 Сделай `renderProjectsTable()` и `renderEmployeesTable()` — функции, которые читают текущие данные + состояние сортировки/фильтрации и полностью перерисовывают таблицу.

---

## Этап 6 — Попапы: назначения, детали, подтверждения (~90 мин · 60 баллов)

- **6.1** Попап "Assign employee": слайдеры capacity/fit, dropdown проектов, real-time валидация, позиционирование у кнопки
- **6.2** Попап должен оставаться в viewport — проверить overflow и скорректировать позицию; обновлять при scroll/resize
- **6.3** Попап "Show Employees" (из проектов): таблица с capacity, fit, vacation, effective, revenue, cost, profit + Edit/Unassign
- **6.4** Попап "Show Assignments" (из сотрудников): аналогичная таблица со стороны сотрудника
- **6.5** Попап "Unassign": финансовые детали до/после, кнопки Confirm/Cancel
- **6.6** Попап "Edit assignment": слайдеры для изменения capacity/fit, валидация, сохранение
- **6.7** Action меню у ссылок: "See at Projects/Employees" (переключает вкладку + фильтр) + "Unassign"

> 💡 Все попапы делай через один механизм: `showModal(content, options)`. Backdrop, close-on-outside-click, close-button — один раз, не копируй.

---

## Этап 7 — Календарь отпусков + финальная полировка (~60 мин · 20 баллов)

- **7.1** Рендер сетки календаря: текущий период, выходные, сегодня (если текущий месяц)
- **7.2** Клик по дням — toggle выбора; подсветка выбранных; реальный пересчёт рабочих дней
- **7.3** Отображение диапазонов отпуска: "DD.MM-DD.MM" (объединять через выходные); строка "Working Days: X/Y"
- **7.4** Кнопка "Set Vacation" — сохранить, пересчитать все финансовые показатели, обновить таблицы
- **7.5** Проверить все расчёты сквозно: изменить отпуск → убедиться, что effective capacity и profit обновились
- **7.6** Проверить: нет ошибок в консоли, работает на GitHub Pages, все попапы закрываются правильно

> 💡 Финальный чеклист: переключи на другой месяц → данные независимые? Обнови страницу → данные сохранились? Assign-попап у края экрана → не обрезается?

---

## Таблица баллов по критериям

| Критерий | Баллов |
|---|---|
| Data Persistence & Monthly Snapshots | 25 |
| Employee CRUD | 15 |
| Project CRUD | 10 |
| Assignment Management | 20 |
| Financial Calculations | 30 |
| Forms & Validation | 15 |
| Tables Display | 15 |
| Sorting | 10 |
| Filtering | 10 |
| Details Popups | 15 |
| Assignment Popup Positioning | 5 |
| Availability Calendar | 20 |
| Navigation & UI | 10 |
| **Итого** | **200** |

---

*Скидывай номер этапа — разберём подробно и напишем код вместе.*


5.4 — сортировка таблиц
5.5-5.6 — фильтры и чипсы
6.3 — попап "Show Employees" из проектов
6.4 — попап "Show Assignments" из сотрудников
6.5 — попап Unassign
6.6 — попап Edit assignment
6.7 — action меню у ссылок
2.6 — Seed Data попап
Этап 7 — календарь отпусков