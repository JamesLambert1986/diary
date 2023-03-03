import { getNumberOfDays, getNth, getDaysInMonth, getMonthName } from './helpers.js';
// #region Functions that setup and trigger other functions 
export const setupDiary = (element) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const monthInput = element.querySelector('[name=month]');
    const yearInput = element.querySelector('[name=year]');
    monthInput.value = month + 1;
    let selectOptions = '';
    const startYear = yearInput.querySelector('option:first-child').value;
    const lastYear = yearInput.querySelector('option:last-child').value;
    const dialog = element.querySelector('dialog');
    const eventIdInput = element.querySelector('[name="eventId"]');
    const startInput = element.querySelector('[name="start"]');
    const endInput = element.querySelector('[name="end"]');
    const titleInput = element.querySelector('[name="title"]');
    const descInput = element.querySelector('[name="desc"]');
    const cancelButton = element.querySelector('dialog .cancel');
    const deleteButton = element.querySelector('dialog .delete');
    const saveButton = element.querySelector('dialog .save');
    const eventsList = element.querySelector('.events');
    for (let i = startYear; i <= lastYear; i++) {
        selectOptions += `<option value="${i}">${i}</option>`;
    }
    yearInput.innerHTML = selectOptions;
    yearInput.value = year;
    Array.from(element.querySelectorAll('tbody td')).forEach((arrayElement, index) => {
        arrayElement.innerHTML = ``;
    });
    populateDays(element, month, year);
    poulateEvents(element);
    element.querySelectorAll("[name=month],[name=year]").forEach(function (elem) {
        elem.addEventListener("change", function () {
            populateDays(element, monthInput.value - 1, yearInput.value);
            poulateEvents(element);
        });
    });
    element.querySelectorAll("tbody td[data-date]").forEach(function (td) {
        td.addEventListener("click", function (e) {
            // check if clicking on event\
            console.log(e.target);
            dialog.setAttribute('open', 'open');
            for (var target = e.target; target && target != this; target = target.parentNode) {
                if (target.matches('[data-event]')) {
                    let eventId = target.getAttribute('data-event');
                    let eventElement = element.querySelector(`#${eventId}`);
                    const dateString = eventElement.getAttribute('data-start-date');
                    const dateInputString = `${dateString.split('/')[2]}-${(dateString.split('/')[1]).toString().padStart(2, '0')}-${(dateString.split('/')[0]).toString().padStart(2, '0')}`;
                    startInput.value = dateInputString;
                    endInput.value = dateInputString;
                    if (eventElement.hasAttribute('data-end-date')) {
                        const dateEndString = eventElement.getAttribute('data-end-date');
                        const dateEndInputString = `${dateEndString.split('/')[2]}-${(dateEndString.split('/')[1]).toString().padStart(2, '0')}-${(dateEndString.split('/')[0]).toString().padStart(2, '0')}`;
                        endInput.value = dateEndInputString;
                    }
                    titleInput.value = eventElement.querySelector('strong').textContent;
                    descInput.value = eventElement.querySelector('span').textContent;
                    eventIdInput.value = eventId;
                    return;
                }
            }
            const dateString = td.getAttribute('data-date');
            const dateInputString = `${dateString.split('/')[2]}-${(dateString.split('/')[1]).toString().padStart(2, '0')}-${(dateString.split('/')[0]).toString().padStart(2, '0')}`;
            startInput.value = dateInputString;
            endInput.value = dateInputString;
        });
    });
    cancelButton.addEventListener("click", function (e) {
        e.preventDefault();
        closeDialog(dialog);
    });
    deleteButton.addEventListener("click", function (e) {
        e.preventDefault();
        let eventElement = element.querySelector(`#${eventIdInput.value}`);
        eventElement.remove();
        populateDays(element, monthInput.value - 1, yearInput.value);
        poulateEvents(element);
        closeDialog(dialog);
    });
    element.addEventListener("submit", function (e) {
        e.preventDefault();
        let eventStartString = `${parseInt(startInput.value.split('-')[2])}/${parseInt(startInput.value.split('-')[1])}/${parseInt(startInput.value.split('-')[0])}`;
        let eventEndString = `${parseInt(endInput.value.split('-')[2])}/${parseInt(endInput.value.split('-')[1])}/${parseInt(endInput.value.split('-')[0])}`;
        if (eventIdInput.value) {
            let eventElement = element.querySelector(`#${eventIdInput.value}`);
            eventElement.setAttribute('data-start-date', eventStartString);
            eventElement.setAttribute('data-end-date', eventEndString);
            eventElement.innerHTML = `<strong>${titleInput.value}</strong> <span>${descInput.value}</span>`;
        }
        else
            eventsList.innerHTML += `<li data-start-date="${eventStartString}" data-end-date="${eventEndString}"><strong>${titleInput.value}</strong> <span>${descInput.value}</span></li>`;
        populateDays(element, monthInput.value - 1, yearInput.value);
        poulateEvents(element);
        closeDialog(dialog);
    });
};
function populateDays(element, month, year) {
    const firstDayMonth = new Date(year, month, 1);
    const startDay = firstDayMonth.getDay() == 0 ? 7 : firstDayMonth.getDay();
    const endDay = getDaysInMonth(month, year);
    let dayCount = 1;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    Array.from(element.querySelectorAll('tbody td')).forEach((arrayElement, index) => {
        arrayElement.removeAttribute('data-date');
        arrayElement.innerHTML = ``;
        arrayElement.classList.remove('current');
        if (index + 1 >= startDay && dayCount <= endDay) {
            arrayElement.setAttribute('data-date', `${dayCount}/${month + 1}/${year}`);
            arrayElement.innerHTML = `<span class="date">${dayCount}${getNth(dayCount)} <span class="visually-hidden">${getMonthName(month + 1)}</span></span>`;
            if (dayCount == currentDay && month == currentMonth && year == currentYear)
                arrayElement.classList.add('current');
            dayCount++;
        }
    });
}
function closeDialog(dialog) {
    dialog.removeAttribute('open');
    dialog.querySelectorAll("input").forEach(function (input) {
        input.value = '';
    });
}
function poulateEvents(element) {
    Array.from(element.querySelectorAll('.events li[data-start-date]')).forEach((arrayElement, index) => {
        const dateString = arrayElement.getAttribute('data-start-date');
        const date = new Date(dateString.split('/')[2], dateString.split('/')[1] - 1, dateString.split('/')[0]);
        arrayElement.setAttribute('id', `event${index}`);
        addEvent(element, arrayElement, dateString, `event${index}`);
        if (arrayElement.hasAttribute("data-end-date")) {
            let numberOfDays = getNumberOfDays(dateString, arrayElement.getAttribute("data-end-date"));
            for (let i = 1; i < numberOfDays; i++) {
                let arrayDate = new Date(date);
                arrayDate.setDate(arrayDate.getDate() + i);
                addEvent(element, arrayElement, `${arrayDate.getDate()}/${arrayDate.getMonth() + 1}/${arrayDate.getFullYear()}`, `event${index}`);
            }
        }
    });
}
function addEvent(element, event, date, id) {
    const td = element.querySelector(`table td[data-date="${date}"]`);
    if (td) {
        td.innerHTML += `<span class="event" data-event="${id}">${event.innerHTML}</span>`;
    }
}
export default setupDiary;
//# sourceMappingURL=diary.js.map