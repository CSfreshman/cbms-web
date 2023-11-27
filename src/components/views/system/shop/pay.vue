<template>
  <div>

    <div v-html="payGateWay">{{payGateWay}}</div>
  </div>
</template>

<script>
export default {
  name: "pay",
  data() {
    return {
      payGateWay: ""
    }
  },
  created() {
  },
  mounted () {
    let form = this.$route.query.htmlData
    this.payGateWay = form
    console.log(this.payGateWay)
    this.$nextTick(()=> {
      document.getElementById('paymentSubmit').submit()
    })
  }
}
</script>

<style scoped>

</style>
