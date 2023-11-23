const monthTotalDays = [31,28,31,30,31,30,31,31,30,31,30,31]
const isLeap = (year) => Boolean(year && !(year % 4) && ((year % 100) || !(year % 400)))
const dayInput = $("#day-input")[0];
const monthInput = $("#month-input")[0];
const yearInput = $("#year-input")[0];

function validateBirthdateFields() {
  $("#birthdate").removeClass("birthdate--invalid")
  const now = new Date()
  const birthdateDay = parseInt(dayInput.value)
  const birthdateMonth = parseInt(monthInput.value)
  const birthdateYear = parseInt(yearInput.value)

  const yearIsValid = Boolean(birthdateYear > 0)
  const monthIsValid = Boolean(birthdateMonth >= 1 && birthdateMonth <= 12)
  const dayIsValid = Boolean(
    birthdateDay && birthdateDay > 0 && birthdateDay <= 31
    && ((birthdateDay <= (monthTotalDays[birthdateMonth - 1] === 28 && isLeap(birthdateYear) ? 29 : monthTotalDays[birthdateMonth - 1])) || !monthIsValid)
  )

  const validateField = function (input, isValid) {
    input.parentElement.classList.toggle("invalid-field", !isValid)
    input.parentElement.classList.toggle("invalid-field--empty", !input.value)
  }

  validateField(dayInput, dayIsValid)
  validateField(monthInput, monthIsValid)
  validateField(yearInput, yearIsValid)

  const birthdate = new Date(Date.parse(`${birthdateMonth}/${birthdateDay}/${birthdateYear}`))
  if (dayIsValid && monthIsValid && yearIsValid) {
    // Invalidate all fields
    if (birthdate > now) {
      $("#birthdate").addClass("birthdate--invalid")
      validateField(dayInput, false)
      return false
    }
    return birthdate
  }
  return false
}

function calculateAge(birthdate) {
  const now = new Date()
  
  let years = now.getFullYear() - birthdate.getFullYear()
  let months = (now.getMonth() - birthdate.getMonth())

  if (months < 0) {
    years--
    months = now.getMonth() + (12 - birthdate.getMonth())
  }

  let days = now.getDate() - birthdate.getDate()

  if (days < 0) {
    if (months-- == 0) {
      months = months+12
      years--
    }
    days = now.getDate() + (monthTotalDays[birthdate.getMonth()] - birthdate.getDate())
  }

  const setResult = function (element, value) {
    // Animation
    if (element.innerText == value) return // skip if no change
    const animationDuration = 300
  
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
      element.innerHTML = Math.floor(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  setResult($("#years-result")[0], years)
  setResult($("#months-result")[0], months)
  setResult($("#days-result")[0], days)
}

$( ".field" ).on("keyup", (e) => {
  if (e.key == "Enter") {
    if (birthdate = validateBirthdateFields()) {
      calculateAge(birthdate)
    }  
  }
})

$( "button" ).on("click", () => {
  if (birthdate = validateBirthdateFields()) {
    calculateAge(birthdate)
  }
})