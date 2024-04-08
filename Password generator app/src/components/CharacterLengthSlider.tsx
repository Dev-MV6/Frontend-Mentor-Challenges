import { useEffect, useRef } from "preact/hooks"

interface CharacterLengthSliderProps {
  length: number
  minLenght: number
  maxLenght: number
  onUpdate: Function
}

export function CharacterLengthSlider({ length, onUpdate, minLenght, maxLenght }: CharacterLengthSliderProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(updateSliderStyle, [])
  function updateSliderStyle() {
    const inputEl = ref.current
    const val = parseInt(inputEl!.value)
    let percentage = ((val - minLenght) / (maxLenght - minLenght)) * 100
    inputEl!.style.backgroundSize = percentage + "% 100%"
  }

  function handleOnInput(e: InputEvent) {
    const target = e.target as HTMLInputElement
    const val = parseInt(target.value)
    if (val < 1) target.value = "1"
    updateSliderStyle()
    onUpdate(target.value)
  }

  return (
    <input
      ref={ref}
      type="range"
      class="character-length-slider"
      name="character-length"
      min={minLenght}
      max={maxLenght}
      value={length}
      onInput={handleOnInput}
      step="1"
    />
  )
}
