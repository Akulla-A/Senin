<template>
  <div class="stats_container">
    <Stat statName="nb_players" statClean="Par Jobs" style="grid-column: 1 / 4; grid-row: 2"/>
    <Stat statName="players" statClean="Par Grades"/>
    <Stat statName="temps_connexionjoueur" statClean="Temps de connexion"/>
  </div>
</template>

<script>
export default {
  name: "Player"
}
</script>

<style scoped>

</style>