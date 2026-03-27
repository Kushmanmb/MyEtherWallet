<template>
  <white-sheet class="px-5 px-lg-7 py-5 d-flex justify-space-between">
    <div>
      <h2 class="pb-3">{{ tokenTitle }}</h2>
      <h2 class="pb-3">{{ totalTokenValues }}</h2>
      <v-row justify="space-around">
        <v-col v-for="(img, idx) in tokenImages" :key="idx + img" cols="2">
          <img :src="img" height="32px" />
        </v-col>
        <v-col cols="2">
          <div class="circled-total">+{{ tokensList.length }}</div>
        </v-col>
      </v-row>
    </div>
  </white-sheet>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'ModuleTokensValue',
  computed: {
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['getFiatValue']),
    ...mapGetters('external', ['totalTokenFiatValue']),
    tokenTitle() {
      return `My Token${this.tokensList.length > 1 ? 's' : ''} Value`;
    },
    totalTokenValues() {
      return this.getFiatValue(this.totalTokenFiatValue);
    },
    tokenImages() {
      const firstFive = this.tokensList.slice(0, 5);
      return firstFive.map(item => {
        return item.img;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.circled-total {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding-top: 5px !important;
  color: #05c0a5;
  border: 1px dashed #05c0a5;
  text-align: center;
}
</style>
