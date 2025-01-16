<script setup lang="ts">
   import {Dayjs} from "dayjs"
   import {useCalendarStore} from "../stores/calendar-store.ts"
   import {defineProps, computed} from "vue"
   import {CalendarNavigationType, NavigationDirection} from "../enums/calendar-enums.ts"
   import {TODAY} from "../constants/calendar-constants.ts"

   interface Props {
      month: Dayjs
      type?: CalendarNavigationType
   }

   const {month, type} = defineProps<Props>()

   const store = useCalendarStore()

   const isPrevBtnDisabled = computed(() => month.isSame(TODAY, "month"))
   const daysInMonthGrid = computed(() => store.getDaysInMonthGrid(month))
   const language = computed(() => store.language)
   const weekDays = computed(() => [...Array(7)].map((_, i) => TODAY.locale(language.value).startOf("week").add(i, "day").format("dd")))
</script>

<template>
   <div class="flex flex-col gap-2 max-sm:col-span-2">
      <div class="relative h-11 flex justify-center items-center">
         <button
             :disabled="isPrevBtnDisabled"
             @click="store.changeMonth(NavigationDirection.Prev)"
             class="navigation-btn left-0"
             v-if="type === CalendarNavigationType.Left"
         >
            <span class="sr-only">{{ $t("nextMonth") }}</span>
            <svg fill="currentColor" height="32" id="chevron-left" viewBox="0 0 32 32" width="32"
                 xmlns="http://www.w3.org/2000/svg">
               <path d="M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z"/>
            </svg>
         </button>
         <button
             @click="store.selectFullMonth(month)"
             class="font-semibold uppercase text-sky-500 hover:text-sky-800"
         >
            {{ month.format("MMMM YYYY") }}
            <span class="sr-only">{{ $t("selectFullMonth") }}</span>
         </button>
         <button
             @click="store.changeMonth(NavigationDirection.Next)"
             class="navigation-btn right-0"
             v-if="type === CalendarNavigationType.Right"
         >
            <span class="sr-only">{{ $t("prevMonth") }}</span>
            <svg fill="currentColor" height="32" id="chevron-right" viewBox="0 0 32 32" width="32"
                 xmlns="http://www.w3.org/2000/svg">
               <path d="M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z"/>
            </svg>
         </button>
      </div>

      <div class="grid grid-cols-7 gap-2 text-center text-gray-400 font-semibold">
         <div v-for="(day, index) in weekDays" :key="index" class="first-letter:uppercase">{{ day }}</div>
      </div>

      <div class="grid grid-cols-7 text-center border-t">
         <button
             :class="[
                'date-btn',
                day.isWeekend ? 'weekend' : '',
                day.isDisabled
                    ? ''
                    : {
                        'hovered': store.isHoveredDateInRange(day.date),
                        'in-range': store.isDateInRange(day.date),
                        'range-end': store.isDateEndOfRange(day.date),
                        'range-start': store.isDateStartOfRange(day.date),
                        'selected': store.isDateSelected(day.date),
                    },
                !day.isDisabled && store.getHoveredDateClass(day.date),
            ]"
             :disabled="day.isDisabled"
             :key="day.date.format('L')"
             :title="store.selectedDate ? $t('selectToDate') : ''"
             v-for="(day) in daysInMonthGrid"
             @click="store.setSelectedDate(day.date)"
             @mouseenter="store.setHoveredDate(day.date)"
             @mouseleave="store.setHoveredDate()"
         >
            <span class="sr-only">{{ day.date.format("L") }}</span>
            {{ day.date.date() }}
         </button>
      </div>
   </div>
</template>

<style scoped lang="scss">
   .navigation-btn {
      @apply absolute px-2 py-1 text-sky-500 scale-[65%] hover:scale-75;

      &:disabled {
         @apply opacity-40 scale-[65%];
      }
   }

   .date-btn {
      @apply relative w-full h-9 border-[1px] border-white hover:bg-sky-200 overflow-x-hidden;

      &:disabled {
         @apply bg-white text-gray-300;
      }

      &.weekend {
         @apply font-bold;
      }

      &.hovered {
         @apply bg-sky-100;
      }

      &.selected {
         @apply bg-sky-500 text-white;

         &.after,
         &.before {
            @apply before:absolute before:size-2 before:bg-white before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45;
         }

         &.after:before {
            @apply left-0
         }

         &.before:before {
            @apply left-full
         }
      }

      &.in-range {
         @apply bg-sky-100;

         &.range-start,
         &.range-end {
            @apply bg-sky-500 text-white before:absolute before:size-2 before:bg-white before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45;
         }

         &.range-start:before {
            @apply left-0
         }

         &.range-end:before {
            @apply left-full
         }
      }
   }
</style>
