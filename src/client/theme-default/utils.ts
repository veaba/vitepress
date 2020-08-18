import { useSiteData, Route } from 'vitepress'

export const hashRE = /#.*$/
export const extRE = /\.(md|html)$/
export const endingSlashRE = /\/$/
export const outboundRE = /^[a-z]+:/i

export function withBase(path: string) {
  return (useSiteData().value.base + path).replace(/\/+/g, '/')
}

export function isExternal(path: string): boolean {
  return outboundRE.test(path)
}

export function isActive(route: Route, path?: string): boolean {
  if (path === undefined) {
    return false
  }

  const routePath = normalize(route.path)
  const pagePath = normalize(path)

  return routePath === pagePath
}

export function normalize(path: string): string {
  return decodeURI(path).replace(hashRE, '').replace(extRE, '')
}

/**
 * get the path without filename (the last segment). for example, if the given
 * path is `/guide/getting-started.html`, this method will return `/guide/`.
 * Always with a trailing slash.
 */
export function getPathDirName(path: string): string {
  const segments = path.split('/')

  if (segments[segments.length - 1]) {
    segments.pop()
  }

  return ensureEndingSlash(segments.join('/'))
}

export function ensureEndingSlash(path: string): string {
  return /(\.html|\/)$/.test(path) ? path : `${path}/`
}

/**
 * @param { Page } page
 * @param { string } regularPath
 * @param { SiteData } site
 * @param { string } localePath
 * @returns { SidebarGroup }
 */
export function resolveSidebarItems(
  page: any,
  regularPath: string,
  site: any,
  localePath: string
) {
  const { pages, themeConfig } = site

  const localeConfig =
    localePath && themeConfig.locales
      ? themeConfig.locales[localePath] || themeConfig
      : themeConfig

  const pageSidebarConfig =
    page.frontmatter.sidebar || localeConfig.sidebar || themeConfig.sidebar
  if (pageSidebarConfig === 'auto') {
    return resolveHeaders(page)
  }

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar
  if (!sidebarConfig) {
    return []
  } else {
    const { base, config } = resolveMatchingConfig(regularPath, sidebarConfig)
    if (config === 'auto') {
      return resolveHeaders(page)
    }
    return config
      ? config.map((item: any) => resolveItem(item, pages, base))
      : []
  }
}

/**
 * @param { Route } route
 * @param { Array<string|string[]> | Array<SidebarGroup> | [link: string]: SidebarConfig } config
 * @returns { base: string, config: SidebarConfig }
 */
export function resolveMatchingConfig(regularPath: string, config: any) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config
    }
  }
  for (const base in config) {
    if (ensureEndingSlash(regularPath).indexOf(encodeURI(base)) === 0) {
      return {
        base,
        config: config[base]
      }
    }
  }
  return {}
}

/**
 * @param { Page } page
 * @returns { SidebarGroup }
 */
function resolveHeaders(page: any) {
  const headers = groupHeaders(page.headers || [])
  return [
    {
      type: 'group',
      collapsable: false,
      title: page.title,
      path: null,
      children: headers.map((h: any) => ({
        type: 'auto',
        title: h.title,
        basePath: page.path,
        path: page.path + '#' + h.slug,
        children: h.children || []
      }))
    }
  ]
}

export function groupHeaders(headers: any) {
  // group h3s under h2
  headers = headers.map((h: any) => Object.assign({}, h))
  let lastH2: any
  headers.forEach((h: any) => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      ;(lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  return headers.filter((h: any) => h.level === 2)
}

function resolveItem(item: any, pages: any, base: any, groupDepth = 1) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base)
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    })
  } else {
    const children = item.children || []
    if (children.length === 0 && item.path) {
      return Object.assign(resolvePage(pages, item.path, base), {
        title: item.title
      })
    }
    return {
      type: 'group',
      path: item.path,
      title: item.title,
      sidebarDepth: item.sidebarDepth,
      initialOpenGroupIndex: item.initialOpenGroupIndex,
      children: children.map((child: any) =>
        resolveItem(child, pages, base, groupDepth + 1)
      ),
      collapsable: item.collapsable !== false
    }
  }
}

export function resolvePage(pages: any, rawPath: any, base: any) {
  if (isExternal(rawPath)) {
    return {
      type: 'external',
      path: rawPath
    }
  }
  if (base) {
    rawPath = resolvePath(rawPath, base)
  }
  const path = normalize(rawPath)
  for (let i = 0; i < pages.length; i++) {
    if (normalize(pages[i].regularPath) === path) {
      return Object.assign({}, pages[i], {
        type: 'page',
        path: ensureExt(pages[i].path)
      })
    }
  }
  console.error(
    `[Vitepress] No matching page found for sidebar item "${rawPath}"`
  )
  return {}
}

function resolvePath(relative: any, base: any, append?: any) {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

export function ensureExt(path: string) {
  if (!path) return ''
  if (isExternal(path)) {
    return path
  }
  const hashMatch = path.match(hashRE)
  const hash = hashMatch ? hashMatch[0] : ''
  const normalized = normalize(path)

  if (endingSlashRE.test(normalized)) {
    return path
  }
  return normalized + '.html' + hash
}

export function resolveNavLinkItem(linkItem: any) {
  return Object.assign(linkItem, {
    type: linkItem.items && linkItem.items.length ? 'links' : 'link'
  })
}

export function isMailto(path: string) {
  return /^mailto:/.test(path)
}

export function isTel(path: string) {
  return /^tel:/.test(path)
}
