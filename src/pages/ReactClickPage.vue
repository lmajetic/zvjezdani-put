<template>
  <div class="react-click-page">
    <AudioButton :text="'Klikni samo životinje!'" class="q-mb-lg" />

    <div v-if="currentItem" class="current-item text-center q-mb-lg">
      <q-img :src="currentItem.image" width="200px" class="q-mb-md" />
      <div class="text-h4">{{ currentItem.name }}</div>
    </div>

    <q-btn
      label="KLIKNI AKO JE ŽIVOTINJA!"
      color="primary"
      size="xl"
      @click="handleClick"
      class="react-btn"
    />

    <StarCounter :earned-stars="gameStore.stars" :total-stars="5" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from 'src/stores/gameStore'

const gameStore = useGameStore()

const allItems = [
  { name: 'Pas', image: 'animals/dog.svg', isAnimal: true },
  { name: 'Auto', image: 'objects/car.svg', isAnimal: false },
  { name: 'Mačka', image: 'animals/cat.svg', isAnimal: true },
  { name: 'Kuća', image: 'objects/house.svg', isAnimal: false },
  { name: 'Lopta', image: 'objects/ball.svg', isAnimal: false },
  { name: 'Ptica', image: 'animals/bird.svg', isAnimal: true }
]

const currentItem = ref(null)
let interval = null

const showRandomItem = () => {
  const randomIndex = Math.floor(Math.random() * allItems.length)
  currentItem.value = allItems[randomIndex]
}

onMounted(() => {
  showRandomItem()
  interval = setInterval(showRandomItem, 2000) // novi predmet svake 2 sekunde
})

onUnmounted(() => {
  clearInterval(interval)
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

const handleClick = () => {
  if (currentItem.value.isAnimal) {
    gameStore.addStar()
    playSound('correct')
  } else {
    playSound('wrong')
  }
}
</script>
