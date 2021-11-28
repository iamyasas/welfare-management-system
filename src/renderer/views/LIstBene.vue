<template>
  <section class="section">
    <Header></Header>
    <ListBene></ListBene>
    <Footer></Footer>
  </section>
</template>

<script>
  import Header from '../components/header/Header'
  import Footer from '../components/footer/Footer'
  import ListBene from '../components/list-bene/ListBene'

  export default {
    name: 'bene-list',
    components: { Header, Footer, ListBene },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
