<template>
  <q-btn
    :label="label"
    :color="feedbackColor || 'primary'"
    class="game-btn text-h5"
    :class="{ 'animate__animated animate__pulse': pulse }"
    @click="$emit('click')"
    unelevated
    rounded
    size="xl"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  pulse: Boolean,
  feedback: String // 'correct', 'wrong', null
})

const feedbackColor = computed(() => {
  if (props.feedback === 'correct') return 'green'
  if (props.feedback === 'wrong') return 'red'
  return null
})

defineEmits(['click'])
</script>

<style scoped>
.game-btn {
  font-size: 2rem;
  min-width: 120px;
  min-height: 100px;
  margin: 10px;
  transition: transform 0.2s;
}
.game-btn:hover {
  transform: scale(1.05);
}
</style>
