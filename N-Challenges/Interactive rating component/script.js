let selectedRadioBtn
const card = document.querySelector('.card')
const cardError = document.querySelector('.card__submit-error')
const radioButtonsControl = document.querySelector('.card-rating__radio-control')

radioButtonsControl.addEventListener('click', (e) => {
  const target = e.target
  if (target.classList.contains('card-rating__radio-button') && target !== selectedRadioBtn) {
    cardError.classList.remove('card__submit-error--visible')
    target.classList.add('card-rating__radio-button--selected')
    selectedRadioBtn?.classList.remove('card-rating__radio-button--selected')
    selectedRadioBtn = target
  }
})

function submitRating(e) {
  e.preventDefault()
  if (!selectedRadioBtn) {
    cardError.classList.add('card__submit-error--visible')
    return
  }
  card.classList.add('card--submitted')
  document.querySelector('.card-rating-result').textContent = `You selected ${selectedRadioBtn.innerText} out of 5`
}
