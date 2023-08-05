function addOnA11YClickEventListener(element, callback, abortOnTrigger) {
  const controller = new AbortController()
  const options = abortOnTrigger ? { signal: controller.signal } : {}
  element.addEventListener(
    'click',
    (e) => {
      callback(e)
      abortOnTrigger && controller.abort()
    },
    options
  )
  element.addEventListener(
    'keypress',
    (e) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        callback(e)
        abortOnTrigger && controller.abort()
      }
    },
    options
  )
}

const themeChanger = document.querySelector('.theme-changer')

const changeTheme = (theme) => {
  const themeChangerDescription = theme == 'light' ? 'Dark Mode' : 'Light Mode'
  themeChanger.querySelector('.theme-changer__description').textContent = themeChangerDescription
  document.body.className = theme
  // Save in local storage
  localStorage.setItem('theme', theme)
}

// Load theme from local storage or use light theme by default
const savedTheme = localStorage.getItem('theme') || 'light'
changeTheme(savedTheme)

// Toggle theme
addOnA11YClickEventListener(themeChanger, () => {
  const theme = document.body.classList.contains('dark') ? 'light' : 'dark'
  changeTheme(theme)
})

// Search countries
function search() {
  searchBoxClearButton.style.display = searchBoxInput.value == '' ? 'none' : 'block' // Show clear input button
  regionFilter.querySelector('.region-filter__description').innerHTML = 'Filter by Region' // Remove selected region from filter description
  const searchTerm = searchBoxInput.value.toLowerCase().trim() // Get search term from search box value
  document.querySelectorAll('.country-card').forEach((card) => {
    // Show only cards of countries with name matching the search term
    const cardCountryName = card.querySelector('.country-card__name').innerText
    card.style.display = !cardCountryName.toLowerCase().includes(searchTerm) ? 'none' : 'block'
  })
}

function clearSearchBox() {
  searchBoxInput.value = '' // Clear input
  searchBoxClearButton.style.display = 'none' // Hide clear input button
  return true
}

const searchBoxInput = document.querySelector('.search-box__input')
searchBoxInput.addEventListener('keyup', search)

const searchBoxClearButton = document.querySelector('.search-box__icon--clear')
addOnA11YClickEventListener(
  searchBoxClearButton,
  () => clearSearchBox() && search() // Clear box and refresh search results
)

// Include non-sovereign states checkbox
const countryCardsContainer = document.querySelector('.country-cards')

const nonSovereignStatesCheckbox = document.querySelector('#non-sovereign-states-checkbox')
const nonSovereignStatesCheckboxContainer = document.querySelector('.non-sovereign-states-checkbox-container')
const handleCheckboxChange = () => {
  countryCardsContainer.setAttribute('data-include-non-sovereign-states', nonSovereignStatesCheckbox.checked)
  nonSovereignStatesCheckboxContainer.setAttribute('aria-checked', nonSovereignStatesCheckbox.checked)
}

handleCheckboxChange() // Check state on page load
nonSovereignStatesCheckbox.addEventListener('change', handleCheckboxChange)
addOnA11YClickEventListener(nonSovereignStatesCheckboxContainer, () => nonSovereignStatesCheckbox.click())

// Filter by region
const regionFilter = document.querySelector('.region-filter')
const regionFilterSelect = regionFilter.querySelector('.region-filter__select')

