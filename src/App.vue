<template>
  <div id="app">
    <div id="nav">
      <Navbar></Navbar>
    </div>
    <div id="main" class="container mt-4 mb-5  d-flex h-100">
      <router-view/> <!-- Renderiza o componente de acordo com a rota -->
    </div>
    <div id="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}


a {
  text-decoration: none;
  color: #fff !important
}

a:hover {
  text-decoration: none;
  color: #fff !important
}


</style>
