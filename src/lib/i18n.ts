import {createI18n} from "vue-i18n"
import {SupportedLanguages} from "../enums/calendar-enums.ts"

const messages = {
   en: {
      favoriteDates: "Favorite Dates",
      languageSwitcher: "Česky",
      nextMonth: "Next Month",
      prevMonth: "Previous Month",
      selectFromDate: "Select a date from",
      selectFullMonth: "Select the entire month",
      selectToDate: "Select a date to",
   },
   cs: {
      favoriteDates: "Oblíbené termíny",
      languageSwitcher: "English",
      nextMonth: "Další měsíc",
      prevMonth: "Předchozí měsíc",
      selectFromDate: "Vyberte datum od",
      selectFullMonth: "Označit celý měsíc",
      selectToDate: "Vyberte datum do",
   },
}

export const i18n = createI18n({
   locale: SupportedLanguages.Cs,
   fallbackLocale: SupportedLanguages.Cs,
   messages,
})
