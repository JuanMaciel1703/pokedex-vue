<template>
  <div class="col-sm-12">
    <b-card-group deck v-if="!this.isLoading" class="text-center">
      <PokemonCard 
        v-for="pokemon in this.pokemons"
        v-bind:key="pokemon.name"
        v-bind:name="pokemon.name"
      >
      </PokemonCard>
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
    components: {
      PokemonCard
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