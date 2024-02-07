import { render, fireEvent, getByText } from "@testing-library/react"
import App from "../src/App"

const validOperators = ["+", "-", "*", "/"]

function calculateRelativeError(expected, received) {
  return Math.abs((expected - received) / Math.abs(expected)) * 100
}

function operationsTest(operations) {
  operations.forEach((operation) => {
    const operationExpectedResult = eval(operation)
    test(`${operation} = ${operationExpectedResult}`, () => {
      const app = render(<App />)
      const screenValueContainer = app.container.querySelector(".calc-screen__value")
      const keypadContainer = app.container.querySelector(".keypad")
      operation.split("").forEach((x) => {
        const key = getByText(keypadContainer, x === "*" ? "x" : x).parentElement
        fireEvent.click(key)
        if (validOperators.includes(x)) {
          // if pressed key is an operator expect it to get hightlighted
          expect(key.classList.contains("key-operator--active")).toBeTruthy()
        } else {
          // if pressed key is a digit expect its value to show up on the screen
          expect(screenValueContainer.textContent.slice(-1)).toBe(x)
        }
      })

      // on equal key press the final result is shown on the screen
      fireEvent.click(app.getByText("=").parentElement)
      const unformatedResult = parseFloat(screenValueContainer.textContent.replaceAll(",", ""))
      const relativeError = calculateRelativeError(operationExpectedResult, unformatedResult)
      const maxErrorRateTolerated = 2
      if (relativeError < maxErrorRateTolerated) {
        expect(relativeError).toBeLessThan(maxErrorRateTolerated)
      } else {
        expect(unformatedResult).toBe(operationExpectedResult)
      }
    })
  })
}

describe("can perform arithmetic operations with operators of the same type", () => {
  const operations = [
    "-71189+234+5617+890",
    "-12634-567-8690-432",
    "1253+456-78+90",
    "-234*678*901*345",
    "5637/901/2364/678",
    "5677*234/891*1623",
    "-9687+6354-321+100",
    "456-123+789-234",
    "-876-543-2110-7839",
    "321*654*987*432",
  ]

  operationsTest(operations)
})

describe("can perform arithmetic operations mixing operators of different types", () => {
  const operations = [
    "7389+234*2-567/13+890",
    "1234-56357*2+890/2-432",
    "-123+456*2-78/2+90",
    "234*678/2-901*345",
    "-567/35*901-234/12/678",
    "567*234/891-1213*2",
    "100/2*44+300-5703",
    "-8007/44*2-1030+1530",
    "60470/2*43-2030+50",
    "1000/5*2-2300/2+300",
  ]

  operationsTest(operations)
})

describe("can perform arithmetic operations with decimals", () => {
  const operations = [
    "7389.567+234*2.789-567/13.456+890.1234",
    "1234.5678-56357*2.345+890/2.678-432.9012",
    "123.456+456*2.789-78/2.345+90.6789",
    "234*678.567/2.345-901*345.1234",
    "567/35*901-234/12.345/678.567",
    "567*234.567/891-1213*2.345",
    "100/2.345*44.789+300-5703.4567",
    "8007.123/44*2.345-1030.567+1530.6789",
    "60470/2.345*43.678-2030.567+50.1234",
    "1000/5.678*2.345-2300/2.345+300.5678",
  ]

  operationsTest(operations)
})

describe("can perform arithmetic operations with long numbers", () => {
  const operations = [
    "73829+234*2-53467/13+890*9134219",
    "1912234-564357*2+890/2-432*293399",
    "-1291323+456*2-78/2+90*99992199",
    "239124*678/2-901*345*999123399",
    "-567/339125*901-234/12/678*99931239",
    "591267*234/891-1213*2*5912339",
    "1091220/2*44+300-5703*7992239",
    "-8007/44*2-1030+1530*699123399",
    "604710/2*43-2030+50*999123399*173123",
    "1091200/5*2-2300/2+300*956122279",
  ]

  operationsTest(operations)
})
