<template>
		<header class="navbar">
				<SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>
				
				<RouterLink
								:to="$localePath"
								class="home-link"
				>
						<img
										v-if="$site.themeConfig.logo"
										class="logo"
										:src="$withBase($site.themeConfig.logo)"
										:alt="$siteTitle"
						>
						<span
										v-if="$siteTitle"
										ref="siteName"
										class="site-name"
										:class="{ 'can-hide': $site.themeConfig.logo }"
						>{{ $siteTitle }}</span>
				</RouterLink>
				
				<div class="links" :style="linksWrapMaxWidth ? {'max-width': linksWrapMaxWidth + 'px'} : {}">
						<!-- todo
						<AlgoliaSearchBox
										v-if="isAlgoliaSearch"
										:options="algolia"
						/>-->
						<!-- todo
						<SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false"/>-->
						<NavLinks class="can-hide"/>
				</div>
		</header>
</template>

<script>
  // import AlgoliaSearchBox from '@AlgoliaSearchBox'
  // import SearchBox from '@SearchBox'
  
  import SidebarButton from './SidebarButton.vue'
  import NavLinks from './NavLinks.vue'
  
  export default {
    name: 'Navbar',
    
    components: {
      SidebarButton,
      NavLinks
      // SearchBox,
      // AlgoliaSearchBox
    },
    
    data() {
      return {
        linksWrapMaxWidth: null
      }
    },
    
    computed: {
      // algolia() {
      //   return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
      // },
      //
      // isAlgoliaSearch() {
      //   return this.algolia && this.algolia.apiKey && this.algolia.indexName
      // }
    },
    
    mounted() {
      const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
      const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'))
      const handleLinksWrapWidth = () => {
        if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
          this.linksWrapMaxWidth = null
        } else {
          this.linksWrapMaxWidth = this.$el.offsetWidth - NAVBAR_VERTICAL_PADDING
            - (this.$refs.siteName && this.$refs.siteName.offsetWidth || 0)
        }
      }
      handleLinksWrapWidth()
      window.addEventListener('resize', handleLinksWrapWidth, false)
    }
  }
  
  function css(el, property) {
    // NOTE: Known bug, will return 'auto' if style value is 'auto'
    const win = el.ownerDocument.defaultView
    // null means not to return pseudo styles
    return win.getComputedStyle(el, null)[property]
  }
</script>

<style lang="stylus" scoped>
		@import "../styles/config.styl"
		$navbar-vertical-padding = 0.7rem
		$navbar-horizontal-padding = 1.5rem
		
		.navbar
				padding $navbar-vertical-padding $navbar-horizontal-padding
				line-height $navbarHeight - 1.4rem
				
				a, span, img
						display inline-block
				
				.logo
						height $navbarHeight - 1.4rem
						min-width $navbarHeight - 1.4rem
						margin-right 0.8rem
						vertical-align top
				
				.site-name
						font-size 1.3rem
						font-weight 600
						color $textColor
						position relative
				
				.links
						padding-left 1.5rem
						box-sizing border-box
						background-color white
						white-space nowrap
						font-size 0.9rem
						position absolute
						right $navbar-horizontal-padding
						top $navbar-vertical-padding
						display flex
						
						.search-box
								flex: 0 0 auto
								vertical-align top
		
		@media (max-width: $MQMobile)
				.navbar
						padding-left 4rem
						
						.can-hide
								display none
						
						.links
								padding-left 1.5rem
						
						.site-name
								width calc(100vw - 9.4rem)
								overflow hidden
								white-space nowrap
								text-overflow ellipsis
</style>


<!--<template>-->
<!--  <a class="title" :aria-label="$site.title + ', back to home'" :href="$site.base">-->
<!--    <img class="logo" v-if="$theme.logo" :src="withBase($theme.logo)" alt="logo" />-->
<!--    <span>{{ $site.title }}</span>-->
<!--  </a>-->
<!--  <nav class="nav-links" v-if="navData">-->
<!--    <a-->
<!--      class="nav-link"-->
<!--      v-for="{ text, link, target, rel, ariaLabel } of navData"-->
<!--      :class="{ active: isActiveLink(link) }"-->
<!--      :href="withBase(link)"-->
<!--      :target="target"-->
<!--      :rel="rel"-->
<!--      :aria-label="ariaLabel"-->
<!--    >{{ text }}</a>-->
<!--  </nav>-->
<!--</template>-->

<!--<script src="./NavBar"></script>-->

<!--<style>-->
<!--.title {-->
<!--  font-size: 1.3rem;-->
<!--  font-weight: 600;-->
<!--  color: var(&#45;&#45;text-color);-->
<!--}-->
<!--.logo {-->
<!--  margin-right: 0.75rem;-->
<!--  height: 1.3rem;-->
<!--  vertical-align: bottom;-->
<!--}-->
<!--.nav-links {-->
<!--  list-style-type: none;-->
<!--}-->
<!--.nav-link {-->
<!--  color: var(&#45;&#45;text-color);-->
<!--  margin-left: 1.5rem;-->
<!--  font-weight: 600;-->
<!--  display: inline-block;-->
<!--  height: 1.75rem;-->
<!--  line-height: 1.75rem;-->
<!--}-->
<!--.nav-link:hover,-->
<!--.nav-link.active {-->
<!--  border-bottom: 2px solid var(&#45;&#45;accent-color);-->
<!--}-->
<!--</style>-->
