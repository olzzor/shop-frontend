<!-- Slider.vue -->
<template>
  <div class="slider">
    <div class="title"></div>

    <div class="content" v-if="state.sliders.length > 0">
      <div class="slider">
        <div class="slider-image" v-if="state.sliders.length > 0 && state.sliders[currentSlide]" :key="currentSlide">
          <router-link :to="{ name: 'NoticeDetail', params: { id: state.sliders[currentSlide].id }}">
            <img :src="`${state.sliders[currentSlide].noticeSliderImage.fileUrl}`" :alt="state.sliders[currentSlide].title" />
          </router-link>
        </div>

        <!-- 페이지네이션 바는 슬라이더가 한 개 이상일 때만 표시 -->
        <div class="pagination" v-if="state.sliders.length > 1">
          <div class="bar-container" :style="'--slider-count: ' + state.sliders.length">
            <div v-for="(slider, index) in state.sliders" :key="index" class="bar" @click="setSlide(index)">
              <div :class="{ fill: currentSlide === index }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content no-slider-data" v-else></div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";

export default {
  name: "Slider",
  setup() {
    const currentSlide = ref(0); // 현재 슬라이드의 인덱스를 저장하는 ref
    // const isPlaying = ref(true);
    const state = reactive({
      sliders: [],
    });

    const load = () => {
      axios.get('/api/notice/show-in-slider').then(({data}) => {
        state.sliders = data;
      });
    };

    // const togglePlay = () => {
    //   isPlaying.value = !isPlaying.value;
    // };

    const setSlide = (index) => {
      currentSlide.value = index;
    };

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + state.sliders.length) % state.sliders.length;
    };

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % state.sliders.length;
    };

    onMounted(() => {
      load();

      setInterval(() => {
        if (state.sliders.length > 1) {
          nextSlide();
        }
        // if (isPlaying.value && state.sliders.length > 0) {
        //   nextSlide();
        // }
      }, 3000); // 3초마다 슬라이드 변경
    });

    return {
      currentSlide, state,
      setSlide, prevSlide, nextSlide,
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/home/slider";
</style>
