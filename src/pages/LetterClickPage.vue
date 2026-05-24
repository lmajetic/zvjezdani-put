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
.react-page {
  background-color: #f5f5f5;
}

.item-name {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: bold;
}

.react-btn {
  font-size: clamp(1.5rem, 4vw, 3rem);
  min-width: 40vw;
  min-height: 10vh;
  margin-top: 2vh;
  transition: background-color 0.3s, transform 0.1s;
}
.react-btn:active {
  transform: scale(0.96);
}

/* Prebrisati fiksnu širinu slike, sad koristi .game-img */
.current-item .q-img {
  width: auto;
  height: auto;
  max-width: 40vw;
  max-height: 30vh;
}
</style>
