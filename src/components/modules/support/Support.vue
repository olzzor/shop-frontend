<template>
  <div class="support">
    <div class="title"></div>

    <div class="content">
      <div class="FAQ">
        <FrequentlyAskedQuestions />
      </div>
    </div>
  </div>
</template>

<script>
import FrequentlyAskedQuestions from "@/components/modules/support/FrequentlyAskedQuestions.vue";

export default {
  name: "Support",
  components: {FrequentlyAskedQuestions},
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/support/support";
</style>
