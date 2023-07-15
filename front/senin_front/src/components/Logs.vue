<template>
  <div>
    <table>
      <thead>
        <td>Type</td>
        <td>Info</td>
        <td>Date</td>
      </thead>

      <tbody>
        <tr v-for="data in this.api_data">
          <td :style="'color: ' + json[0].clr">{{json[0].name}}</td>

          <td>
            <template v-for="t in data.formatted">
              <button v-if="(typeof t !== 'string')">
                {{t.name}}
              </button>

              <span v-if="(typeof t === 'string')">
                {{t}}
              </span>
            </template>
          </td>
          <td>{{data.date}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import jsondata from '../assets/logs.json'
// jsondata

console.log(jsondata[0])
export default {
  name: "Logs",
  data(){
    return {
      sentences: {},
      api_data: {},
      json: jsondata,
    }
  },
  methods: {
    fetchApi(){
      const t = this
      fetch('http://localhost:3000/getlogs?').then(response => response.json()).then(response => {
        for (const [key, e] of Object.entries(response)) {
          let formatted = jsondata[e.log_id]
          let formattedText = formatted.sentence
          let players = []
          let date = new Date(e.date)

          e.date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + ":" + (date.getMonth() + 1)

          let c = 0
          e.textdata.forEach(textDataSingle => {
            if (typeof textDataSingle === 'string'){
              formattedText = formattedText.replace('{' + c + "}", textDataSingle)
            } else {
              players.push(textDataSingle)
            }
            c = c + 1
          })

          let final = []
          let cursor = 0

          formattedText.split(/{\d*}/).forEach(text => {
            final.push(text)

            if (players[cursor] !== undefined){
              final.push(players[cursor])
              cursor = cursor + 1
            }
          })

          e.formatted = final
        }

        t.api_data = response
      })
    }
  },

  async mounted() {this.fetchApi()}
}
</script>

<style scoped>

</style>