addOnA11YClickEventListener(regionFilterSelect, () => {
  // Show filtering options
  regionFilterSelect.setAttribute('aria-expanded', regionFilterSelect.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')
})

regionFilterSelect.addEventListener('focusin', () => {
  let controller = new AbortController()
  function collapseOptions(e) {
    if (!regionFilter.contains(e.target) || (e.type == 'click' && e.target.classList.contains('region-filter__option'))) {
      // If it is not children of region filter or user clicked an option
      regionFilterSelect.setAttribute('aria-expanded', 'false') // Hide filtering options
      controller.abort() // Remove event listeners
    }
  }

  document.addEventListener('focusin', (e) => collapseOptions(e), { signal: controller.signal })
  document.addEventListener('click', (e) => collapseOptions(e), { signal: controller.signal })
})

// Region filter option list
function filterByRegion(selectedRegion) {
  document.querySelectorAll('.country-card').forEach((card) => {
    if (selectedRegion == 'All') {
      // Show all cards
      card.style.display = 'block'
      return
    }
    const cardRegion = card.querySelector('.country-card__region').innerText
    card.style.display = cardRegion.includes(selectedRegion) ? 'block' : 'none'
  })
}

const regionFilterOptions = regionFilter.querySelector('.region-filter__options')
regionFilterOptions.addEventListener('click', (e) => {
  if (e.target.classList.contains('region-filter__option')) {
    const selectedRegion = e.target.innerText
    regionFilter.querySelector('.region-filter__description').innerHTML =
      'Filter by Region' + (selectedRegion !== 'All' ? `: <b class="region-filter__selected-option">${selectedRegion}</b>` : '')
    filterByRegion(selectedRegion)
    clearSearchBox()
  }
})

// Workaround for sticky navbar obscuring keyboard focused elements
document.querySelector('.main-container').addEventListener('focusin', (e) => {
  if (e.target.classList.contains('close-button')) return
  const navbarHeight = document.querySelector('.navbar').getBoundingClientRect().height
  const rect = e.target.getBoundingClientRect()
  let scrollRequired = rect.bottom - navbarHeight - 50 < 0 // Obscured by navbar?
  if (scrollRequired) scrollTo(0, rect.y + scrollY - navbarHeight) // Scroll into view
})

class FocusTrap {
  constructor(container) {
    this.trapContainer = container
  }

  active = false
  #disabledElements
  activate() {
    // Select elements outside the trap container to ignore
    const focusableElements = Array.from(
      document.querySelectorAll(
        `div[tabindex="0"],
        a[href]:not([disabled]):not([tabindex="-1"]), 
        button:not([disabled]):not([tabindex="-1"]), 
        textarea:not([disabled]):not([tabindex="-1"]), 
        input:not([disabled]):not([tabindex="-1"]), 
        select:not([disabled]):not([tabindex="-1"])`
      )
    ).filter((element) => !this.trapContainer.contains(element) || element.classList.contains('country-card__face')) // Include only focusable elements that are not children of trap container

    focusableElements.forEach((element) => {
      // Disable elements
      element.setAttribute('data-focus-trap-disabled', '1')
      element.setAttribute('tabindex', '-1')
      element.setAttribute('aria-hidden', 'true')
    })

    this.#disabledElements = focusableElements

    this.active = true
  }

  deactivate() {
    if (!this.active) throw new Error('Focus trap is not active')
    this.#disabledElements.forEach((element) => {
      // Disable elements
      element.removeAttribute('aria-hidden')
      element.removeAttribute('data-focus-trap-disabled')
      element.setAttribute('tabindex', '0')
    })

    this.active = false
  }
}

// See country cards details
addOnA11YClickEventListener(countryCardsContainer, (e) => {
  if (e.target.classList.contains('country-card__face--front')) {
    seeCardDetails(e.target.parentElement)
  }
})

