import { createApp as createClientApp, createSSRApp, ref, readonly } from 'vue'
import { createRouter, RouterSymbol, useRoute } from './router'
import { useUpdateHead } from './composables/head'
import { pageDataSymbol } from './composables/pageData'
import { Content } from './components/Content'
import Debug from './components/Debug.vue'
import Theme from '/@theme/index'
import { inBrowser, pathToFile } from './utils'
import { useSiteDataByRoute } from './composables/siteDataByRoute'
import { siteDataRef } from './composables/siteData'
import OutboundLink from '../theme-default/components/icons/OutboundLink.vue'

const NotFound = Theme.NotFound || (() => '404 Not Found')

export function createApp() {
  // unlike site data which is static across all requests, page data is
  // distinct per-request.
  const pageDataRef = ref()

  if (import.meta.hot) {
    // hot reload pageData
    import.meta.hot!.on('vitepress:pageData', (data) => {
      if (
        data.path.replace(/(\bindex)?\.md$/, '') ===
        location.pathname.replace(/(\bindex)?\.html$/, '')
      ) {
        pageDataRef.value = data.pageData
      }
    })
  }

  let isInitialPageLoad = inBrowser
  let initialPath: string

  const router = createRouter((route) => {
    console.info('createRouter===>', route.path, route)
    let pagePath = pathToFile(route.path)

    console.info('createRouter pagePath===>', pagePath)

    if (isInitialPageLoad) {
      initialPath = pagePath
    }

    // use lean build if this is the initial page load or navigating back
    // to the initial loaded path (the static vnodes already adopted the
    // static content on that load so no need to re-fetch the page)
    if (isInitialPageLoad || initialPath === pagePath) {
      pagePath = pagePath.replace(/\.js$/, '.lean.js')
    }

    console.info('inBrowser===>', inBrowser)
    if (inBrowser) {
      isInitialPageLoad = false
      // in browser: native dynamic import
      return import(pagePath).then((page) => {
        if (page.__pageData) {
          pageDataRef.value = readonly(JSON.parse(page.__pageData))
        }
        console.info('page====>', page)
        return page.default
      })
    } else {
      // SSR, sync require
      const page = require(pagePath)
      pageDataRef.value = JSON.parse(page.__pageData)
      return page.default
    }
  }, NotFound)

  const app =
    process.env.NODE_ENV === 'production'
      ? createSSRApp(Theme.Layout)
      : createClientApp(Theme.Layout)

  app.provide(RouterSymbol, router)
  app.provide(pageDataSymbol, pageDataRef)

  app.component('Content', Content)
  app.component('OutboundLink', OutboundLink)
  app.component(
    'Debug',
    process.env.NODE_ENV === 'production' ? () => null : Debug
  )

  const siteDataByRouteRef = useSiteDataByRoute(router.route)

  if (inBrowser) {
    // dynamically update head tags
    useUpdateHead(pageDataRef, siteDataByRouteRef)
  }

  Object.defineProperties(app.config.globalProperties, {
    // $xx:{
    //   get(){
    //     return router
    //   }
    // },
    $localeConfig: {
      get() {
        const { locales = {} } = this.$site
        let targetLang
        let defaultLang
        for (const path in locales) {
          if (path === '/') {
            defaultLang = locales[path]
          } else if (this.$page.path.indexOf(path) === 0) {
            targetLang = locales[path]
          }
        }
        return targetLang || defaultLang || {}
      }
    },
    $site: {
      get() {
        return siteDataRef.value || {}
      }
    },
    $siteByRoute: {
      get() {
        return siteDataByRouteRef.value || {}
      }
    },
    $page: {
      get() {
        return {
          ...(pageDataRef.value || {}),
          frontmatter:
            (pageDataRef.value && pageDataRef.value.frontmatter) || {}
        }
      }
    },
    $theme: {
      get() {
        return siteDataByRouteRef.value.themeConfig
      }
    },

    $title: {
      get(): any {
        const page = this.$page || {}
        const { metaTitle } = (this.$page || {}).frontmatter || {}
        if (typeof metaTitle === 'string') {
          return metaTitle
        }

        const siteTitle = this.$siteTitle
        const selfTitle = (page.frontmatter || {}).home
          ? null
          : (page.frontmatter || {}).title || page.title // explicit title // inferred title
        return siteTitle
          ? selfTitle
            ? selfTitle + ' | ' + siteTitle
            : siteTitle
          : selfTitle || 'VitePress'
      }
    },
    $description: {
      get(): any {
        // #565 hoist description from meta
        const { meta = [] } = this.$page.frontmatter || {}
        const description = getMetaDescription(meta)
        if (description) {
          return description
        }
        return (
          (this.$page.frontmatter || {}).description ||
          this.$localeConfig.description ||
          this.$site.description ||
          ''
        )
      }
    },
    $themeLocaleConfig: {
      get(): any {
        return (this.$site.themeConfig.locales || {})[this.$localePath] || {}
      }
    },
    // TODO
    $router: {
      get() {
        return router
      }
    },
    $route: {
      get(): any {
        return useRoute()
      }
    },
    $siteTitle: {
      get() {
        return this.$localeConfig.title || this.$site.title || ''
      }
    },
    // TODO
    $localePath: {
      get() {
        return this.$localeConfig.path || '/'
      }
    }
  })

  if (Theme.enhanceApp) {
    Theme.enhanceApp({
      app,
      router,
      siteData: siteDataByRouteRef
    })
  }
  //* global
  //  global helper for adding base path to absolute urls
  app.config.globalProperties.$withBase = function (path: string) {
    const base = this.$site.base
    if (path.charAt(0) === '/') return base + path.slice(1)
    else return path
  }

  return { app, router }
}

if (inBrowser) {
  const { app, router } = createApp()
  // wait unitl page component is fetched before mounting
  router.go().then(() => {
    app.mount('#app')
  })
}

function getMetaDescription(meta: any[]): string {
  console.info('dsadsadsa===>', meta)
  if (meta) {
    const descriptionMeta = meta.filter(
      (item) => item.name === 'description'
    )[0]
    if (descriptionMeta) return descriptionMeta.content
  }
  return ''
}
