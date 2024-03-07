import { useEffect, useRef } from "react"

const DestinationsBackground = () => {
  const canvasRef = useRef(null)
  const intervalRef = useRef()

  function setupCanvas() {
    clearInterval(intervalRef.current) // Make sure only one interval is running

    const canvas = canvasRef.current
    var ctx = canvas.getContext("2d")

    const stars = new Array()

    class Star {
      constructor() {
        this.c = ["#F5E8D6", "#E6CDA8", "#8B9CB6", "#AAAAAA"][Math.round(Math.random() * 3)]
        this.restart()
        this.r = Math.random() * this.maxR
      }

      restart() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.r = 0
        this.maxR = Math.random() * (Math.random() < 0.8 ? 0.8 : 2)
        this.dX = Math.round(Math.random()) ? -1 : 1
        this.dY = Math.round(Math.random()) ? -1 : 1
        this.stage = "fade-in"
      }
    }

    function setup() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const numStars = Math.min(2000, Math.round((window.innerWidth * window.innerHeight) / 1000))

      for (let i = 0; i < numStars; i++) {
        stars.push(new Star())
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI, false)
        ctx.fillStyle = star.c
        ctx.fill()
      })
    }

    function update() {
      stars.forEach((star) => {
        star.r += 0.01 * (star.stage === "fade-in" ? 1 : -1)

        if (star.r > star.maxR) {
          star.stage = "fade-out"
        }

        star.x += 0.08 * star.dX
        star.y += 0.08 * star.dY
        if (star.r < 0 || star.x > canvas.width || star.y > canvas.height) {
          star.restart()
        }
      })
    }

    function animate() {
      update()
      draw()
    }

    setup()
    intervalRef.current = setInterval(animate, 1000 / 20)
  }

  useEffect(() => {
    setupCanvas()
    window.onresize = setupCanvas
    return () => (window.onresize = null)
  }, [])

  return (
    <div className="background-canvas-wrapper">
      <canvas ref={canvasRef} width="500px" height="300px"></canvas>
    </div>
  )
}

export default DestinationsBackground
