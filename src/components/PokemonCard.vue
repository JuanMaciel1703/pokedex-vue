<template>
  <div>
		<b-card 
			v-if="!this.isLoading"
			:img-src="this.pokemon.sprites.front_default"
			:img-alt="this.pokemon.name"
			bg-variant="secondary" 
			text-variant="white" 
			img-top
			tag="article"
			style="min-width: 10rem;"
			class="text-center mb-3"
		>
			<b-card-title class="text-capitalize">
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
			<b-spinner variant="light" label="Spinning"></b-spinner>
    </b-card>
  </div>
</template>

<script>
  import api from '../services/Api'
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
				cardColor: 'Default',
        pokemon: {} 
      }
    },
    created() {
        api.get(`pokemon/${this.name}`).then(response => { 
					this.isLoading = false
					this.pokemon = response.data
					this.resolveCardColor(response.data)
        })
    },
    methods: {
     resolveCardColor 
    }
	}
	
	function resolveCardColor(pokemon) {
		let color = 'Default'
		const primaryType = pokemon.types[0].type.name

		switch (primaryType) {
			case 'flying':
				color = 'Primary'
		}
		this.cardColor = color
	}
</script>

<style scoped>

</style>