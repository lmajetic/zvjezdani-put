<template>
  <q-page class="flex flex-center column q-pa-md letter-page">
    <!-- Zvučna uputa -->
    <div class="q-mb-lg">
      <AudioButton :text="'Klikni slovo ' + targetLetter" />
    </div>

    <!-- Veliko traženo slovo s animacijom -->
    <div class="target-letter-container">
      <div class="target-letter text-bold">{{ targetLetter }}</div>
    </div>

    <!-- Uputa ispod slova -->
    <div class="text-h5 q-mt-sm q-mb-lg text-center">
      Pronađi ovo slovo!
    </div>

    <!-- Ponuđeni odgovori (gumbi) -->
    <div class="row justify-center q-gutter-lg q-mb-lg">
      <GameButton
        v-for="letter in letters"
        :key="letter"
        :label="letter"
        :feedback="feedback[letter]"
        @click="checkLetter(letter)"
        :disabled="isRoundLocked"
      />
    </div>

    <!-- Zvjezdice -->
    <StarCounter :earned-stars="gameStore.stars" :total-stars="5" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'src/stores/gameStore'
import GameButton from 'components/GameButton.vue'
import StarCounter from 'components/StarCounter.vue'
import AudioButton from 'components/AudioButton.vue'

const router = useRouter()
const gameStore = useGameStore()

const easyLetters = ['A', 'B', 'C', 'D']
const hardLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const letters = computed(() => {
  return gameStore.level === 'hard' ? hardLetters : easyLetters
})

const targetLetter = ref('A')
const feedback = ref({})
const isRoundLocked = ref(false)

const randomizeTarget = () => {
  const currentLetters = letters.value
  let newLetter
  do {
    const randomIndex = Math.floor(Math.random() * currentLetters.length)
    newLetter = currentLetters[randomIndex]
  } while (newLetter === targetLetter.value && currentLetters.length > 1)
  targetLetter.value = newLetter
}

const playSound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioCtx.createOscillator()
  oscillator.connect(audioCtx.destination)

  if (type === 'correct') {
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
  } else {
    oscillator.frequency.value = 300
    oscillator.type = 'square'
  }

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 0.2)
}

const checkLetter = (letter) => {
  if (isRoundLocked.value) return

  if (letter === targetLetter.value) {
    feedback.value[letter] = 'correct'
    gameStore.addStar()
    playSound('correct')
  } else {
    feedback.value[letter] = 'wrong'
    playSound('wrong')
  }

  isRoundLocked.value = true

  setTimeout(() => {
    feedback.value = {}
    isRoundLocked.value = false

    if (gameStore.stars >= 5) {
      gameStore.setCurrentGame('letter-click')
      router.push({ name: 'results' })
      return
    }

    randomizeTarget()
  }, 1000)
}

onMounted(() => {
  randomizeTarget()
})
</script>

<style scoped>
.letter-page {
  background-color: #f5f5f5; /* svijetla pozadina, visoki kontrast */
}

.target-letter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.target-letter {
  font-size: 7rem;
  font-weight: bold;
  color: #1976d2; /* primarna plava */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: letterPulse 2s infinite;
}

@keyframes letterPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
