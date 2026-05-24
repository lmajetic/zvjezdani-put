<template>
  <q-page class="flex flex-center column q-pa-md results-page">
    <!-- Canvas za konfete (ispod sadržaja, ne blokira klikove) -->
    <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>

    <!-- Sadržaj -->
    <div class="big-star">
      <q-icon name="star" color="yellow" size="120px" />
    </div>
    <div class="text-h3 q-mt-md text-center">Bravo!</div>
    <div class="text-h5 q-mt-sm text-center">Sakupio/la si svih 5 zvjezdica!</div>
    <div class="q-mt-lg">
      <StarCounter :earned-stars="5" :total-stars="5" />
    </div>
    <div class="q-mt-xl q-gutter-y-md full-width flex flex-center column">
      <q-btn
        label="Igraj ponovo"
        color="blue-6"
        class="text-h5 q-py-lg"
        style="min-width: 280px"
        unelevated
        rounded
        @click="playAgain"
      />
      <q-btn
        label="Nova igra"
        color="teal-5"
        class="text-h5 q-py-lg"
        style="min-width: 280px"
        unelevated
        rounded
        @click="goToGames"
      />
    </div>
    <div class="q-mt-lg">
      <AudioButton text="Odlično! Sakupio si svih 5 zvjezdica!" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'src/stores/gameStore'
import StarCounter from 'components/StarCounter.vue'
import AudioButton from 'components/AudioButton.vue'

const router = useRouter()
const gameStore = useGameStore()

const confettiCanvas = ref(null)
let animationFrameId = null
let particles = []
const canvasWidth = window.innerWidth
const canvasHeight = window.innerHeight

// Konfeta (čestica)
class Particle {
  constructor() {
    this.reset()
  }
  reset() {
    // Nasumična pozicija iz rubova
    const edge = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    if (edge === 0) { // top
      this.x = Math.random() * canvasWidth
      this.y = -10
    } else if (edge === 1) { // right
      this.x = canvasWidth + 10
      this.y = Math.random() * canvasHeight
    } else if (edge === 2) { // bottom
      this.x = Math.random() * canvasWidth
      this.y = canvasHeight + 10
    } else { // left
      this.x = -10
      this.y = Math.random() * canvasHeight
    }
    // Nasumična brzina
    this.vx = (Math.random() - 0.5) * 4
    this.vy = Math.random() * -3 - 2 // većinom prema gore
    this.gravity = 0.05
    this.size = Math.random() * 6 + 4
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 10
    // Nasumična boja
    const colors = ['#FFC107', '#FF5722', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0']
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.life = 1
    this.decay = 0.005 + Math.random() * 0.01
  }
  update() {
    this.x += this.vx
    this.vy += this.gravity
    this.y += this.vy
    this.rotation += this.rotationSpeed
    this.life -= this.decay
    if (this.life <= 0) {
      this.reset()
    }
  }
  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.globalAlpha = this.life
    ctx.fillStyle = this.color
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    ctx.restore()
  }
}

// Inicijalizacija konfeta
const initConfetti = () => {
  const canvas = confettiCanvas.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')

  // Stvaranje čestica
  const particleCount = 100
  particles = Array.from({ length: particleCount }, () => new Particle())

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.update()
      p.draw(ctx)
    })
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
}

// Zaustavljanje animacije
const stopConfetti = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

onMounted(() => {
  initConfetti()
  // Automatski zaustavi konfete nakon 6 sekundi
  setTimeout(stopConfetti, 6000)
})

onUnmounted(() => {
  stopConfetti()
  particles = []
})

const playAgain = () => {
  gameStore.resetStars()
  if (gameStore.currentGame) {
    router.push({ name: gameStore.currentGame })
  } else {
    router.push({ name: 'games' })
  }
}

const goToGames = () => {
  gameStore.resetStars()
  router.push({ name: 'games' })
}
</script>

<style scoped>
.results-page {
  position: relative;
  overflow: hidden; /* da konfeti ne stvaraju scrollbar */
}

.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* klikovi prolaze kroz canvas */
  z-index: 1000; /* iznad sadržaja ali ne ometa interakciju */
}

.big-star {
  animation: pulse 1.5s infinite;
  z-index: 1; /* osigurava da je ispred canvas-a? Canvas je pointer-events:none pa nije bitno, ali bolje dodati */
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
