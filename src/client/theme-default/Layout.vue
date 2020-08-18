<template>
  <div class="theme">
    <header>
      <NavBar />
    </header>
    <aside>
      <SideBar />
    </aside>
    <main>
      <Page />
    </main>
  </div>
  <Debug />
</template>

<script>
import NavBar from './components/Navbar.vue'
import SideBar from './components/SideBar.vue'
import Page from './components/Page.vue'

export default {
  components: {
    NavBar,
    SideBar,
    Page
  }
}
</script>
