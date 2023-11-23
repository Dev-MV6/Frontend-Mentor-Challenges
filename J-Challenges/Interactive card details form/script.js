// CARDHOLDER NAME
const cardholderField = document.getElementById("cardholder-name-field")
const cardholderPreview = document.getElementById("cardholder-name-preview")

cardholderField.addEventListener("input", function() {
  cardholderPreview.innerText = this.value.trim() || "Jane Appleseed"
})

// CARD NUMBER
const cardNumberField = document.getElementById("card-number-field")
const cardNumberPreview = document.getElementById("card-number-preview")

cardNumberField.addEventListener("input", function () {
  // Format field
  let value = this.value
  value = value.replaceAll(" ", "").match(/\d{1,4}/g)?.join(" ") || ""

  // Set value to card preview
  const placeholder = "XXXX XXXX XXXX XXXX"
  const previewValue = `${value}<span class="text-transparent-white">${placeholder.slice(value.length)}</span>`
  cardNumberPreview.innerHTML = value ? previewValue : "0000 0000 0000 0000"

  this.value = value
})

// EXPIRATION DATE
const expDateContainer = document.getElementById("exp-date-container")
const expMonthField = document.getElementById("exp-month-field")
const expYearField = document.getElementById("exp-year-field")
const expDatePreview = document.getElementById("exp-date-preview")

expDateContainer.addEventListener("keyup", () => {
  const placeholder = "XX"
  const mm = expMonthField.value
  const yy = expYearField.value
  const previewValue = `${mm}<span class="text-transparent-white">${placeholder.slice(mm.length)}</span>/${yy}<span class="text-transparent-white">${placeholder.slice(yy.length)}</span>`
  expDatePreview.innerHTML = !mm && !yy ? "00/00" : previewValue
})

// CVC
const cvcField = document.getElementById("cvc-field")
const cvcPreview = document.getElementById("cvc-preview")

cvcField.addEventListener("input", function () {
  const placeholder = "XXX"
  const cvc = this.value
  const previewValue = `${cvc}<span class="text-transparent-white">${placeholder.slice(cvc.length)}</span>`
  cvcPreview.innerHTML = cvc ? previewValue : "000"
})

// SUBMIT
const form = document.querySelector("form")
const cardDetailsFields = document.getElementById("card-details-fields")
const completeStateScreen = document.getElementById("complete-state")

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const fields = [cardholderField, cardNumberField, expMonthField, expYearField, cvcField]
  const validateField = (field, valid) => {
    const control = field.parentElement.parentElement
    control.classList.toggle("control--invalid", !valid)
  }

  let validForm = true

  fields.forEach(field => {
    field.setAttribute("required", "")
    validateField(field, field.value)
    if (!field.value) {
      validForm = false
    }

    if (field === expMonthField || field === expYearField) {
      const month = parseInt(expMonthField.value)
      const year = parseInt(expYearField.value)
      const isValidMonth = !isNaN(month) && month >= 1 && month <= 12;
      const isValidYear = !isNaN(year) && year >= 1;

      if (!isValidMonth || !isValidYear) {
        validateField(field, false)
        validForm = false
      }
    }
  })

  if (validForm) {
    cardDetailsFields.classList.add("hidden")
    completeStateScreen.classList.replace("hidden", "flex")
  }
})

// CARD 3D EFFECT
const cardWrappers = document.querySelectorAll(".card-wrapper")
cardWrappers.forEach((wrapper) => {
  const card = wrapper.querySelector(".card")
  wrapper.addEventListener("mousemove", function (e) {
    const maxRotation = 5

    const halfWidth = this.getBoundingClientRect().width / 2
    const rotateY = ((e.offsetX - halfWidth) / halfWidth) * maxRotation * -1 // (Invert)

    const halfHeight = this.getBoundingClientRect().height / 2
    const rotateX = ((e.offsetY - halfHeight) / halfHeight) * maxRotation

    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
  })

  wrapper.addEventListener("mouseenter", () => {
    card.style.transition = "transform 200ms"
    setTimeout(() => card.style.transition = "none", 150)
  })

  wrapper.addEventListener("mouseleave", () => {
    card.style.transition = "transform 500ms"
    card.style.transform = ""
  })
})
