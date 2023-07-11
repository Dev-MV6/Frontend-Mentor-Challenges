class MultiStepForm {
  constructor (name, email, phone) {
    this.userName = name
    this.userEmail = email
    this.userPhone = phone
    this.plan = {
      name: "Arcade",
      price: 9,
      billing: "mo"
    }
    this.addons = []
  }
}

let formData = new MultiStepForm();

const prevStepBTN = document.getElementById("step_screen__prev_step_btn")
const nextStepBTN = document.getElementById("step_screen__next_step_btn")

let activeStepNumber = 1

prevStepBTN.addEventListener("click", prevStep)
nextStepBTN.addEventListener("click", nextStep)

function goToStep(reqStepNumber) {
  let reqStepScreenContent = document.getElementById(`step_screen__content_${reqStepNumber}`)
  if (reqStepScreenContent == null || activeStepNumber == 5) return
  
  switch (activeStepNumber)  {
    case 1: { // validate step 1 before continuing
      // validate user input
      let stepIsValid = true;
      const nameField = document.getElementById("name_field")
      const emailField = document.getElementById("email_field")
      const phoneField = document.getElementById("phone_field")
      let fields = [nameField, emailField, phoneField]
      fields.forEach(field => {
        if (!validateField(field))
          stepIsValid = false;
      })
      if (!stepIsValid) return

      formData.userName = nameField.value
      formData.userEmail = emailField.value
      formData.userPhone = phoneField.value
      break
    }

    case 2: { // store selected plan
      formData.plan.name = selectedPlanElement.querySelector(".step_screen__option_box-description").textContent
      formData.plan.billing = selectedPlanBilling
      formData.plan.price = parseInt(selectedPlanElement.getAttribute("data-price"))

      prepareAddonSelection() // update addon prices
      break
    }

    case 3: { // store checked addons
      formData.addons = new Array()

      const addons = [
        { description: "Online service", price: 1 }, 
        { description: "Larger storage", price: 2 }, 
        { description: "Customizable profile", price: 2 }
      ]

      if (formData.plan.billing == "yr")
        addons.forEach(addon => addon.price = addon.price*10)

      addonElements.forEach(element => {
        let checkbox = element.querySelector(".addon_checkbox")
        if (checkbox.checked) {
          let addonId = element.getAttribute("data-addon_id")
          formData.addons.push(addons[addonId-1])
        }
      })
      break
    }
  }
  
  if (reqStepNumber == 4) 
    summarizeForm()

  // prev step button visibility: hide for first step
  prevStepBTN.style.display = reqStepNumber == 1 ? "none" : "block"
  // step navigation bar visibility: hide for last step (submitted form)
  document.getElementById("step_screen__control_buttons").style.display = reqStepNumber == 5 ? "none" : "flex"
  // change styles of next step button for last step (confirm suscription)
  if (reqStepNumber == 4) {
    nextStepBTN.className = "step_screen__confirm_btn"
    nextStepBTN.innerText = "Confirm"
  } else {
    nextStepBTN.className = ""
    nextStepBTN.innerText = "Next Step"
  }

  // hide current and show requested step content
  let activeStepContent = document.getElementById(`step_screen__content_${activeStepNumber}`)
  activeStepContent.classList.remove("step_screen__content--active")
  reqStepScreenContent.classList.add("step_screen__content--active")

  // ...and update sidebar step indicator
  document.getElementById(`step_indicator_${activeStepNumber == 5 ? 4 : activeStepNumber}`).classList.remove("step_indicator--active")
  document.getElementById(`step_indicator_${reqStepNumber == 5 ? 4 : reqStepNumber}`).classList.add("step_indicator--active")

  activeStepContent = reqStepScreenContent
  activeStepNumber = reqStepNumber
}

function nextStep() {
  goToStep(activeStepNumber+1)
}

function prevStep() {
  goToStep(activeStepNumber-1)
}

// Step 1 (User Info)
function validateField(field) {
  let isValid = field.checkValidity();

  // update field styles
  field.style.borderColor = isValid ? "var(--light-gray)" : "var(--strawberry-red)"
  let alert = field.parentElement.querySelector(".field_validation_alert") // alert message
  alert.style.display = isValid ? "none" : "inline-block"
  alert.textContent = (!isValid && field.value.length != 0) ? "Invalid field" : "This field is required"

  return isValid;
}

// Step 2 (Plan Selection)
const planSelectionContainer = document.getElementById("step_screen__content_2__plan_selection")
const planOptionsElements = [...planSelectionContainer.querySelectorAll(".step_screen__option_box")]
let selectedPlanElement = planOptionsElements[0]

function triggerClickOnEnter(e) {
  if (e.key == 'Enter') e.target.click()
}

planSelectionContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("step_screen__option_box")) {
    let clickedPlanOption = e.target;
    if (selectedPlanElement == clickedPlanOption) return
    // unselect previously selected plan option
    selectedPlanElement.classList.remove("step_screen__option_box--selected")
    // select clicked plan option
    clickedPlanOption.classList.add("step_screen__option_box--selected")
    selectedPlanElement = clickedPlanOption
  }
})

planSelectionContainer.addEventListener("keypress", triggerClickOnEnter)

// plan billing (toggle switch)
const toggleSwitch = document.getElementById("billing_toggle_switch")
toggleSwitch.checked = false;
var selectedPlanBilling = "mo"

toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    selectedPlanBilling = "yr"
  } else {
    selectedPlanBilling = "mo"
  }

  // update plan option prices
  planOptionsElements.forEach(element => {
    let planBasePrices = [9, 12, 15];
    if (selectedPlanBilling == "yr")
      planBasePrices = planBasePrices.map(x => x*10)

    let price = planBasePrices[planOptionsElements.indexOf(element)]
    element.setAttribute("data-price", price)
    element.querySelector(".step_screen__option_box-auxiliar").textContent = `$${price}/${selectedPlanBilling}`
    element.querySelector(".step_screen__option_box-extra").style.display = toggleSwitch.checked ? "block" : "none"
  })
})

function setSwitchChecked(checked) {
  if (checked != toggleSwitch.checked) {
    toggleSwitch.click()
  }
}

toggleSwitchOptionYearly = document.getElementById("billing_option-yearly")
toggleSwitchOptionMonthly = document.getElementById("billing_option-monthly")

toggleSwitchOptionYearly.addEventListener("click", () => setSwitchChecked(true))
toggleSwitchOptionYearly.addEventListener("keypress", triggerClickOnEnter)
toggleSwitchOptionMonthly.addEventListener("click", () => setSwitchChecked(false))
toggleSwitchOptionMonthly.addEventListener("keypress", triggerClickOnEnter)

// Step 3 (Addons)
const addonsSelectionContainer = document.getElementById("step_screen__content_3__addons")
let addonElements = [...addonsSelectionContainer.querySelectorAll(".step_screen__option_box")]

function prepareAddonSelection() {
  addonElements.forEach(element => {
    // uncheck all addons by default
    element.querySelector(".addon_checkbox").checked = false
    element.classList.remove("step_screen__option_box--selected")

    // update addon price according to the plan billing selected in the previous step
    let extraPrice = element.querySelector(".step_screen__option_box-extra")
    let addonBasePrices = [1, 2, 2];
    if (formData.plan.billing == "yr") addonBasePrices = addonBasePrices.map(x => x*10)
    extraPrice.textContent = `+$${addonBasePrices[addonElements.indexOf(element)]}/${formData.plan.billing}`
  })
}

// addon selection
addonElements.forEach(element => {
  let checkbox = element.querySelector(".addon_checkbox")
  element.addEventListener("click", () => {
    checkbox.click()
    if (checkbox.checked) {
      element.classList.add("step_screen__option_box--selected")
    } else {
      element.classList.remove("step_screen__option_box--selected")
    }
  })
  element.addEventListener("keypress", triggerClickOnEnter)
})

// Step 4 (Summary)
function summarizeForm() {
  // Display selected plan
  let plan = formData.plan

  document.getElementById("form_summary-plan-name").textContent = `${plan.name} (${plan.billing == "yr" ? "Yearly" : "Monthly"})`
  document.getElementById("form_summary-plan-price").textContent = `$${plan.price}/${plan.billing}`
  
  const summaryAddonsContainer = document.getElementById("form_summary-addons")
  summaryAddonsContainer.innerHTML = `<hr style="border:none; border-top: 1px solid var(--light-gray); margin: 0 25px 0 25px;">` // reset contents
  
  let totalPrice = plan.price
  if (formData.addons.length > 0) {
    summaryAddonsContainer.style.display = "block"
    formData.addons.forEach(addon => {
      let addonElement = document.createElement("div")
      addonElement.className = "form_summary-item"
      addonElement.innerHTML = `
        <span class="form_summary-item-description">${addon.description}</span>
        <span class="form_summary-item-price">+${addon.price}/${plan.billing}</span>` 
      summaryAddonsContainer.appendChild(addonElement)
      totalPrice += addon.price
    })
  } else summaryAddonsContainer.style.display = "none"

  const totalPriceElement = document.getElementById("form_summary-total_price")
  totalPriceElement.textContent = `$${totalPrice}/${plan.billing}`
  totalPriceElement.parentElement.querySelector(".form_summary-item-description").textContent = `Total (per ${plan.billing == "yr" ? "year" : "month"})`
}
