import { DateTime } from "luxon";

const handleInputStyle = (validator, inputName, invalidText) => {
  let inputLabel = document.getElementById(`${inputName}-label`);
  let inputElement = document.getElementById(inputName);
  let inputInvalid = document.getElementById(`${inputName}-invalid`);

  if (validator) {
    inputLabel.classList.add("text-red-400");
    inputElement.classList.add("border-red-400");
    inputInvalid.classList.remove("invisible");
    inputInvalid.innerHTML = invalidText;
  } else {
    inputLabel.classList.remove("text-red-400");
    inputElement.classList.remove("border-red-400");
    inputInvalid.classList.add("invisible");
  }
}

const determineValidity = (day, month, year) => {
  const noInputText = "This field is required";

  handleInputStyle(!day, "day", noInputText);
  handleInputStyle(!month, "month", noInputText);
  handleInputStyle(!year, "year", noInputText);

  let yearElement = document.getElementById("year-container");
  let monthElement = document.getElementById("month-container");
  let dayElement = document.getElementById("day-container");

  yearElement.innerHTML = "- -";
  monthElement.innerHTML = "- -";
  dayElement.innerHTML = "- -";

  if (!day || !month || !year) {
    return false;
  } else {
    // handle future year
    let isValid = true;
    let birthDate = DateTime.local(year, month, day);
    let currentDate = DateTime.now();
    let diffInDays = currentDate.diff(birthDate, 'days').days;
    const numDays = new Date(year, month, 0).getDate();

    if (year > DateTime.now().year || diffInDays < 0) {
      handleInputStyle(year > DateTime.now().year || diffInDays < 0, "year", "Must be in the past");
      isValid = false;
    }
    // handle month outside of 1 - 12
    if (month < 1 || month > 12) {
      handleInputStyle(month < 1 || month > 12, "month", "Must be a valid month");
      isValid = false;
    }
    // handle day outside of 1 - 31
    if (day < 1 || day > 31) {
      handleInputStyle(day < 1 || day > 31, "day", "Must be a valid day");
      isValid = false;
    } else if (day > numDays) {
      handleInputStyle(day > numDays, "day", "Must be a valid date");
      handleInputStyle(day > numDays, "month", "");
      handleInputStyle(day > numDays, "year", "");
      isValid = false;
    }
    // handle invalid date
    return isValid;
  }
}

const validForm = (day, month, year) => {
  let currentDate = DateTime.now();
  let birthDate = DateTime.local(year, month, day);
  let elapsedTimeObj = currentDate.diff(birthDate, ['days', 'months', 'years']).values;

  let yearElement = document.getElementById("year-container");
  yearElement.innerHTML = elapsedTimeObj.years;

  let monthElement = document.getElementById("month-container");
  monthElement.innerHTML = elapsedTimeObj.months;

  let dayElement = document.getElementById("day-container");
  dayElement.innerHTML = parseInt(elapsedTimeObj.days);
};

let form = document.getElementById("birth-form");

form.onsubmit = (event) => {
  // Stops page from being reloaded
  event.preventDefault();

  let day = parseInt(document.getElementById("day").value);
  let month = parseInt(document.getElementById("month").value);
  let year = parseInt(document.getElementById("year").value);

  let isValid = determineValidity(day, month, year);

  if (isValid) {
    validForm(day, month, year);
  }
};
