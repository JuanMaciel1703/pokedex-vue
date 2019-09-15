<template>
	<div v-if="showModal">
		<b-modal id="pokemonDataModal" title="Pokemon Data">
				<div class="row">
					<div class="col-md-4">
						<img class="pokemonImage" :src="this.pokemon.sprites.front_default" alt="pokemonImage">
					</div>
					<div class="col-md-8">
						<h2 class="text-capitalize">{{ this.pokemon.name }}</h2>
					</div>
				</div>
		</b-modal>
	</div>
</template>

<script>
	import pokemonService from '@/services/PokemonService'

	export default {
		data() {
			return {
				showModal: false,
				pokemon: {}
			}
		},
		methods: {
			show(pokemonName) {
				pokemonService.getPokemonData(pokemonName).then(response => {
					this.pokemon = response
					this.showModal = true
					this.$bvModal.show('pokemonDataModal')
				})
			}
		},
		mounted() {
			this.$root.$on('bv::modal::close', (bvEvent, modalId) => {
				this.showModal = false
			})
		}
}
</script>

<style scoped>
.pokemonImage{
	height: 10rem;
	width: 10rem;
}
</style>