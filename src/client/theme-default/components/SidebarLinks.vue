<template>
		<ul
						v-if="items.length"
						class="sidebar-links">
				<li
								v-for="(item, i) in items"
								:key="i">
						<SidebarGroup
										v-if="item.type === 'group'"
										:item="item"
										:open="i === openGroupIndex"
										:collapsable="item.collapsable || item.collapsible"
										:depth="depth"
										@toggle="toggleGroup(i)"
						/>
						<SidebarLink
										v-else
										:sidebar-depth="sidebarDepth"
										:item="item"
						/>
				</li>
		</ul>
</template>

<script>
  import SidebarGroup from './SidebarGroup.vue'
  import SidebarLink from './SidebarLink.vue'
  import { isActive } from '../utils'
  
  export default {
    name: 'SidebarLinks',
    
    components: { SidebarGroup, SidebarLink },
    props: {
      items: {
        type: Array,
        default() {
          return []
        }
      },
      // todo 考虑使用provide/inject
      depth: undefined,  // todo depth of current sidebar links
      sidebarDepth: undefined,// todo depth of headers to be extracted
      initialOpenGroupIndex: {
        type: Number,
        default() {
          return 0
        }
      }
    },
    data() {
      return {
        openGroupIndex: this.initialOpenGroupIndex || 0
      }
    },
    
    watch: {
      '$route'() {
        this.refreshIndex()
      }
    },
    
    created() {
      this.refreshIndex()
    },
    mounted() {
      console.info('items===>', this.items)
      console.info('$route===>', this.$route)
    },
    
    methods: {
      refreshIndex() {
        const index = resolveOpenGroupIndex(
          this.$route,
          this.items
        )
        if (index > -1) {
          this.openGroupIndex = index
        }
      },
      
      toggleGroup(index) {
        this.openGroupIndex = index === this.openGroupIndex ? -1 : index
      },
      
      isActive(page) {
        return isActive(this.$route, page.regularPath)
      }
    }
  }
  
  function resolveOpenGroupIndex(route, items = []) {
    console.info('resolveOpenGroupIndex===>', items)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (descendantIsActive(route, item)) {
        return i
      }
    }
    return -1
  }
  
  function descendantIsActive(route, item) {
    if (item.type === 'group') {
      return item.children.some(child => {
        if (child.type === 'group') {
          return descendantIsActive(route, child)
        } else {
          return child.type === 'page' && isActive(route, child.path)
        }
      })
    }
    return false
  }
</script>
