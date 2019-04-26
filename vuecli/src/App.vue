<template>
  <div id="app">
    <h2>Cool countries</h2>

    <div v-if="showSettings">
      <input type="number" v-model.number="numberOfCountries">
      <button type="button" @click="restart()">Restart</button>
      <button type="button" @click="timeline.play()">Continue</button>
      <button type="button" @click="timeline.pause()">Pause</button>
    </div>

    <div class="result" v-if="showResult">
      Correct answers:
      {{correctGuessed}}
      <div v-if="showguessStatus">
        <div v-if="wasAnswerCorrect">Correct</div>
        <div v-else>
          Wrong:
          The correct country was: {{getCorrectCountry}}
        </div>
      </div>
    </div>
    <div class="container" v-if="showResult">
      <div class="svg">
        <svg viewBox="0 0 100 100" style="height:75vh">
          <path
            v-for="path of morphCountries"
            :key="path.id"
            :d="path.d"
            :class="{hidden:path.hidden}"
            :id="path.id"
          ></path>
        </svg>
      </div>

      <div class="options">
        <div v-if="showOptions">
          <h2>Which country?</h2>

          <transition-group name="list" tag="ul">
            <li v-for="country of countryOptionsForUser" :key="country.ISO_A3">
              <button
                type="button"
                @click="makeGuess(country.ISO_A3)"
                :value="country.ISO_A3"
              >{{country.ADMIN}}</button>
            </li>
          </transition-group>
        </div>
      </div>
    </div>
    <div v-if="showConclusion">You</div>
  </div>
</template>

<script>
import axios from 'axios'
import { TimelineLite } from 'gsap'
/* es-lint ignore next-line */
import { MorphSVGPlugin } from './greensock-plugins/MorphSVGPlugin'
import { shuffleArray, getRandomBetween } from './utilities/getRandom.js'

export default {
  name: 'app',
  components: {},
  data: function() {
    return {
      countries: [],
      country: '',
      morphCountries: [],
      current: '',
      smallBucket: [],
      proxy: MorphSVGPlugin,
      shuffledPoll: [],
      bucketToShow: [],
      numberOfCountries: 10,
      timeline: null,
      showOptions: false,
      countryOptionsForUser: [],
      userGuesses: [],
      showSettings: false,
      showResult: true,
      originalBucket: [],
      showguessStatus: false,
      showConclusion: false,
    }
  },
  mounted() {
    axios
      .get('http://localhost:3500/api/allcountries')
      .then(el => {
        this.countries = el.data.filter(el => el.ISO_A3 !== '-99')
        this.bucketToShow = this.shuffledPoll = shuffleArray(this.countries)

        this.restart()
      })
      .catch(el => {
        console.log(el)
      })
  },
  methods: {
    restart() {
      this.setBucket(this.numberOfCountries || 10)
      this.initShowCountries()
    },
    /**
     * @param {string} length
     */
    setBucket(length) {
      const shuffled = shuffleArray(this.countries).slice(0, length)

      this.bucketToShow = shuffled
      this.originalBucket = shuffled.slice()
    },
    makeGuess(country) {
      this.userGuesses.push(country)
      this.showguessStatus = true

      const waiting = this.wasAnswerCorrect ? 1500 : 2500

      setTimeout(() => {
        this.timeline.play()
        this.showguessStatus = false
      }, waiting)

      //this.showOptions = false
    },

    gameResult() {
      this.showResult = false
      this.showOptions = false
      this.showConclusion = true

      console.log('done')
    },
    showCountryOptions() {
      const allCountryCopy = this.countries.slice(),
        indexOfCurrent = allCountryCopy.findIndex(el => {
          return el.ISO_A3 === this.current
        })

      allCountryCopy.splice(indexOfCurrent, 1)

      const current = this.countries.find(el => el.ISO_A3 === this.current)

      const randomIndex = getRandomBetween(1, 9) - 1
      const randomCountries = shuffleArray(allCountryCopy, 9)

      randomCountries.splice(randomIndex, 0, current)

      // add current country

      this.showOptions = true
      this.countryOptionsForUser = randomCountries
    },

    initShowCountries(lastCountryId) {
      const itemsLeft = this.bucketToShow.length
      const pullNumberOfSvg = lastCountryId
        ? Math.min(3, itemsLeft)
        : Math.min(4, itemsLeft)

      const promises = this.bucketToShow.splice(0, pullNumberOfSvg).map(el => {
        return axios.get(`http://localhost:3500/api/svg/${el.ISO_A3}`)
      })

      Promise.all(promises).then(el => {
        const countriesGroup = el.map(el =>
          Object.assign({ hidden: true }, el.data)
        )

        if (lastCountryId) {
          countriesGroup.unshift(lastCountryId)
        }

        countriesGroup[0].hidden = false

        this.current = countriesGroup[0].id
        this.morphCountries = countriesGroup
      })
    },
  },
  computed: {
    currentName() {
      const country = this.countries.find(el => el.ISO_A3 === this.current)

      return country ? country.ADMIN : ''
    },
    correctGuessed() {
      return this.originalBucket.reduce((count, current, index) => {
        const userGuessOfCurrent = this.userGuesses[index]

        const correctGuess = userGuessOfCurrent === current.ISO_A3
        return count + (correctGuess ? 1 : 0)
      }, 0)
    },
    wasAnswerCorrect() {
      const lastIndex = this.userGuesses.length - 1
      const guess = this.userGuesses[lastIndex]
      console.log(lastIndex)

      const correctWas = this.originalBucket[lastIndex].ISO_A3

      return correctWas === guess
    },
    getCorrectCountry() {
      const lastIndex = this.userGuesses.length - 1
      return this.originalBucket[lastIndex].ADMIN
    },
    performance() {},
  },
  watch: {
    morphCountries(newVal) {
      this.$nextTick().then(() => {
        const element = document.getElementById(newVal[0].id)
        this.timeline = new TimelineLite()

        this.morphCountries.forEach(el => {
          this.timeline.to(
            element,
            0.75,
            {
              morphSVG: `#${el.id}`,
              onStart: () => {
                this.current = el.id
                this.showCountryOptions()
              },
              onComplete: () => {
                this.timeline.pause()
              },
            },
            '=+0.2'
          )
        })

        this.timeline.eventCallback('onComplete', () => {
          // set the last element on the first element on the new countries
          if (this.bucketToShow.length > 0) {
            this.initShowCountries(newVal[3])
          } else {
            this.gameResult()
          }
        })
      })
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.hidden {
  visibility: hidden;
}

.container {
  display: flex;
  .svg {
    width: 80%;
    padding-top: 4em;
    fill: transparent;
    stroke: red;
    stroke-width: 0.05;
  }

  .options {
    width: 15%;
    ul {
      list-style: none;
      padding: 0;
      li {
        button {
          width: 100%;
          padding: 0.4em;
          cursor: pointer;
          border-radius: 0.4em;
          border: 1px solid goldenrod;
        }
        &:not(:last-child) {
          margin-bottom: 0.4em;
        }
      }
    }
  }

  .list-enter-active,
  .list-enter-leave {
    transition: all 2s;
  }

  .list-enter {
    opacity: 0;
    transform: rotateX(-180deg);
  }
}
</style>
