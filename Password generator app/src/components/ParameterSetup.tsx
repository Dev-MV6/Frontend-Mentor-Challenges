import "../styles/ParamaterSetup.scss"
import classnames from "classnames"
import { Parameters, PasswordResult } from "../App"
import { CharacterLengthSlider } from "./CharacterLengthSlider"

interface ParamaterSetupProps {
  params: Parameters
  setParams: Function
  generatePassword: Function
  passwordResult: PasswordResult
}

export function ParameterSetup({ params, setParams, generatePassword, passwordResult }: ParamaterSetupProps) {
  function toggleParam(key: string) {
    setParams((params: Parameters) => ({ ...params, [key]: !params[key] }))
  }

  function updateLengthParam(length: number) {
    setParams((params: Parameters) => ({ ...params, length: length }))
  }

  let validParams = false
  for (let key in params) {
    if (params.length < 1) {
      validParams = false
      break
    }

    if (key.includes("include") && params[key]) {
      // At least one checkbox must be checked
      validParams = true
      break
    }
  }

  return (
    <div class="parameters-setup">
      <div class="character-length-wrapper">
        <div class="character-length-container">
          <span>Character Length</span>
          <span class="character-length">{params.length}</span>
        </div>
        <CharacterLengthSlider length={params.length} onUpdate={updateLengthParam} minLenght={0} maxLenght={20} />
      </div>

      <div class="check-parameters-container">
        <div class="check-parameter" onClick={() => toggleParam("includeUppercase")}>
          <div
            role="checkbox"
            aria-checked={params.includeUppercase}
            tabIndex={0}
            onKeyDown={(e) => e.code === "Space" && toggleParam("includeUppercase")}
            class={classnames("checkbox", { "checkbox--checked": params.includeUppercase })}
          ></div>
          <span class="check-parameter__label">Include Uppercase Letters</span>
        </div>
        <div class="check-parameter" onClick={() => toggleParam("includeLowercase")}>
          <div
            role="checkbox"
            aria-checked={params.includeLowercase}
            tabIndex={0}
            onKeyDown={(e) => e.code === "Space" && toggleParam("includeLowercase")}
            class={classnames("checkbox", { "checkbox--checked": params.includeLowercase })}
          ></div>
          <span class="check-parameter__label">Include Lowercase Letters</span>
        </div>
        <div class="check-parameter" onClick={() => toggleParam("includeNumbers")}>
          <div
            role="checkbox"
            aria-checked={params.includeNumbers}
            tabIndex={0}
            onKeyDown={(e) => e.code === "Space" && toggleParam("includeNumbers")}
            class={classnames("checkbox", { "checkbox--checked": params.includeNumbers })}
          ></div>
          <span class="check-parameter__label">Include Numbers</span>
        </div>
        <div class="check-parameter" onClick={() => toggleParam("includeSymbols")}>
          <div
            role="checkbox"
            aria-checked={params.includeSymbols}
            tabIndex={0}
            onKeyDown={(e) => e.code === "Space" && toggleParam("includeSymbols")}
            class={classnames("checkbox", { "checkbox--checked": params.includeSymbols })}
          ></div>
          <span class="check-parameter__label">Include Symbols</span>
        </div>
      </div>

      <div class="password-strength-container">
        <span>Strength</span>
        <div class={`password-strength${passwordResult.strength ? ` password-strength--${passwordResult.strength}` : ""}`}>
          <div class="strength-bar"></div>
          <div class="strength-bar"></div>
          <div class="strength-bar"></div>
          <div class="strength-bar"></div>
        </div>
      </div>

      <button class="generate-button" onClick={() => generatePassword(params)} disabled={!validParams}>
        Generate
        <svg class="arrow-left-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
          <path fill="currentColor" d="m5.106 12 6-6-6-6-1.265 1.265 3.841 3.84H.001v1.79h7.681l-3.841 3.84z"></path>
        </svg>
      </button>
    </div>
  )
}
