import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const stars = ref(0)
  const level = ref('easy')        // 'easy' ili 'hard'
  const currentGame = ref(null)

  const maxStars = computed(() => 5)

  const addStar = () => {
    if (stars.value < maxStars.value) {
      stars.value++
    }
  }

  const resetStars = () => {
    stars.value = 0
  }

  const setLevel = (newLevel) => {
    level.value = newLevel
  }

  const setCurrentGame = (game) => {
    currentGame.value = game
  }

  return {
    stars,
    level,
    currentGame,
    maxStars,
    addStar,
    resetStars,
    setLevel,
    setCurrentGame
  }
})
