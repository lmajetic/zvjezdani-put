<template>
  <div class="what-is-missing-page">
    <AudioButton :text="'Zapamti ove predmete!'" class="q-mb-lg" />

    <!-- Faza 1: Prikaz svih predmeta -->
    <div v-if="phase === 'memorize'" class="row justify-center q-gutter-md">
      <q-card v-for="item in items" :key="item.id" class="item-card">
        <q-img :src="item.image" width="100px" />
        <q-card-section>{{ item.name }}</q-card-section>
      </q-card>
    </div>

    <!-- Faza 2: Odabir predmeta koji nedostaje -->
    <div v-if="phase === 'guess'">
      <div class="row justify-center q-gutter-md q-mb-lg">
        <q-card
          v-for="item in visibleItems"
          :key="item.id"
          class="item-card"
          :class="{ 'missing-placeholder': item.id === missingItem.id }"
        >
          <q-img v-if="item.id !== missingItem.id" :src="item.image" width="100px" />
          <div v-else class="question-mark text-h3">?</div>
          <q-card-section>{{ item.name }}</q-card-section>
        </q-card>
      </div>

      <!-- Ponuđeni odgovori -->
      <div class="row justify-center q-gutter-md">
        <GameButton
          v-for="option in options"
          :key="option.id"
          :label="option.name"
          :feedback="getFeedback(option.id)"
          @click="checkAnswer(option.id)"
        />
      </div>
    </div>

    <StarCounter :earned-stars="gameStore.stars" :total-stars="5" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useGameStore } from 'src/stores/gameStore'
// ... import komponenti

const gameStore = useGameStore()
const phase = ref('memorize')
const items = reactive([
  { id: 1, name: 'Pas', image: 'animals/dog.svg' },
  { id: 2, name: 'Mačka', image: 'animals/cat.svg' },
  { id: 3, name: 'Ptica', image: 'animals/bird.svg' },
  { id: 4, name: 'Riba', image: 'animals/fish.svg' }
])

const missingItem = ref(null)
const feedback = ref({})

// Nakon 3 sekunde prijeđi u fazu pogađanja
setTimeout(() => {
  const randomIndex = Math.floor(Math.random() * items.length)
  missingItem.value = items[randomIndex]
  phase.value = 'guess'
}, 3000)

const visibleItems = computed(() => items)

const options = computed(() => {
  // Ponudi sve predmete kao opcije
  return items
})

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

const checkAnswer = (id) => {
  if (id === missingItem.value.id) {
    feedback.value[id] = 'correct'
    gameStore.addStar()
    playSound('correct')
  } else {
    feedback.value[id] = 'wrong'
    playSound('wrong')
  }
}

const getFeedback = (id) => feedback.value[id] || null
</script>
