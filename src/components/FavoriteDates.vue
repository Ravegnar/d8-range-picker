<script setup lang="ts">
   import {computed} from "vue"
   import {useCalendarStore} from "../stores/calendar-store.ts"

   const store = useCalendarStore()

   const favoriteDates = computed(() => store.favoriteDates)
   const language = computed(() => store.language)
</script>

<template>
   <div class="mt-2 max-lg:col-span-2 max-sm:row-start-1">
      <h2 class="text-lg font-semibold mb-2">{{ $t("favoriteDates") }}</h2>
      <div class="grid max-sm:grid-cols-1 max-lg:grid-cols-[auto_1fr] gap-2">
         <label
             v-for="(favoriteDate, index) in favoriteDates"
             :key="index"
             :for="`favorite-date-${index}`"
             class="min-w-72 flex gap-x-2 bg-sky-100 px-2 py-1 mr-auto rounded-md cursor-pointer"
         >
            <input
                type="radio"
                :id="`favorite-date-${index}`"
                :checked="store.isRangeSelected(favoriteDate)"
                @change="store.selectFavoriteDate(favoriteDate)"
                class="mt-[2px] cursor-pointer"
            />
            {{ favoriteDate.title[language] }}
         </label>
      </div>
   </div>
</template>
