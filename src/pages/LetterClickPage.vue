<template>
  <div class="letter-click-page">
    <!-- Gumb za slušanje upute -->
    <div class="q-mb-lg">
      <AudioButton :text="'Klikni slovo ' + targetLetter" />
    </div>

    <!-- Veliko prikazano traženo slovo -->
    <div class="text-h3 q-mb-lg">{{ targetLetter }}</div>

    <!-- Ponuđena slova -->
    <div class="row justify-center q-gutter-md">
      <GameButton
        v-for="letter in letters"
        :key="letter"
        :label="letter"
        :feedback="getFeedback(letter)"
        @click="checkLetter(letter)"
      />
    </div>

    <!-- Zvjezdice -->
    <StarCounter :earned-stars="gameStore.stars" :total-stars="5" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from 'src/stores/gameStore'
import GameButton from 'components/GameButton.vue'
import StarCounter from 'components/StarCounter.vue'
import AudioButton from 'components/AudioButton.vue'

const gameStore = useGameStore()

// Random odabir ciljanog slova
const letters = ref(['A', 'B', 'C', 'D'])
const targetLetter = ref('A') // postavi random
const feedback = ref({})

// Random inicijalizacija
targetLetter.value = letters.value[Math.floor(Math.random() * letters.value.length)]

const checkLetter = (letter) => {
  if (letter === targetLetter.value) {
    feedback.value[letter] = 'correct'
    gameStore.addStar()
    playSound('correct')
  } else {
    feedback.value[letter] = 'wrong'
    playSound('wrong')
  }

  // Reset feedbacka nakon 1s i nova runda
  setTimeout(() => {
    feedback.value = {}
    targetLetter.value = letters.value[Math.floor(Math.random() * letters.value.length)]
  }, 1000)
}

const getFeedback = (letter) => feedback.value[letter] || null

const playSound = (type) => {
  // Jednostavni zvučni efekti koristeći Web Audio API
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
</script>
