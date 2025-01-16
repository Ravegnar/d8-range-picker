import type {SupportedLanguages} from "../enums/calendar-enums.ts"
import {Dayjs} from "dayjs"

export type DateRange = {
   from: Dayjs
   to: Dayjs
}

export type FavoriteDatesTitles = Record<SupportedLanguages, string>

export interface FavoriteDates extends DateRange {
   title: FavoriteDatesTitles
}