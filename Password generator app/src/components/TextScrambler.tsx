import { useEffect, useRef } from "preact/hooks"
import { forwardRef } from "preact-forwardref"

class TextScrambleEffect {
  element: HTMLElement
  transitionChars: string
  currentFrame: number
  previousText: string
  queue: Array<{
    from: string
    to: string
    startFrame: number
    endFrame: number
    transitionChar?: string
  }>
  resolve!: Function
  frameReqId!: number

  constructor(element: HTMLElement, transitionChars: string, initialText: string) {
    this.element = element
    this.transitionChars = transitionChars
    this.currentFrame = 0
    this.previousText = initialText
    this.queue = []
    this.update = this.update.bind(this)
  }

  setText(text: string) {
    const queueLength = Math.max(this.previousText.length, text.length)
    const promise = new Promise((resolve) => (this.resolve = resolve))
    this.queue = []
    for (let pos = 0; pos < queueLength; pos++) {
      const from = this.previousText[pos] || ""
      const to = text[pos] || ""
      // Random duration for each individual character transition
      const d = 30
      const startFrame = Math.floor(Math.random() * d) // Start character transition at random frame
      const endFrame = startFrame + Math.floor(Math.random() * d) // End character transition at random frame
      this.queue.push({ from, to, startFrame, endFrame })
    }
    cancelAnimationFrame(this.frameReqId)
    this.currentFrame = 0
    this.update()
    this.previousText = text
    return promise
  }

  update() {
    let output = ""
    let completedFrames = 0
    this.queue.forEach(({ from, to, startFrame, endFrame, transitionChar }, index) => {
      if (this.currentFrame >= endFrame) {
        // Character transition completed
        completedFrames++
        output += to
      } else if (this.currentFrame >= startFrame) {
        // Start character transition
        if (
          !transitionChar ||
          Math.random() < 0.4 // 40% chance
        ) {
          // Update transition character
          transitionChar = this.getRandomTransitionChar()
          this.queue[index].transitionChar = transitionChar
        }
        output += `<span class="tchar">${transitionChar}</span>`
      } else {
        // Wait for starting frame
        output += from
      }
    })
    this.element.innerHTML = output
    if (completedFrames === this.queue.length) {
      this.resolve()
    } else {
      this.frameReqId = requestAnimationFrame(this.update)
      this.currentFrame++
    }
  }

  getRandomTransitionChar() {
    return this.transitionChars[Math.floor(Math.random() * this.transitionChars.length)]
  }
}

interface TextScramblerProps {
  text: string
  classname: string
}

export const TextScrambler = forwardRef(({ text, classname }: TextScramblerProps, ref: any) => {
  const effectInstance = useRef<TextScrambleEffect>()

  useEffect(() => {
    if (!effectInstance.current) effectInstance.current = new TextScrambleEffect(ref.current, "!<>-_\\/[]{}—=+*^?#________", text)
    effectInstance.current.setText(text)
  }, [text])

  return (
    <span ref={ref} class={classname}>
      {text}
    </span>
  )
})
