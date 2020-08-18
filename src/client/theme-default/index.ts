import './styles/vars.css'
import './styles/code.css'
import './styles/custom-blocks.css'

import './styles/index.styl'
import Layout from './layouts/Layout.vue'
import NotFound from './NotFound.vue'
import { Theme } from '../app/theme'

const theme: Theme = {
  Layout,
  NotFound
}

export default theme
