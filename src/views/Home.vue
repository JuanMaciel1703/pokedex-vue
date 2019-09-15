<template>
  <div>
    <b-card-group deck v-if="!this.isLoading" class="text-center col-sm-12">
      <a 
      v-on:click="openModal(pokemon.name)"
      v-for="pokemon in this.pokemons"
      v-bind:key="pokemon.name"
      >
        <PokemonCard 
          v-bind:name="pokemon.name"
        >
        </PokemonCard>
      </a>
      <PokemonDataModal ref="modal"/>
    </b-card-group>
    <div v-else>
			<b-spinner 
        variant="dark" 
        label="Spinning" 
        class="centered-element"
        type="grow"
      >
      </b-spinner>
    </div>
  </div>
</template>

<script>
  import api from '@/services/Api'
  import PokemonCard from '@/components/PokemonCard'
	import PokemonDataModal from '@/components/PokemonDataModal'

  export default {
    data() {
      return {
        isLoading: true,
        pokemons: []
      }
    },
    beforeMount() {
      setTimeout(() => {
        api.get(`pokemon/?limit=20&offset=20`)
        .then(response => {
          this.isLoading = false
          this.pokemons = response.data.results
        })
      }, 1000);
    },
    methods: {
      openModal(data) {
        this.$refs.modal.show(data)
      }
    },
    components: {
      PokemonCard,
      PokemonDataModal
    }
  }
</script>

<style scoped>
.centered-element {
  height: 100px;
  width: 100px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 50%;
  margin-top: -50px;
}

</style>