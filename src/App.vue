<script setup lang="ts">
   import Calendars from "./components/Calendars.vue"
   import dayjs from "dayjs"
   import {SupportedLanguages} from "./enums/calendar-enums.ts"
   import {TODAY} from "./constants/calendar-constants.ts"

   // BE mock data
   const MIN_DAY_OFFSET = 0
   const MOCK_MIN_DATE = TODAY.add(MIN_DAY_OFFSET, "day").format("YYYY-MM-DD")

   const MOCK_BACKEND_DATA = {
      language: SupportedLanguages.Cs,
      maxNightCount: 30,
      minDate: MOCK_MIN_DATE,
      selectedRange: {
         from: undefined, //dayjs(MOCK_MIN_DATE).add(7, "day").format("YYYY-MM-DD"),
         to: undefined, //dayjs(MOCK_MIN_DATE).add(14, "day").format("YYYY-MM-DD"),
      },
      favoriteDates: [
         {
            from: dayjs(MOCK_MIN_DATE).format("YYYY-MM-DD"),
            to: dayjs(MOCK_MIN_DATE).add(14, "day").format("YYYY-MM-DD"),
            title: {cs: "Last-minute nabídka", en: "Last-minute offer"}
         },
         {
            from: "2025-04-01",
            to: "2025-04-20",
            title: {cs: "Velikonoční prázdniny", en: "Easter holidays"}
         },
         {
            from: "2025-12-20",
            to: "2025-12-30",
            title: {cs: "Vánoční prázdniny", en: "Christmas holidays"}
         },
         {
            from: "2029-08-29",
            to: "2029-08-29",
            title: { cs: "Příchod Skynetu - Den zúčtování", en: "Arrival of Skynet - Judgment Day"}
         },
         {
            from: "2061-07-26",
            to: "2061-07-30",
            title: { cs: "Halleyova kometa", en: "Halley's Comet" }
         },
         {
            from: "2077-05-23",
            to: "2077-05-27",
            title: { cs: "100. výročí Star Wars", en: "100th Anniversary of Star Wars" }
         }
      ]
   }
</script>

<template>
   <Calendars
       :favorite-dates="MOCK_BACKEND_DATA.favoriteDates"
       :language="MOCK_BACKEND_DATA.language"
       :max-night-count="MOCK_BACKEND_DATA.maxNightCount"
       :min-date="MOCK_BACKEND_DATA.minDate"
       :selected-range="MOCK_BACKEND_DATA.selectedRange"
   />
</template>

