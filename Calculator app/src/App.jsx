import { useState, useRef, memo, useEffect } from "react"
import classNames from "classnames"
import "./styles/App.scss"
import ToggleNegativityIcon from "./ToggleNegativityIcon.jsx"

// prettier-ignore
const keys =
['7','8','9','DEL',
 '4','5','6','+',
 '1','2','3','-',
 '.','0','/','x',
 'RESET' , '=' ];

const specialKeys = ["DEL", "RESET", "="]
const operators = ["+", "-", "/", "x"]

const Key = memo((props) => (
  <button
    tabIndex={-1}
    type="button"
    className={classNames(
      "key",
      { "key--special": specialKeys.includes(props.children) },
      { "key-operator--active": props.activeOperator == props.children && props.highlightOperatorKey }
    )}
  >
    <span>{props.children}</span>
  </button>
))

const Keypad = (props) => {
  window.onkeydown = handleKeyPress
  function handleKeyPress(e) {
    let pressedKeyValue
    if (e.type == "click") {
      // Mouse click
      pressedKeyValue = e.target.textContent.trim()
      if (!e.target.classList.contains("key")) return
    } else {
      // Keyboard keydown
      pressedKeyValue = e.key
      switch (e.key) {
        case "Backspace":
        case "Delete":
          pressedKeyValue = "DEL"
          break

        case "Escape":
          pressedKeyValue = "RESET"
          break

        case "*":
          pressedKeyValue = "x"
          break

        case "Enter":
          pressedKeyValue = "="
          break
      }
    }
    if (!keys.includes(pressedKeyValue)) return
    e.preventDefault()

    let newScreenValue

    // Special keys
    switch (pressedKeyValue) {
      case "DEL":
        if (props.screenClearRequiredRef.current) return
        newScreenValue = String(props.screenValue).slice(0, -1)
        if (newScreenValue === "-") newScreenValue = ""
        if (newScreenValue === "" || newScreenValue === "0") {
          props.setHighlightOperatorKey(true)
        }
        break

      case "RESET":
        props.reset()
        break

      case "=":
        if (props.activeOperator === null && props.firstOperantRef.current === null) return // Ignore if not there's nothing to calculate

        if (props.heldOperantRef.current) {
          // Mixed operation
          if (props.highlightOperatorKey) {
            newScreenValue = props.calculateResult({
              operant1: props.heldOperantRef.current,
              operator: props.heldOperatorRef.current,
              operant2: props.firstOperantRef.current,
            })
          } else {
            const parcialCalc = props.calculateResult({ operant2: props.screenValue })
            newScreenValue = props.calculateResult({
              operant1: props.heldOperantRef.current,
              operator: props.heldOperatorRef.current,
              operant2: parcialCalc,
            })
          }
        } else {
          newScreenValue = props.calculateResult({ operant2: props.screenValue })
        }
        props.setActiveOperator(null)
        props.setHighlightOperatorKey(false)
        props.screenClearRequiredRef.current = true
        props.firstOperantRef.current = null
        props.heldOperantRef.current = null
        props.heldOperatorRef.current = null
        break

      default:
        // Decimal point
        if (pressedKeyValue === "." && String(props.screenValue).includes(".") && !props.screenClearRequiredRef.current) {
          return
        }

        if (operators.includes(pressedKeyValue)) {
          // Operators
          if (props.highlightOperatorKey) {
            // Toggle active operator and return
            if (props.heldOperantRef.current) {
              // Mixed operation in course
              if (["x", "/"].includes(pressedKeyValue)) {
                // User clicks multiplication or division operator
                props.setScreenValue(props.firstOperantRef.current)
              } else {
                // User clicks addition or substraction operator
                const result = props.calculateResult({
                  operant1: props.firstOperantRef.current,
                  operator: props.heldOperatorRef.current,
                  operant2: props.heldOperantRef.current,
                })
                props.setScreenValue(result)
              }
            }

            // Set new active operator
            props.setActiveOperator(pressedKeyValue)
            return
          }

          props.setHighlightOperatorKey(true)
          props.screenClearRequiredRef.current = true

          if (props.firstOperantRef.current != null) {
            // Mixed operation in course
            if (["+", "-"].includes(props.activeOperator) && ["x", "/"].includes(pressedKeyValue)) {
              // Split the operation and store previous operant
              props.heldOperantRef.current = props.firstOperantRef.current
              props.heldOperatorRef.current = props.activeOperator
              props.firstOperantRef.current = props.screenValue
              props.setActiveOperator(pressedKeyValue)
              return
            } else {
              if (["+", "-"].includes(pressedKeyValue) && props.heldOperantRef.current) {
                // Caculate part of the operation
                const parcialCalc = props.calculateResult({ operant2: props.screenValue })
                newScreenValue = props.calculateResult({
                  operant2: parcialCalc,
                  operator: props.heldOperatorRef.current,
                  operant1: props.heldOperantRef.current,
                })
                props.firstOperantRef.current = parcialCalc
              } else {
                // Calculate result normally
                newScreenValue = props.calculateResult({ operant2: props.screenValue })
                props.firstOperantRef.current = newScreenValue
              }
              props.setActiveOperator(pressedKeyValue)
            }
          } else {
            // Activate operator normaly
            props.setActiveOperator(pressedKeyValue)
            props.firstOperantRef.current = props.screenValue
            return
          }
        } else {
          // Digits
          if (["+", "-"].includes(props.activeOperator) && ["+", "-"].includes(props.heldOperatorRef.current)) {
            // Calculate mixed operation
            props.firstOperantRef.current = props.screenValue
            props.heldOperantRef.current = null
            props.heldOperatorRef.current = null
          }

          props.setHighlightOperatorKey(false)
          if (props.screenClearRequiredRef.current) {
            if (props.screenValue === "-0" && props.firstOperantRef.current !== "-0") {
              newScreenValue = "-" + pressedKeyValue
            } else {
              newScreenValue = pressedKeyValue
            }
            props.screenClearRequiredRef.current = false
          } else {
            if (props.screenValue === "-0") {
              newScreenValue = "-" + pressedKeyValue
            } else {
              newScreenValue = (props.screenValue === "0" ? "" : props.screenValue) + pressedKeyValue
            }
          }

          if (String(newScreenValue).replace(".", "").length > 9) return // Limit input length

          // console.log(newScreenValue)
          if (newScreenValue === ".") {
            props.setScreenValue("0.")
            return
          } else if (newScreenValue === "-.") {
            props.setScreenValue("-0.")
            return
          }

          props.setScreenValue(newScreenValue)
          return
        }
    }

    props.setScreenValue(newScreenValue || "0")
  }

  return (
    <div className="keypad" onClick={handleKeyPress}>
      {keys.map((x) =>
        operators.includes(x) ? (
          // Operators
          <Key key={x} activeOperator={props.activeOperator} highlightOperatorKey={props.highlightOperatorKey}>
            {x}
          </Key>
        ) : (
          // Digits
          <Key key={x}>{x}</Key>
        )
      )}
    </div>
  )
}

