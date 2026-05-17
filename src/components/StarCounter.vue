<template>
  <div class="star-counter">
    <q-icon
      v-for="i in totalStars"
      :key="i"
      :name="i <= earnedStars ? 'star' : 'star_border'"
      :color="i <= earnedStars ? 'yellow' : 'grey-5'"
      size="lg"
      class="q-mx-xs"
    />
  </div>
</template>

<script setup>
defineProps({
  earnedStars: { type: Number, default: 0 },
  totalStars: { type: Number, default: 5 }
})
</script>
