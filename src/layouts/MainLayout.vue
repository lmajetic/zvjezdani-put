<template>
  <q-layout view="hHh lpR fFf">
    <!-- Gornja traka – samo naslov i gumb za početak -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-h4">
          Zvjezdani Put
        </q-toolbar-title>

        <q-btn
          v-if="$route.path !== '/'"
          flat
          round
          icon="home"
          @click="$router.push('/')"
        />
      </q-toolbar>
    </q-header>

    <!-- Glavni sadržaj -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Nema dodatne logike
</script>
