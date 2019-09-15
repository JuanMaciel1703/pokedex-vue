<template>
  <div>
		<b-card 
			v-if="!this.isLoading"
			:img-src="this.pokemon.sprites.front_default"
			:img-alt="this.pokemon.name"
			bg-variant="secondary" 
			text-variant="white" 
			img-left
			tag="article"
			class="text-center mb-3 card"
		>
			<b-card-title class="text-capitalize h5">
				{{ this.pokemon.name }}
			</b-card-title>
			<b-card-text>
				  <b-badge 
						v-for="typeData in this.pokemon.types" 
						v-bind:key="typeData.slot" 
						variant="light"
						class="text-capitalize mr-md-1"
					>
						{{ typeData.type.name }}
					</b-badge>
			</b-card-text>
		</b-card>
		<b-card 
			v-else
			class="text-center mb-3"
			style="min-width: 10rem; min-height: 16rem"
			text-variant="white"
			bg-variant="secondary" 
		>
			<b-spinner variant="light" label="Spinning" class="centered-element"></b-spinner>
    </b-card>
  </div>
</template>

<script>
	import pokemonService from '@/services/PokemonService'
	
  export default {
    props: {
      name: {
        type: String,
        required: true
			}
		},
    data() {
      return {
				isLoading: true,
        pokemon: {} 
      }
    },
    created() {
			setTimeout(() => {
				pokemonService.getPokemonData(this.name).then(response => {
					this.pokemon = response
					this.isLoading = false
				})
			}, 1000);
		},
		methods: {
				openModal(name) {
					
			}
		}
	}
</script>

<style scoped>
.card {
	width: 20rem;
}

.card-body {
	padding: 1.25rem 0;
}

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