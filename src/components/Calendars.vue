<script setup lang="ts">
   import dayjs, {Dayjs} from "dayjs"
   import {useCalendarStore} from "../stores/calendar-store.ts"
   import {computed, onMounted} from "vue"
   import Calendar from "./Calendar.vue"
   import {CalendarNavigationType, SupportedLanguages} from "../enums/calendar-enums.ts"
   import FavoriteDates from "./FavoriteDates.vue"
   import type {FavoriteDatesTitles} from "../types/calendar-types.ts"

   interface CalendarProps {
      favoriteDates: {
         from: string
         to: string
         title: FavoriteDatesTitles
      }[]
      language: SupportedLanguages
      maxNightCount: number
      minDate: string
      selectedRange?: { from?: string, to?: string }
   }

   const { favoriteDates, maxNightCount, minDate, selectedRange, ...props } = defineProps<CalendarProps>()

   const store = useCalendarStore()

   onMounted(() => {
      if (dayjs(minDate).isValid()) {
         store.setMinDate(dayjs(minDate))
      }
      if (selectedRange && selectedRange.from && selectedRange.to) {
         store.setSelectedRange({ from : selectedRange.from, to: selectedRange.to })
      }

      store.setLanguage(props.language)
      store.setMaxNightCount(maxNightCount)
      store.setFavoriteDates(
          favoriteDates.map((favorite) => ({
             ...favorite,
             from: dayjs(favorite.from),
             to: dayjs(favorite.to),
          }))
      )
   })

   const currentMonth = computed<Dayjs>(() => store.currentMonth)
   const nextMonth = computed<Dayjs>(() => store.nextMonth)
   const language = computed(() => store.language)
</script>

<template>
   <div class="relative grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] grid-cols-1 gap-4 max-w-screen-xl px-4 mx-auto pt-9 pb-8">
      <Calendar :month="currentMonth.locale(language)" :type="CalendarNavigationType.Left"/>
      <Calendar :month="nextMonth.locale(language)" :type="CalendarNavigationType.Right"/>
      <FavoriteDates v-if="store.favoriteDates.length"/>
      <button
          class="absolute top-1 right-4 w-20  py-px text-center text-white font-medium bg-sky-500"
          @click="store.setLanguage(language === SupportedLanguages.Cs ? SupportedLanguages.En : SupportedLanguages.Cs)"
      >
         {{ $t("languageSwitcher") }}
      </button>
   </div>
</template>
