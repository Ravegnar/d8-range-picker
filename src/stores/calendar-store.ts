import {defineStore} from "pinia"
import dayjs, {Dayjs} from "dayjs"
import {i18n} from "../lib/i18n"
import {NavigationDirection, SupportedLanguages} from "../enums/calendar-enums.ts"
import type {DateRange, FavoriteDates} from "../types/calendar-types.ts"
import {DEFAULT_MAX_NIGHT_COUNT, TODAY, TOTAL_DAYS_IN_GRID} from "../constants/calendar-constants.ts"

export const useCalendarStore = defineStore("calendar", {
   state: () => ({
      currentMonth: TODAY,
      favoriteDates: [] as FavoriteDates[],
      hoveredDate: undefined as Dayjs | undefined,
      language: SupportedLanguages.Cs,
      maxNightCount: DEFAULT_MAX_NIGHT_COUNT,
      minDate: TODAY,
      nextMonth: TODAY.add(1, "month"),
      selectedDate: undefined as Dayjs | undefined,
      selectedRange: undefined as DateRange | undefined,
   }),
   actions: {
      changeMonth(direction: NavigationDirection) {
         this.currentMonth = direction === NavigationDirection.Prev
            ? this.currentMonth.subtract(1, "month")
            : this.currentMonth.add(1, "month")

         this.nextMonth = this.currentMonth.add(1, "month")
      },
      selectFullMonth(month: Dayjs) {
         const firstDayOfMonth = month.startOf("month")

         this.selectedRange = {
            from: firstDayOfMonth.isBefore(this.minDate, "day") ? this.minDate : firstDayOfMonth,
            to: month.endOf("month")
         }
      },
      selectFavoriteDate(range: DateRange) {
         this.selectedRange = range
         this.currentMonth = range.from
         this.nextMonth = this.currentMonth.add(1, "month")
      },
      setFavoriteDates(favoritesDates: FavoriteDates[]) {
         this.favoriteDates = favoritesDates
      },
      setMaxNightCount(nightRange: number) {
         this.maxNightCount = nightRange
      },
      setMinDate(date: Dayjs) {
         this.minDate = date
      },
      setLanguage(language: SupportedLanguages) {
         this.language = language
         i18n.global.locale = language
      },
      setSelectedRange(range: { from: | string, to: | string }) {
         if (dayjs(range.from).isValid() && dayjs(range.to).isValid()) {
            this.selectedRange = { from: dayjs(range.from), to: dayjs(range.to) }
         }
      },
      setSelectedDate(date: Dayjs) {
         if (this.selectedDate) {
            const isReverse = this.selectedDate > date

            let from = isReverse ? date : this.selectedDate
            let to = isReverse ? this.selectedDate : date

            if (to.diff(from, "day") + 1 > this.maxNightCount) {
               if (isReverse) {
                  to = from.add(this.maxNightCount - 1, "day")
               } else {
                  from = to.add(-this.maxNightCount, "day")
               }
            }

            this.selectedRange = {from, to}
            this.selectedDate = undefined
         } else {
            this.selectedRange = undefined
            this.selectedDate = date
         }
      },
      setHoveredDate(date?: Dayjs) {
         if (!this.selectedDate || this.selectedRange) {
            return
         }

         this.hoveredDate = date
      },
      isHoveredDateInRange(date: Dayjs): boolean {
         if (!this.selectedDate || !this.hoveredDate) {
            return false
         }

         const isReverse = this.selectedDate > this.hoveredDate
         const from = isReverse ? this.selectedDate : this.hoveredDate
         const to = isReverse ? this.hoveredDate : this.selectedDate

         return date.isBetween(from, to, "day", "[]")
      },
   },
   getters: {
      isDateInRange: (state) => (date: Dayjs) => {
         const { selectedRange } = state
         return selectedRange ? date.isBetween(selectedRange.from, selectedRange.to, "day", "[]") : false
      },
      isDateSelected: (state) => (date: Dayjs) => (
         state.selectedDate && date.isSame(state.selectedDate, "day")
      ),
      isDateStartOfRange: (state) => (date: Dayjs) => (
         state.selectedRange && date.isSame(state.selectedRange.from, "day")
      ),
      isDateEndOfRange: (state) => (date: Dayjs) => (
         state.selectedRange && date.isSame(state.selectedRange.to, "day")
      ),
      isRangeSelected: (state) => (range: DateRange) => (
         (
            state.selectedRange?.from.isSame(range.from, "day") &&
            state.selectedRange?.to.isSame(range.to, "day")
         ) ?? false
      ),
      getHoveredDateClass: (state) => (date: Dayjs) => {
         if (!state.selectedDate || !state.hoveredDate || !date.isSame(state.selectedDate, 'day')) {
            return ""
         }

         return state.hoveredDate.isBefore(state.selectedDate, "day") ? "before" : "after"
      },
      getDaysInMonthGrid: (state) => (month: Dayjs) => {
         const firstDayOfMonth = month.startOf("month")
         const startOfGrid = firstDayOfMonth.subtract(
            firstDayOfMonth.weekday() === 0 ? 6 : firstDayOfMonth.weekday(),
            "day"
         )

         return Array.from({length: TOTAL_DAYS_IN_GRID}).map((_, i) => {
            const currentDate = startOfGrid.add(i, "day")

            return {
               date: currentDate,
               isDisabled: !currentDate.isSame(month, "month") || currentDate.isBefore(state.minDate, "day"),
               isWeekend: currentDate.day() === 0 || currentDate.day() === 6
            }
         })
      }
   },
})