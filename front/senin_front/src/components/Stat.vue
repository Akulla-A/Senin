<template>
  <div class="stat_box white-bg p-1">
    <div style="display: flex; justify-content: space-between">
      <h4>{{ statClean }}</h4>

      <div class="blue-border options_border" style="margin: 0">
        <button @click="fetchApi(0)">5min</button>
        <button @click="fetchApi(1)">1h</button>
        <button @click="fetchApi(2)">1j</button>
      </div>
    </div>
    <!--<canvas :id="'chart_' + statName" ref="chart">
    </canvas> -->
    <Line ref="chart" :id="'chart_' + statName" :data="getdata" v-if="loaded" :options="optionChart">

    </Line>
  </div>
</template>

<script>
import {ref} from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Colors
)
let chart = ref(null)

export default {
  name: "Stat",

  props: {
    statName: String,
    statClean: String,
  },
  components: {Line},

  async mounted() {this.fetchApi(0)},

  methods: {
    fetchApi(time){
      console.log(time)
      this.time = time
      const t = this
      fetch('http://localhost:3000/getstats?' + new URLSearchParams({
        statname: this.statName,
        time: this.time,
      })).then(response => response.json()).then(res => {
        let datasets = []
        res[1] = res[1].reverse()
        let jobs = Object.keys(res[1][0])

        let labels = res[0].map(el => {
          const d = new Date(el * 1000)
          return d.getHours() + ":" + d.getMinutes()
        })

        labels = labels.reverse()

        for (let i = 0; i < jobs.length; i++) {
          let numberStat = []

          for (let j = 0; j < res[1].length; j++) {
            numberStat.push(res[1][j][jobs[i]])
          }

          datasets.push({
            label: jobs[i],
            fill: false,
            //borderColor: getRandomColor(),
            data: numberStat,
          })
        }

        t.loaded = true

        t.dataapi = {
          labels: labels,
          datasets: datasets
        }
      })
    },
  },
  computed: {
    getdata() {
      return this.dataapi;
    },
  },
  data() {
    return {
      dataapi: {},
      time: 0,
      loaded: false,
      optionChart: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          customCanvasBackgroundColor: {color: 'rgb(40,40,60,0.8)',},
          colors: {
            enabled: true
          },
        },
        legend: {
          position: "bottom",
          labels: {
            fontColor: 'white',
            //fontSize: res[1][0].length < 30 ? 20 : 15
            fontSize: 13
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "white",
              fontSize: 20,
              stepSize: 2,
            },
            gridLines: { color: "#FFFFFF60" }
          }],
          xAxes: [{
            ticks: {
              fontColor: "white",
              fontSize: 20,
              stepSize: 1,
            },
            gridLines: { color: "#FFFFFF60" }
          }]
        }
      },
    }
  }
}
</script>