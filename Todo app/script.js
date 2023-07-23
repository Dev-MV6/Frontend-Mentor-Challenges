class TodoApp {
  constructor(container) {
    // Enable style transitions once the document is fully loaded
    window.addEventListener('load', () => {
      document.body.classList.add('body--transition-enabled')
    })

    // Get application theme from local storage or set to 'dark' by default
    this.theme = localStorage.getItem('theme') || 'dark'
    document.body.className = this.theme

    const todoListDemo = [
      { description: 'Complete online JavaScript course', completed: true },
      { description: 'Jog around the park 3x', completed: false },
      { description: '10 minutes meditation', completed: false },
      { description: 'Read for 1 hour', completed: false },
      { description: 'Pick up groceries', completed: false },
      { description: 'Complete Todo App on Frontend Mentor', completed: false },
    ]

    // Initialize todo list
    this.todoListContainer = container
    // Get saved list from local storage or use demo list otherwise
    this.todoList = JSON.parse(localStorage.getItem('todoList')) || todoListDemo
    this.todoList.forEach(this.renderTodoItem.bind(this)) // create elements for each saved item and append them to the container

    this.setupEventListeners() // add event listeners to DOM elements to trigger app methods, e.g: `addNewTodo()`
    this.initializeSlip() // enable todo items reordering
    this.updateTodosView()
  }

  setupEventListeners() {
    // Add new todo
    document.querySelector('.add-btn').addEventListener('click', (e) => {
      e.preventDefault()
      const textField = document.querySelector('.new-todo-bar__text-field')
      if (!textField.value.length) return // no user input
      this.addNewTodoItem({ description: textField.value })
      textField.value = null
    })

    // Clear completed items
    document.querySelector('.todos-view__clear-completed-btn').addEventListener('click', () => this.clearCompletedItems())

    // Filter todo list
    const filterRadioElements = document.querySelectorAll('.filter-radio') // Get all filter radio inputs
    filterRadioElements.forEach((radioElement) => {
      radioElement.addEventListener('click', (e) => {
        const selectedFilterValue = e.target.value
        document.querySelector('.todos-view').className =
          selectedFilterValue === 'all'
            ? 'todos-view'
            : `todos-view todos-view--filtered todos-view--filtered_${selectedFilterValue}`

        // Send alert
        this.alert(`👁️ Showing: ${selectedFilterValue[0].toUpperCase() + selectedFilterValue.slice(1)} tasks`, 2000)
      })
    })

    // Toggle theme
    document.querySelector('.toggle-theme-btn').addEventListener('click', () => {
      // Start background banner animation
      backgroundBannerElement.style.opacity = '0'

      if (this.theme === 'light') {
        this.theme = 'dark'
        this.alert('🌙&nbsp;&nbsp;Dark theme', 2000)
      } else {
        this.theme = 'light'
        this.alert('⛅&nbsp;&nbsp;Light theme', 2000)
      }
      document.body.className = this.theme
      document.body.classList.add('body--transition-enabled')
      // Save to local storage
      localStorage.setItem('theme', this.theme)
    })

    // Toggle theme: background banner animation
    const backgroundBannerElement = document.querySelector('.background-banner')
    backgroundBannerElement.classList.toggle('background-banner--light', this.theme === 'light')

    backgroundBannerElement.addEventListener('transitionend', () => {
      backgroundBannerElement.style.opacity = '1'
      backgroundBannerElement.classList.toggle('background-banner--light', this.theme === 'light')
    })
  }

  initializeSlip() {
    // List reordering (Slip library)
    new Slip(this.todoListContainer, { accessibility: 'none', ignoredElements: ['.todo-list__inset-shadow'] })

    // prevent swiping
    this.todoListContainer.addEventListener('slip:beforeswipe', (e) => e.preventDefault())

    // prevent reordering without using handle
    this.todoListContainer.addEventListener(
      'slip:beforereorder',
      function (e) {
        if (!e.target.classList.contains('todo-list__item__icon-handle') || this.todoList.length <= 1) {
          e.preventDefault()
        }
      }.bind(this)
    )

    // trigger reordering immediately when using handle
    this.todoListContainer.addEventListener('slip:beforewait', function (e) {
      if (e.target.classList.contains('todo-list__item__icon-handle')) {
        e.preventDefault()
      }
    })

    // after the element is dropped in a different location
    this.todoListContainer.addEventListener(
      'slip:reorder',
      function (e) {
        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore) // change element position in container (DOM)
        const movedItem = this.todoList[e.detail.originalIndex]
        this.todoList.splice(e.detail.originalIndex, 1) // remove item from old list position
        this.todoList.splice(e.detail.spliceIndex, 0, movedItem) // insert item in new list position
        this.saveListToLocalStorage()
      }.bind(this)
    )
  }

  isValidItem(object) {
    // Checks if passed object is a valid todo item:

    if (!object) return false

    // `description` property is undefined or contains a value of an invalid type (or an empty string)
    if (!object.description || typeof object.description !== 'string' || object.description === '') return false

    // `completed` property is defined (although it can be undefined) but contains a value of an invalid type
    if (object.completed !== undefined && typeof object.completed !== 'boolean') return false

    // Looks like a valid todo item:
    return true
  }

  renderTodoItem(todoItem) {
    // Create and append item element to DOM
    if (!this.isValidItem(todoItem)) {
      console.error('Invalid item detected, skipping...')
      return
    }

    // Create new element
    const newTodoItem = document.createElement('li')
    newTodoItem.className = 'todo-list__item'

    if (todoItem.completed) newTodoItem.classList.add('todo-list__item--completed')

    newTodoItem.innerHTML = `
    <div class="todo-list__item__icon-check"></div>
    <span class="todo-list__item__description">${todoItem.description}</span>
    <img class="todo-list__item__icon-delete" src="images/icon-cross.svg" alt="" draggable="false" />
    <img class="todo-list__item__icon-handle" src="images/icon-handle.svg" alt="" draggable="false" />`

    // Event Listener: toggle item completed state
    newTodoItem.querySelector('.todo-list__item__icon-check').addEventListener('click', () => {
      newTodoItem.classList.toggle('todo-list__item--completed')
      this.onItemListDataChange()
    })

    // Event Listener: delete item
    newTodoItem.querySelector('.todo-list__item__icon-delete').addEventListener('click', () => {
      // remove element from DOM
      newTodoItem.remove()
      this.onItemListDataChange()
    })

    // Append to container
    this.todoListContainer.appendChild(newTodoItem)
    this.updateTodosView()
  }

  addNewTodoItem(item) {
    if (this.isValidItem(item)) {
      // Add new item to list
      this.todoList.push(item)
      // Add item element to DOM
      this.renderTodoItem(item)
    }

    this.saveListToLocalStorage()
  }

  clearCompletedItems() {
    // Clear all completed items: Remove from DOM and update item list
    if (this.itemsLeft == this.todoList.length) return // no completed items
    const todoItemElements = document.querySelectorAll('.todo-list__item')
    todoItemElements.forEach((element) => {
      if (element.classList.contains('todo-list__item--completed')) element.remove()
    })
    this.onItemListDataChange() // update and save changes in the list after removing completed items from the container
    this.alert('✅&nbsp;&nbsp;Completed tasks have been cleared', 3000)
  }

  updateTodoListFromDOM() {
    // Get item data from the elements in the container (completed state, description, order) and store it in `this.todoList` as a new array
    const todoItemElements = document.querySelectorAll('.todo-list__item')
    this.todoList = Array.from(todoItemElements).map((element) => ({
      description: element.querySelector('.todo-list__item__description').innerText,
      completed: element.classList.contains('todo-list__item--completed'),
    }))
  }

  updateTodosView() {
    // Depending on whether the todo list contains any items or not, adjust the visibility of the `todos-view` container
    if (!this.todoList.length) {
      // List is empty
      document.querySelector('.todos-view').style.display = 'none'
      // Change attribution text position: place centered at the bottom of the screen
      const attributionContainer = document.querySelector('.attribution')
      attributionContainer.style = 'position: absolute; bottom: 20px; left: 50%; transform: translate(-50%, 0)'

      return
    } else {
      // List is not empty
      document.querySelector('.todos-view').style.display = 'block'
      // Change attribution text position: reset applied styles
      const attributionContainer = document.querySelector('.attribution')
      attributionContainer.style = ''
    }

    // Check items left (i.e: Todo items where `completed` property is not true)
    this.itemsLeft = this.todoList.filter((todoItem) => todoItem && !todoItem.completed).length
    const itemsLeftElement = document.querySelector('.todos-view__items-left')
    if (!this.itemsLeft) {
      itemsLeftElement.innerText = 'You are done!'
      itemsLeftElement.style.color = 'var(--active-blue)'
    } else {
      itemsLeftElement.innerText = `${this.itemsLeft} items left`
      itemsLeftElement.style.color = ''
    }
  }

  onItemListDataChange() {
    // Called every time an item in the list is updated, deleted or reordered
    this.updateTodoListFromDOM()
    this.updateTodosView()
    this.saveListToLocalStorage()
  }

  saveListToLocalStorage() {
    // Save todo list in browser local storage
    localStorage.setItem('todoList', JSON.stringify(this.todoList))
  }

  alert(msg, time) {
    // Display an alert in the UI with a custom message
    const alertContainer = document.querySelector('.alert')
    if (alertContainer.classList.contains('alert--visible')) {
      // alert is still visible to the user?: reset the timeout set to hide the alert
      clearTimeout(this.alertTimeout)
    }
    alertContainer.classList.add('alert--visible') // show alert
    alertContainer.innerHTML = msg // set message
    // Wait the specified amount of time (in milliseconds) before hiding the alert
    this.alertTimeout = setTimeout(() => {
      alertContainer.classList.remove('alert--visible') // hide alert
    }, time)
  }
}

const todoApp = new TodoApp(document.querySelector('.todo-list'))
