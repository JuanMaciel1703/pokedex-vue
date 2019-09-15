import api from './Api'

export default {
    getPokemonData(name) {
        return api.get(`pokemon/${name}`)
            .then(response => { 
                return response.data
            })
            .catch(err => {
                throw err
            })
    }
}