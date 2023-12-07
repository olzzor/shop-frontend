<!-- Slider.vue -->
<template>
  <div class="slider">
    <div class="slider-content" v-if="state.sliders.length > 0 && state.sliders[currentSlide]" :key="currentSlide">
      <router-link :to="{ name: 'NoticeDetail', params: { id: state.sliders[currentSlide].id }}">
        <img
            :src="`${state.sliders[currentSlide].noticeSliderImage.filePath}${state.sliders[currentSlide].noticeSliderImage.fileName}`"
            :alt="state.sliders[currentSlide].title" />
      </router-link>
    </div>

    <div class="pagination">
      <div class="bar-container" :style="'--slider-count: ' + state.sliders.length">
        <div v-for="(slider, index) in state.sliders" :key="index" class="bar" @click="setSlide(index)">
          <div :class="{ fill: currentSlide === index }"></div>
        </div>
      </div>
    </div>
    <!--    <div class="pagination">-->
    <!--      <div class="play-pause-controls">-->
    <!--        <button v-if="isPlaying" @click="togglePlay"><i class="bi bi-pause-fill"></i></button>-->
    <!--        <button v-else @click="togglePlay"><i class="bi bi-play-fill"></i></button>-->
    <!--      </div>-->
    <!--      <div class="navigation-controls">-->
    <!--        <button @click="prevSlide"><i class="bi bi-chevron-left"></i></button>-->
    <!--        <span>{{ currentSlide + 1 }} / {{ state.sliders.length }}</span>-->
    <!--        <button @click="nextSlide"><i class="bi bi-chevron-right"></i></button>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";

export default {
  name: "Slider",
  setup() {
    const currentSlide = ref(0); // 현재 슬라이드의 인덱스를 저장하는 ref
    const isPlaying = ref(true);
    const state = reactive({
      sliders: [],
    });

    const load = () => {
      axios.get('/api/notice/show-in-slider').then(({data}) => {
        state.sliders = data;
      });
    };

    const togglePlay = () => {
      isPlaying.value = !isPlaying.value;
    };

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
        if (isPlaying.value && state.sliders.length > 0) {
          nextSlide();
        }
      }, 3000); // 3초마다 슬라이드 변경
    });

    return {
      currentSlide, isPlaying, state,
      togglePlay, setSlide, prevSlide, nextSlide,
    }
  }
}
</script>

<style scoped>
.slider {
  position: relative; /* 상대 위치 지정 */
  width: 100vw; /* 뷰포트의 너비로 설정 */
  height: 60vh; /* 세로를 고정된 길이로 설정 */
  overflow: hidden; /* 오버플로를 숨김 */
}

.slider-content {
  position: absolute;
  width: 100%; /* 이미지의 너비를 부모 요소의 너비로 설정 */
  height: 100%; /* 이미지의 높이를 부모 요소의 높이로 설정 */
  top: 0;
  left: 0;
}

img {
  width: 100%; /* 이미지의 너비를 부모 요소의 너비로 설정 */
  height: 100%; /* 이미지의 높이를 부모 요소의 높이로 설정 */
  object-fit: cover; /* 이미지가 부모 요소를 완전히 채우도록 설정 (이미지 비율 유지) */
  object-position: center center; /* 이미지를 가운데로 정렬 (이미지가 부모 요소를 넘칠 경우, 넘치는 부분은 중앙을 기준으로 hidden) */
}

.pagination {
  position: absolute;
  z-index: 1; /* z-index를 1로 설정하여 다른 요소 위에 위치하도록 함 */
  bottom: 15px;
  left: 50%;
  transform: translate(-50%, 50%); /* 위치를 정확하게 중앙에 배치하기 위해 transform을 사용 */
  display: flex;
  align-items: center; /* 자식 요소를 수직 방향으로 중앙에 배치 */
  width: auto; /* width를 필요한 만큼의 너비만 사용 */
  height: auto; /* height를 필요한 만큼의 너비만 사용 */
}

.play-pause-controls button {
  background: none; /* 버튼의 배경색을 없앰 */
  border: rgba(0, 0, 0, 0.5); /* 추가: 버튼의 테두리를 없앰 */
  color: white; /* 아이콘 색을 흰색으로 설정 */
}

.navigation-controls {
  background-color: rgba(233, 233, 233, 0.9); /* 회색 배경색과 투명도 설정 */
  border-radius: 30px; /* 둥글게 묶어서 표시 */
  display: flex; /* 플렉스박스 레이아웃 사용 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 5px; /* 요소 간 간격 설정 */
  padding: 5px 10px; /* 패딩 설정 */
}

.navigation-controls button {
  background: none; /* 버튼의 배경색을 없앰 */
  border: none; /* 버튼의 테두리를 없앰 */
}

.navigation-controls span {
  color: #000;
  font-size: 0.8rem;
}

.pagination span.active {
  background-color: #000;
}

.bar-container {
  display: flex;
  align-items: center;
  width: 30vw;
  justify-content: space-between; /* 바 사이의 공간을 동일하게 조절 */
}

.bar {
  background-color: white; /* 바의 기본 배경색 */
  width: calc((100% - (var(--slider-count) - 1) * 10px) / var(--slider-count)); /* 슬라이더의 개수와 gap을 고려하여 너비를 동적으로 조정 */
  height: 5px; /* 바의 높이 */
  overflow: hidden; /* 내부 요소가 넘쳤을 때 숨김 */
  cursor: pointer; /* 바에 마우스를 올리면 포인터가 나타나게 함 */
  position: relative; /* 상대 위치 지정 */
}

.bar .fill {
  background-color: dimgray; /* 채워지는 부분의 배경색 */
  width: 100%; /* 전체 너비 */
  height: 100%; /* 전체 높이 */
  position: absolute; /* 절대 위치 지정 */
  left: 0; /* 왼쪽에서 시작 */
  animation: fillEffect 3s linear forwards; /* 애니메이션 효과 적용 */
}

@keyframes fillEffect {
  0% {
    width: 0; /* 시작 시 너비 0 */
  }
  100% {
    width: 100%; /* 끝날 때 전체 너비 */
  }
}
</style>
