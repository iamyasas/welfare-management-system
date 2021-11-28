<template>
  <section class="section">
    <Header></Header>
    <AddBene></AddBene>
    <Footer></Footer>
  </section>
</template>

<script>
  import Header from '../components/header/Header'
  import Footer from '../components/footer/Footer'
  import AddBene from '../components/add-bene/AddBene'

  export default {
    name: 'add-bene',
    components: { Header, Footer, AddBene },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
