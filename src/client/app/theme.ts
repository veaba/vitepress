import { App, ComponentOptions, Ref } from 'vue'
// import { Router } from './router'
import { Router } from 'vue-router'

import { SiteData } from '../../../types/shared'

export interface EnhanceAppContext {
  app: App
  router: Router
  siteData: Ref<SiteData>
}

export interface Theme {
  Layout: ComponentOptions
  NotFound?: ComponentOptions
  enhanceApp?: (ctx: EnhanceAppContext) => void
}