function seeCardDetails(card) {
  if (document.querySelector('.country-card--active')) return // Another card is active

  // Activate focus trap
  const cardFocusTrap = new FocusTrap(card)
  cardFocusTrap.activate()

  // Animation start
  // Backdrop
  const cardBackdrop = document.querySelector('.country-cards__backdrop')
  cardBackdrop.style.display = 'block'
  setTimeout(() => (cardBackdrop.style.opacity = 1), 10)
  document.body.style.overflow = 'hidden' // Disable page scrolling

  card.classList.add('country-card--active')
  card.style.zIndex = 999
  const gridPlaceholder = document.createElement('div')
  gridPlaceholder.className = 'country-card--grid-placeholder'
  gridPlaceholder.innerHTML = '<!-- Active card grid placeholder -->'

  const initialCardRect = card.getBoundingClientRect()
  const cardDetails = card.querySelector('.country-card__info--back')

  const openDetails = () => {
    // Insert grid placeholder
    card.parentElement.insertBefore(gridPlaceholder, card)

    // Animation step #0:
    // Keep the element at the same place but now its position is `fixed`
    card.style.position = 'fixed'
    card.style.left = initialCardRect.left + 'px'
    card.style.top = initialCardRect.top + 'px'

    // Animation step #1: Position
    setTimeout(() => {
      // Delay to wait for the browser to update the `position` property,
      // and then animate position change (JS event loop queue related stuff)
      card.style.top = innerHeight / 2 - initialCardRect.height / 2 + 'px' // center vertically
      card.style.left = innerWidth / 2 - initialCardRect.width / 2 + 'px' // center horizontally

      // Preload flag image for smooth slide-up animation
      new Image().src = card.querySelector('.country-details-flag').style.backgroundImage.match(/(?<=url\(\").*(?=\"\))/g)
    }, 10)

    // Animation step #2: Flip card
    setTimeout(() => card.classList.add('country-card--flipped'), 400)

    // Animation step #3: Fill the whole viewport with card
    setTimeout(() => {
      card.classList.add('country-card--full')
    }, 700)

    // Animation step #4: Show card details
    setTimeout(() => {
      cardDetails.style.display = 'flex'
      closeButton.focus()
    }, 900)
  }

  openDetails() // Start card animation on card front face click

  const closeButton = card.querySelector('.close-button')
  const closeDetails = () => {
    // Hide country details
    cardDetails.style.display = 'none'
    // Hide card backdrop
    cardBackdrop.style.display = 'none'
    cardBackdrop.style.opacity = '0'
    // Animate back to original position
    card.classList.remove('country-card--full')
    // Use placeholder as guide to position the active card back into the grid
    const gridPlaceholderRect = gridPlaceholder.getBoundingClientRect()
    card.style.top = gridPlaceholderRect.top + 'px'
    card.style.left = gridPlaceholderRect.left + 'px'
    card.style.width = gridPlaceholderRect.width + 'px'
    card.style.height = gridPlaceholderRect.height + 'px'

    cardFocusTrap.deactivate() // Deactivate focus trap

    // Safari/Webkit 3D intersection bug workaround
    const navbar = document.querySelector('.navbar')
    const attribution = document.querySelector('.attribution')
    navbar.style.translate = '0 0 1000px'
    attribution.style.translate = '0 0 1000px'

    setTimeout(() => {
      // After positioned back into grid
      // Flip card to front
      card.classList.remove('country-card--flipped')
      card.removeAttribute('style') // Remove inline styles
      setTimeout(() => {
        // After flipped to front
        card.classList.remove('country-card--active')

        // Safari/Webkit 3D intersection bug workaround
        navbar.style.translate = 'none'
        attribution.style.translate = 'none'
      }, 300)

      // Remove grid placeholder
      try {
        // TODO: Remove?
        gridPlaceholder.parentElement.removeChild(gridPlaceholder)
      } catch (e) {
        // Sometimes the browser fails removing the placeholder
        if (e instanceof TypeError) {
          console.error(
            'An error ocurred while removing a grid placeholder from DOM, trying to remove all leftover placeholders...'
          )
          document.querySelectorAll('.country-card--grid-placeholder').forEach((ph) => ph.remove())
        }
      }
      document.body.style.overflow = 'auto' // Enable page scrolling back
      card.querySelector('.country-card__face--front').focus()
    }, 200)
  }

  addOnA11YClickEventListener(closeButton, closeDetails, true)

  // Close card details using ESCAPE key
  document.addEventListener('keydown', function escapeKeyPressed(e) {
    // Card details opening animation must be finished
    if (e.key === 'Escape' && cardDetails.style.display === 'flex') {
      closeButton.click()
      // Remove this event listener after closing card details
      document.removeEventListener('keydown', escapeKeyPressed)
    }
  })
}

// Fetch countries data from API on page load
const fields = 'flags,name,population,region,subregion,capital,tld,currencies,languages,borders,independent'
const url = `https://restcountries.com/v3.1/all?fields=${fields}`
const cardsContainerNote = document.querySelector('.country-cards__note')
fetch(url, { method: 'GET' })
  .then((res) => res.json())
  .then((countries) => {
    if (countries.length === 0) throw new Error() // No countries to show
    cardsContainerNote.style.display = 'none'
    renderCountryCards(
      countries.sort((a, b) => {
        // Sort cards alphabetically
        if (a.name.common < b.name.common) {
          return -1
        }
        if (a.name.common > b.name.common) {
          return 1
        }
        return 0
      })
    )
  })
  .catch(() => {
    cardsContainerNote.classList.add('country-cards__note--error')
    cardsContainerNote.innerText = 'Error: Unable to fetch data from REST Countries API'
  })

function renderCountryCards(countries) {
  countries.forEach((country) => {
    const countryCard = document.createElement('div')
    countryCard.className = 'country-card'
    countryCard.setAttribute('data-sovereign-state', country.independent || false)
    // Format country population
    const countryPopulationFormatted = Intl.NumberFormat({ style: 'useGrouping' }).format(country.population)
    const countryNativeName = country.name.nativeName[Object.keys(country.name.nativeName)[0]]
    const countryCurrencies = Object.values(country.currencies).map(
      (currency) => currency.name + (currency.symbol ? ` (${currency.symbol})` : '')
    )
    const countryLanguages = Object.values(country.languages)
    let countryBorders
    if (country.borders && country.borders.length > 0) {
      // Use ISO3166 code to find country name (display code if name was not found)
      countryBorders = country.borders.map((code) => ISO3166_Alpha3[code] || code)
    }
    // Card flag placeholder (used when country flag is not available in any format)
    const flagOfNone = 'https://upload.wikimedia.org/wikipedia/commons/archive/2/2a/20130501041104%21Flag_of_None.svg'

    countryCard.innerHTML = `<div class="country-card__face country-card__face--front" tabindex="0">
      <!-- Front face of the card -->
      <div class="country-card__flag" style="background-image: url(${
        country.flags.png || country.flags.svg || flagOfNone
      })"></div>
      <div class="country-card__info--front">
        <span class="country-card__name">${country.name.common || '?'}</span>
        <span class="country-card__population"><b>Population:</b> ${countryPopulationFormatted || '?'}</span>
        <span class="country-card__region"><b>Region:</b> ${country.region || '?'}</span>
        <span class="country-card__capital"><b>Capital:</b> ${country.capital[0] || '?'}</span>
      </div>
    </div>
    <div class="country-card__face country-card__face--back">
      <!-- Back face of the card -->
      <div class="country-card__info--back">
        <div class="close-button" tabindex="0">
          <img class="close-button__icon" src="./images/icon-cross.svg" alt="" draggable="false" />
          <span>Close</span>
        </div>

        <div class="country-details-flag" style="background-image: url(${
          country.flags.svg || country.flags.png || flagOfNone
        })"></div>
        <div class="country-details">
          <h1 class="country-details__name">${country.name.common}</h1>
          <div class="country-details__items">
            <ul class="country-details__item-list">
              <li class="country-details__item"><b>Native Name: </b><span>${
                countryNativeName ? countryNativeName.common : country.name.common || '?'
              }</span></li>
              <li class="country-details__item"><b>Population: </b><span>${countryPopulationFormatted || '?'}</span></li>
              <li class="country-details__item"><b>Region: </b><span>${country.region || '?'}</span></li>
              <li class="country-details__item"><b>Sub Region: </b><span>${country.subregion || '?'}</span></li>
              <li class="country-details__item"><b>Capital: </b><span>${country.capital[0] || '?'}</span></li>
            </ul>
            <ul class="country-details__item-list">
              <li class="country-details__item"><b>Top Level Domain: </b><span>${country.tld[0] || '?'}</span></li>
              <li class="country-details__item"><b>Currencies: </b><span>${countryCurrencies.join(', ') || '?'}</span></li>
              <li class="country-details__item"><b>Languages: </b><span>${countryLanguages.join(', ') || '?'}</span></li>
              <li class="country-details__item"><b>Sovereign State: </b><span>${
                country.independent ? 'Yes' : 'No' || '?'
              }</span></li>
            </ul>
          </div>
          ${
            countryBorders
              ? `<div class="country-details__border-countries">
                  <b style="margin-right: 10px">Border Countries: </b>
                  ${
                    // Div for each country border
                    countryBorders
                      .map((borderCountry) => `<div class="country-details__border-country">${borderCountry}</div>`)
                      .join('\n')
                  }
                 </div>`
              : '<!-- No borders to show :/ -->'
          }
        </div>
      </div>
    </div>`

    countryCardsContainer.appendChild(countryCard)
  })
}

/* TODO: Implement GeoChart from Google Charts API for each country card
https://developers-dot-devsite-v2-prod.appspot.com/chart/interactive/docs/gallery/geochart */
