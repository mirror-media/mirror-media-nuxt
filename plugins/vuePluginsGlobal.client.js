import Vue from 'vue'
import GPTAD from './gpt-ad'
import { GPT_MODE } from '~/configs/config'

Vue.use(GPTAD, {
  adNetwork: '40175602',
  mode: GPT_MODE,
})
