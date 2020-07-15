// markdown-it plugin for:
// 1. adding target="_blank" to external links
// 2. normalize internal links to end with `.html`

import MarkdownIt from 'markdown-it'
import { MarkdownParsedData } from '../markdown'
import { URL } from 'url'

const indexRE = /(^|.*\/)(index|readme).md(#?.*)$/i

console.log('========>')
export const linkPlugin = (
  md: MarkdownIt,
  externalAttrs: Record<string, string>
) => {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    if (hrefIndex >= 0) {
      const hrefAttr = token.attrs![hrefIndex]
      const url = hrefAttr[1]
      const isExternal = /^https?:/.test(url)
      if (isExternal) {
        Object.entries(externalAttrs).forEach(([key, val]) => {
          token.attrSet(key, val)
        })
      } else if (!url.startsWith('#')) {
        normalizeHref(hrefAttr)
      }
    }
    console.log('open======>', hrefIndex)
    console.log('token======>', token)
    return self.renderToken(tokens, idx, options)
  }

  function normalizeHref(hrefAttr: [string, string]) {
    let url = hrefAttr[1]

    console.log('url===>', url)
    const indexMatch = url.match(indexRE)
    console.log('indexMatch===>', indexMatch)
    if (indexMatch) {
      const [, path, hash] = indexMatch
      url = path + hash
    } else {
      let cleanUrl = url.replace(/\#.*$/, '').replace(/\?.*$/, '')

      // .md -> .html
      if (cleanUrl.endsWith('.md')) {
        cleanUrl = cleanUrl.replace(/\.md$/, '.html')
      }
      // ./foo -> ./foo.html
      if (!cleanUrl.endsWith('.html') && !cleanUrl.endsWith('/')) {
        cleanUrl += '.html'
      }
      const parsed = new URL(url, 'http://a.com')
      url = cleanUrl + parsed.search + parsed.hash

      console.log('url====>', url)
    }

    // ensure leading . for relative paths
    if (!url.startsWith('/') && !/^\.\//.test(url)) {
      url = './' + url
    }

    // export it for existence check
    const data = (md as any).__data as MarkdownParsedData
    const links = data.links || (data.links = [])
    links.push(url.replace(/\.html$/, ''))

    // markdown-it encodes the uri
    hrefAttr[1] = decodeURI(url)
  }
}
