import "./style.css"
import App from "./App.vue"
import {createApp} from "vue"
import {createPinia} from "pinia"
import {i18n} from "./lib/i18n.ts"
import dayjs from "dayjs"
import "dayjs/locale/cs"
import "dayjs/locale/en"
import weekday from "dayjs/plugin/weekday"
import localizedFormat from "dayjs/plugin/localizedFormat"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(weekday)
dayjs.extend(localizedFormat)
dayjs.extend(isBetween)

createApp(App)
   .use(createPinia())
   .use(i18n)
   .mount("#app")
