import { useState, useCallback } from "preact/hooks"
import { ParameterSetup } from "./components/ParameterSetup"
import { Result } from "./components/Result"
import "./styles/App.scss"

export interface Parameters {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  [key: string]: boolean | number
}

export interface PasswordResult {
  result: string | null
  strength: "very-weak" | "weak" | "medium" | "strong" | null
}

const characters = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*",
}

export function App() {
  const defaultParameters: Parameters = {
    length: 10,
    includeUppercase: false,
    includeLowercase: false,
    includeNumbers: false,
    includeSymbols: false,
  }

  const [params, setParams] = useState<Parameters>(defaultParameters)
  const [passwordResult, setPasswordResult] = useState<PasswordResult>({ result: null, strength: null })

  const generatePassword = useCallback(
    (params: Parameters) => {
      let availableCharacters = ""
      if (params.includeUppercase) availableCharacters += characters.uppercase
      if (params.includeLowercase) availableCharacters += characters.lowercase
      if (params.includeNumbers) availableCharacters += characters.numbers
      if (params.includeSymbols) availableCharacters += characters.symbols

      let generatedPassword = ""
      for (let i = 0; i < params.length; i++) {
        // Select random character from character list
        const randomChar = availableCharacters.charAt(Math.floor(Math.random() * availableCharacters.length))
        generatedPassword += randomChar
      }

      let result: PasswordResult = {
        result: generatedPassword,
        strength: "very-weak",
      }

      // Calculate entropy
      const h = Math.log2(availableCharacters.length ** params.length)

      // Password strength
      if (h > 100) result.strength = "strong"
      else if (h > 60) result.strength = "medium"
      else if (h > 36) result.strength = "weak"

      // Update UI with generated password
      setPasswordResult(result)
    },
    [params]
  )

  return (
    <main class="main-container">
      <div class="password-generator">
        <h1 class="password-generator__title">Password Generator</h1>
        <Result result={passwordResult.result} />
        <ParameterSetup
          params={params}
          setParams={setParams}
          generatePassword={generatePassword}
          passwordResult={passwordResult}
        />
        <div class="attribution">
          <div style="display: inline-block">
            Challenge by{" "}
            <a href="https://www.frontendmentor.io/challenges/password-generator-app-Mr8CLycqjh" target="_blank">
              Frontend Mentor
            </a>
            .&ensp;
          </div>
          <div style="display: inline-block">
            Coded by <a href="https://www.frontendmentor.io/profile/Dev-MV6">Dev-MV6</a>.
          </div>
        </div>
      </div>
    </main>
  )
}
