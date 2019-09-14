<template>
  <div class="container">
    <b-card-group deck>
      <PokemonCard 
        v-for="pokemon in this.pokemons"
        v-bind:key="pokemon.name"
        v-bind:name="pokemon.name"
        >
      </PokemonCard>
    </b-card-group>
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
      api.get(`pokemon/?limit=10&offset=10`)
        .then(response => {
          this.pokemons = response.data.results
        })
    },
    components: {
      PokemonCard
    }
  }
</script>