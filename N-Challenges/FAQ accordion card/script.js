const faqItemsContainer = document.getElementById('faq-items-container')

faqItemsContainer.addEventListener('click', (e) => {
  const clickedElement = e.target
  if (clickedElement.classList.contains('faq-item__title-container')) {
    const activeItem = document.querySelector('.faq-item--active')
    const clickedItem = clickedElement.parentElement
    clickedItem.classList.toggle('faq-item--active') // Collapse/Expand clicked item
    if (activeItem && activeItem != clickedItem) activeItem.classList.remove('faq-item--active') // Collapse active item
  }
})