const App = () => {
  const [screenValue, setScreenValue] = useState("0")
  const [activeOperator, setActiveOperator] = useState(null)
  const [highlightOperatorKey, setHighlightOperatorKey] = useState(false)

  const firstOperantRef = useRef(null)
  const heldOperantRef = useRef(null)
  const heldOperatorRef = useRef(null)
  const screenClearRequiredRef = useRef(false)

  const reset = () => {
    setScreenValue(0)
    setActiveOperator(null)
    setHighlightOperatorKey(false)
    screenClearRequiredRef.current = false
    firstOperantRef.current = null
    heldOperantRef.current = null
    heldOperatorRef.current = null
  }

  const calculateResult = ({ operant1 = firstOperantRef.current, operator = activeOperator, operant2 }) => {
    // console.log(operant1, operator, operant2)
    let result
    switch (operator) {
      case "+":
        result = parseFloat(operant1) + parseFloat(operant2)
        break
      case "-":
        result = parseFloat(operant1) - parseFloat(operant2)
        break
      case "x":
        result = parseFloat(operant1) * parseFloat(operant2)
        break
      case "/":
        result = parseFloat(operant1) / parseFloat(operant2)
        break
    }
    if (result === Infinity) return "Error"
    return result
  }

  const [activeTheme, setActiveTheme] = useState(localStorage.getItem("theme"))
  if (window.matchMedia) {
    const preferColorScheme = window.matchMedia("(prefers-color-scheme: light)")

    const applyTheme = (n) => (document.body.className = `theme-${n}`)
    useEffect(() => {
      applyTheme(preferColorScheme.matches ? 2 : 1)
      preferColorScheme.addEventListener("change", ({ matches }) => {
        if (localStorage.getItem("theme")) return
        applyTheme(matches ? 2 : 1)
      })
    }, [])
    useEffect(() => {
      if (!activeTheme) return
      applyTheme(activeTheme)
      localStorage.setItem("theme", activeTheme)
    }, [activeTheme])
  }

  function formatNumberString(input) {
    // console.log(input)
    if (isNaN(Number(input))) return "0"
    let unformatedInput = String(input)
    if (!unformatedInput) return "0"

    let isDecimal = unformatedInput.includes(".")

    if (screenClearRequiredRef.current) {
      // Format result only
      if (isDecimal && unformatedInput.split(".")[1].length > 8) {
        // Shorten long decimals
        unformatedInput = String(Number(unformatedInput).toFixed(8))
      }

      if (unformatedInput.replace(".", "").replace("-", "").length > 9) {
        // Handle long numbers (scientific notation)
        const exponential = Number(unformatedInput).toExponential(6)
        const formatedExponential = exponential.replace(/(\.0*|0+)(?=e)/, "")

        return formatedExponential
      }
    }

    let formatedValue = ""
    let splittedValue = unformatedInput.split(".")
    let intPart = splittedValue[0]
    let decimalPart = splittedValue[1]

    let isNegative = intPart[0] === "-"
    if (isNegative) intPart = intPart.slice(1)
    const offset = intPart.length % 3
    const groupedNumbers = intPart.slice(offset).match(/\d{3}/g)?.join(",")

    if (offset > 0 && groupedNumbers) {
      formatedValue = `${intPart.slice(0, offset)},${groupedNumbers}`
    } else {
      formatedValue = groupedNumbers || intPart
    }

    if (isNegative) formatedValue = "-" + formatedValue
    if (isDecimal) formatedValue += "." + decimalPart

    return formatedValue || "0"
  }

  return (
    <main className="main-container">
      <div className="calc">
        <header className="calc-header">
          <h1 className="calc-logo">calc</h1>
          <div className="theme-toggle-container">
            <span className="theme-toggle-label">theme</span>
            <div className="theme-toggle">
              <div className="theme-toggle__count">
                <span onClick={() => setActiveTheme(1)}>1</span>
                <span onClick={() => setActiveTheme(2)}>2</span>
                <span onClick={() => setActiveTheme(3)}>3</span>
              </div>
              <div className="theme-toggle__switch"></div>
            </div>
          </div>
        </header>
        <div className="calc-screen">
          <div
            className="calc-screen__toggle-negative-btn"
            onClick={() => {
              console.log(screenValue)
              if (highlightOperatorKey && screenValue !== "-0") {
                setScreenValue("-0")
              } else if (screenValue === "0.") {
                setScreenValue("-0.")
              } else if (screenValue === "-0.") {
                setScreenValue("0.")
              } else {
                let nValue

                if (screenValue === "0") nValue = "-0"
                else if (screenValue === "-0") nValue = "0"
                else nValue = Number(screenValue) * -1

                setScreenValue(nValue)
              }
            }}
          >
            <ToggleNegativityIcon />
          </div>
          <span className="calc-screen__value">{formatNumberString(screenValue)}</span>
        </div>
        <Keypad
          screenValue={screenValue}
          setScreenValue={setScreenValue}
          activeOperator={activeOperator}
          setActiveOperator={setActiveOperator}
          highlightOperatorKey={highlightOperatorKey}
          setHighlightOperatorKey={setHighlightOperatorKey}
          firstOperantRef={firstOperantRef}
          heldOperantRef={heldOperantRef}
          heldOperatorRef={heldOperatorRef}
          screenClearRequiredRef={screenClearRequiredRef}
          reset={reset}
          calculateResult={calculateResult}
        />
      </div>

      <div className="attribution">
        <span>
          Challenge by&nbsp;
          <a href="https://www.frontendmentor.io/challenges/calculator-app-9lteq5N29" target="_blank">
            Frontend Mentor
          </a>
          .&nbsp;
        </span>
        <span>
          Coded by <a href="https://www.frontendmentor.io/profile/Dev-MV6">Dev-MV6</a>.
        </span>
      </div>
    </main>
  )
}

export default App
