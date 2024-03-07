import { useEffect, useRef } from "react"

const TechnologiesBackground = () => {
  const canvasRef = useRef(null)
  const intervalRef = useRef()

  function setupCanvas() {
    clearInterval(intervalRef.current) // Make sure only one interval is running

    const canvas = canvasRef.current
    var ctx = canvas.getContext("2d")

    const circles = new Array()

    class Circle {
      constructor(r, c) {
        this.x = window.innerWidth * 0.35
        this.y = -40
        this.r = r
        this.speed = 0.2 + this.r / 10000
        this.startAngle = Math.random() * (Math.PI / 2)
        this.endAngle = Math.PI * 2
        this.c = c || ["#434343", "#21273F", "#454C69", "#303a4c"][Math.round(Math.random() * 3)]
      }

      update() {
        this.startAngle += (this.speed * Math.PI) / 180
        this.endAngle = this.startAngle + Math.PI * 2
      }
    }

    function setup() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const numCircles = 30

      for (let i = 0; i < numCircles; i++) {
        const offset = 90
        circles.push(new Circle(offset + 30 + i * 100, i === 0 ? "#21273F" : null))
        circles.push(new Circle(offset + i * 51.3, "#1D202F"))
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      circles.forEach((circle) => {
        ctx.beginPath()
        ctx.setLineDash([circle.r / 2.5, circle.r / 3.2])
        ctx.arc(circle.x, circle.y, circle.r, circle.startAngle, circle.endAngle)
        ctx.strokeStyle = circle.c
        ctx.stroke()
      })
    }

    function update() {
      circles.forEach((circle) => circle.update())
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

export default TechnologiesBackground
