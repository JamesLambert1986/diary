/** 
 * Global helper functions to help maintain and enhance framework elements.
 * @module Helpers 
 */

/**
 * Add global classes used by the CSS and later JavaScript.
 * @param {HTMLElement} body Dom element, this doesn't have to be the body but it is recommended.
 */
export const addBodyClasses = (body: HTMLElement) => {

  body.classList.add("js-enabled");

  if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
    
    body.classList.add("ie");
  }

  return null
}

/**
 * Add global events.
 * @param {HTMLElement} body Dom element, this doesn't have to be the body but it is recommended.
 */
export const addGlobalEvents = () => {
  
  window.addEventListener('hashchange', function() {

    const hash = location.hash.replace('#','');
    const label: HTMLElement|null = document.querySelector(`label[for="${hash}"]`);
    const detail = document.querySelector(`details[id="${hash}"]:not([open])`);

    if(label)
      label.click();
    else if(detail)
      detail.setAttribute('open','open');
    
  }, false);

  return null
}

/**
 * Check if an element contains certain elements that needs enhancing with the JavaScript helpers, it is recommended to do this on the page body after the dom is loaded. Elements that are loaded via ajax should also run this function. 
 * @param {HTMLElement} element Dom element, this doesn't have to be the body but it is recommended.
 */
export const checkElements = (element: HTMLElement) => {

  // Tables
  Array.from(element.querySelectorAll('table')).forEach((table: any,) => {

    tableStacked(table);
    tableWrap(table);
  });
}

/**
 * Wrap tables with a table wrapper div to help maintain its responsive design.
 * @param {HTMLElement} table Dom table element
 */
export const tableWrap = (table: any) => {
  
  if(!table.parentNode.classList.contains('table__wrapper')){

    const tableHTML = table.outerHTML;

    table.outerHTML = `<div class="table__wrapper">${tableHTML}</div>`;
  }
}

/**
 * Creates data attributes to be used by the CSS for mobile views.
 * @param {HTMLElement} table Dom table element
 */
export const tableStacked = (table: HTMLElement) => {

  const colHeadings = Array.from(table.querySelectorAll('thead th'));
  const colRows = Array.from(table.querySelectorAll('tbody tr'));

  colRows.forEach((row:any) => {

    const cells = Array.from(row.querySelectorAll('th, td'));
    
    cells.forEach((cell:any, cellIndex) => {

      const heading:any = colHeadings[cellIndex];
      if(typeof heading != "undefined"){

        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = heading.innerHTML;
        let headingText = tempDiv.textContent || tempDiv.innerText || "";
        cell.setAttribute('data-label',headingText);
      }
    });
  });
}


export const isNumeric = function(str:String) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(parseInt(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
          !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

export const ucfirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export const ucwords = (str: string) => str.split(' ').map(s => ucfirst(s)).join(' ')
export const unsnake = (str: string) => str.replace(/_/g, ' ')
export const snake = (str: string) => str.replace(/ /g, '_')
export const safeID = function(str: string){

  str = str.toLowerCase();
  str = snake(str);
  str = str.replace(/\W/g,'');

  return str;
}

export const getNumberOfDays = function(startDateString:string,endDateString:string){

  let convertStart = startDateString.split('/');
  let convertEnd = endDateString.split('/');
  let dateStart:any = new Date(convertStart[1]+'/'+convertStart[0]+'/'+convertStart[2]);
  let dateEnd:any = new Date(convertEnd[1]+'/'+convertEnd[0]+'/'+convertEnd[2]);

  if(dateStart == "Invalid Date")
    throw "Start date is not a valid date"

  if(dateEnd == "Invalid Date")
    throw "End date is not a valid date"

  // To calculate the time difference of two dates
  let diffTime = dateEnd.getTime() - dateStart.getTime();
  let numberOfDays = (diffTime / (1000 * 3600 * 24) + 1);

  if(numberOfDays < 0)
    throw "The start date should be before the end date";
  
  return numberOfDays;
}

export const getNth = function(n){
  return["st","nd","rd"][((n+90)%100-10)%10-1]||"th";
}

export const getDaysInMonth = function(month,year) {
  return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
}

export const getDayOfWeek = function(day,month,year){
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(year,month,day).getDay()];
}

export const getMonthName = function(month){
  return ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November", "December"][month-1];
}