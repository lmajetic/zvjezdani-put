<template>
  <q-page class="flex flex-center column q-pa-md react-page">
    <!-- Zvučna uputa -->
    <div class="q-mb-lg">
      <AudioButton text="Klikni samo životinje!" />
    </div>

    <!-- Trenutni predmet -->
    <div v-if="currentItem" class="current-item text-center q-mb-lg">
      <q-img
        :src="currentItem.image"
        width="200px"
        height="200px"
        style="border-radius: 20px"
        class="q-mb-md"
      />
      <div class="text-h4">{{ currentItem.name }}</div>
      <!-- Vizualna natuknica: životinja ili ne? (ne prikazujemo tekst, ali možemo kasnije) -->
    </div>

    <!-- Gumb za klik -->
    <div class="q-mb-md">
      <q-btn
        :label="buttonLabel"
        :color="buttonColor"
        size="xl"
        class="react-btn text-h5"
        unelevated
        rounded
        :disabled="isLocked"
        @click="handleClick"
      />
    </div>

    <!-- Zvjezdice -->
    <StarCounter :earned-stars="gameStore.stars" :total-stars="5" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from 'src/stores/gameStore'
import AudioButton from 'components/AudioButton.vue'
import StarCounter from 'components/StarCounter.vue'

const router = useRouter()
const gameStore = useGameStore()

// Svi predmeti (slike moraju biti u public)
const allItems = [
  { name: 'Pas', image: 'animals/dog.jpg', isAnimal: true },
  { name: 'Auto', image: 'objects/car.jpg', isAnimal: false },
  { name: 'Mačka', image: 'animals/cat.jpg', isAnimal: true },
  { name: 'Kuća', image: 'objects/house.jpg', isAnimal: false },
  { name: 'Lopta', image: 'objects/ball.jpg', isAnimal: false },
  { name: 'Ptica', image: 'animals/bird.jpg', isAnimal: true }
]

// Brzina izmjene ovisno o razini
const intervalTime = computed(() => gameStore.level === 'hard' ? 1200 : 2000)

const currentItem = ref(null)
const isLocked = ref(false)   // zaključavanje gumba tijekom povratne informacije
const feedbackState = ref(null) // 'correct', 'wrong', null
let interval = null

// Nasumični odabir sljedećeg predmeta (osim istog ako je moguće)
const showRandomItem = () => {
  let newItem
  do {
    const randomIndex = Math.floor(Math.random() * allItems.length)
    newItem = allItems[randomIndex]
  } while (allItems.length > 1 && newItem === currentItem.value)
  currentItem.value = newItem
  feedbackState.value = null
  isLocked.value = false
}

// Izgled gumba ovisno o stanju
const buttonLabel = computed(() => {
  if (feedbackState.value === 'correct') return 'TOČNO!'
  if (feedbackState.value === 'wrong') return 'NETOČNO'
  return 'KLIKNI AKO JE ŽIVOTINJA!'
})

const buttonColor = computed(() => {
  if (feedbackState.value === 'correct') return 'green'
  if (feedbackState.value === 'wrong') return 'red'
  return 'primary'
})

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

// Reakcija na klik
const handleClick = () => {
  if (isLocked.value || !currentItem.value) return

  isLocked.value = true

  if (currentItem.value.isAnimal) {
    feedbackState.value = 'correct'
    gameStore.addStar()
    playSound('correct')

    // Nakon 1 sekunde provjeri kraj igre ili nastavi
    setTimeout(() => {
      if (gameStore.stars >= 5) {
        // Zaustavi igru i idi na rezultate
        clearInterval(interval)
        gameStore.setCurrentGame('react-click')
        router.push({ name: 'results' })
      } else {
        showRandomItem() // prikaži novi predmet (i otključaj gumb)
      }
    }, 1000)
  } else {
    feedbackState.value = 'wrong'
    playSound('wrong')

    // Netočan odgovor: nakratko prikaži, pa automatski novi predmet
    setTimeout(() => {
      showRandomItem()
    }, 1000)
  }
}


// Pokretanje igre s prilagođenom brzinom
onMounted(() => {
  showRandomItem()
  interval = setInterval(() => {
    if (!isLocked.value) {
      showRandomItem()
    }
  }, intervalTime.value)
})

// Čišćenje intervala
onUnmounted(() => {
  clearInterval(interval)
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
