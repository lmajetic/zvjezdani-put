<template>
  <q-page class="flex flex-center column q-pa-md">
    <div class="q-mb-lg">
      <AudioButton
        :text="phase === 'memorize' ? 'Zapamti ove predmete!' : 'Koji je predmet nestao?'"
      />
    </div>

    <!-- Faza pamćenja -->
    <div v-if="phase === 'memorize'" class="memorize-phase">
      <div class="text-h5 q-mb-md">Zapamti!</div>
      <div class="row justify-center q-gutter-xl">
        <div v-for="item in items" :key="item.id" class="memory-item text-center">
          <q-img :src="item.image" width="150px" height="150px" style="border-radius: 20px" />
          <div class="text-h6 q-mt-sm">{{ item.name }}</div>
        </div>
      </div>
      <div class="text-subtitle1 q-mt-md">
        (nestat će za {{ memorizeTime / 1000 }} sekunde...)
      </div>
    </div>

    <!-- Faza pogađanja -->
    <div v-if="phase === 'guess'" class="guess-phase">
      <!-- Predmeti s rupom -->
      <div class="row justify-center q-gutter-xl q-mb-xl">
        <div
          v-for="item in items"
          :key="item.id"
          class="memory-item text-center"
          :class="{ 'missing-slot': item.id === missingItem.id }"
        >
          <q-img
            v-if="item.id !== missingItem.id"
            :src="item.image"
            width="150px"
            height="150px"
            style="border-radius: 20px"
          />
          <div v-else class="question-mark">?</div>
          <div class="text-h6 q-mt-sm">{{ item.name }}</div>
        </div>
      </div>

      <!-- Gumbi s odgovorima -->
      <div class="text-h5 q-mb-md">Koji je nestao?</div>
      <div class="row justify-center q-gutter-lg">
        <GameButton
          v-for="option in items"
          :key="option.id"
          :label="option.name"
          :feedback="feedback[option.id]"
          @click="checkAnswer(option.id)"
        />
      </div>
    </div>

    <div class="q-mt-xl">
      <StarCounter :earned-stars="gameStore.stars" :total-stars="5" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'src/stores/gameStore'
import GameButton from 'components/GameButton.vue'
import AudioButton from 'components/AudioButton.vue'
import StarCounter from 'components/StarCounter.vue'

const router = useRouter()
const gameStore = useGameStore()

// Svi mogući predmeti (slike u /public/animals/)
const allItemsList = [
  { id: 1, name: 'Pas', image: '/animals/dog.jpg' },
  { id: 2, name: 'Mačka', image: '/animals/cat.jpg' },
  { id: 3, name: 'Ptica', image: '/animals/bird.jpg' },
  { id: 4, name: 'Riba', image: '/animals/fish.jpg' },
  { id: 5, name: 'Zec', image: '/animals/rabbit.jpg' },
  { id: 6, name: 'Kornjača', image: '/animals/turtle.jpg' }
]

// Parametri ovisni o razini
const itemCount = computed(() => gameStore.level === 'hard' ? 5 : 4)
const memorizeTime = computed(() => gameStore.level === 'hard' ? 2000 : 3000)

// Trenutno odabrani predmeti (ref koji sigurno sadrži polje)
const items = ref([])

const phase = ref('memorize')
const missingItem = ref(null)
const feedback = ref({})

// Nasumičan odabir predmeta iz liste
const pickRandomItems = () => {
  const shuffled = [...allItemsList].sort(() => Math.random() - 0.5)
  items.value = shuffled.slice(0, itemCount.value)
}

// Zvučni efekti
const playSound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioCtx.createOscillator()
  oscillator.connect(audioCtx.destination)
  oscillator.frequency.value = type === 'correct' ? 800 : 300
  oscillator.type = type === 'correct' ? 'sine' : 'square'
  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 0.2)
}

// Pokretanje nove runde
const startNewRound = () => {
  feedback.value = {}
  pickRandomItems()
  // Osiguraj da imamo barem jedan predmet
  if (items.value.length === 0) return
  const randomIndex = Math.floor(Math.random() * items.value.length)
  missingItem.value = items.value[randomIndex]
  phase.value = 'memorize'
  setTimeout(() => {
    phase.value = 'guess'
  }, memorizeTime.value)
}

// Provjera odgovora
const checkAnswer = (id) => {
  if (feedback.value[id]) return // spriječi dvostruke klikove
  if (id === missingItem.value.id) {
    feedback.value[id] = 'correct'
    gameStore.addStar()
    playSound('correct')
    if (gameStore.stars >= 5) {
      gameStore.setCurrentGame('what-is-missing')
      setTimeout(() => router.push({ name: 'results' }), 1000)
      return
    }
    setTimeout(() => startNewRound(), 1500)
  } else {
    feedback.value[id] = 'wrong'
    playSound('wrong')
  }
}

// Inicijalizacija pri prvom učitavanju
onMounted(() => {
  startNewRound()
})
</script>

<style scoped>
.memory-item {
  transition: transform 0.3s;
}
.missing-slot {
  opacity: 0.6;
}
.question-mark {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  background: #eee;
  border-radius: 20px;
  border: 3px dashed #999;
}
</style>
