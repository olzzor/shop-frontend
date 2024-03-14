<template>
  <div class="stats-sales">
    <div class="title">
      <p>매출 분석 (날짜)</p>
      <button type="button" class="btn-batch" @click="runBatch">batch</button>
    </div>

    <div class="content">
      <p>
        <span>
          <b>날짜별</b><br>
          <i class="bi bi-emoji-smile"></i> 데이터 추출 방법: 확인하고자 하는 매출의 단위(년/월/주/일) 선택<i class="bi bi-arrow-right"></i> 기간 입력 <i class="bi bi-arrow-right"></i> '검색' 버튼 클릭<br>
          <i class="bi bi-emoji-smile"></i> 화면 초기 출력값은 최근 일주일간의 일일 데이터입니다.<br>
        </span>
      </p>

      <div class="input-area">
        <select class="select-field" v-model="state.form.type">
          <option disabled value="">단위</option>
          <option v-for="type in periodTypes" :key="type" :value="type">
            {{ lib.getPeriodTypeName(type) }}
          </option>
        </select>
        <input type="date" class="input-field date" v-model="state.form.startDate">
        ~
        <input type="date" class="input-field date" v-model="state.form.endDate">
        <button type="button" class="search-btn" @click="showChart">검색</button>
      </div>

    </div>

    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import dayjs from 'dayjs';
import Chart from "chart.js/auto";
import lib from "@/scripts/lib";
import 'chartjs-adapter-date-fns';

export default {
  name: 'StatsSales',
  components: {},
  setup() {
    const periodTypes = ['day', 'week', 'month', 'year'];
    const chartCanvas = ref(null);
    const state = reactive({
      sales: [],
      form: {type: '', startDate: null, endDate: null}
    });

    const runBatch = () => {
      axios.get("/api/batch/stats-sales").then(({data}) => {
        console.log(data);
      });
    };

    const initPeriod = () => {
      const startDate = new Date();
      const endDate = new Date();

      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() - 1);

      state.form.type = 'day';
      state.form.startDate = startDate;
      state.form.endDate = endDate;
    };

    const load = () => {
      initPeriod();
      showChart();
    };

    const showChart = () => {
      axios.post("/api/stats/sales", state.form).then(({data}) => {
        state.sales = data;
        drawChart();
        // switch (state.form.type) {
        //   case 'year':
        //     return drawYearlyChart();
        //   case 'month':
        //     return drawMonthlyChart();
        //   case 'week':
        //     return drawWeeklyChart();
        //   case 'day':
        //     return drawDailyChart();
        // }
      });
    };

    const formatDate = (value) => {
      const date = dayjs(value);

      switch (state.form.type) {
        case 'year':
          return `${date.format('YYYY')}`;
        case 'month':
          return `${date.format('YYYY/MM')}`;
        case 'week':
          return `${date.format('YYYY/MM')} ${weekOfMonth(date)}주차`;
        case 'day':
          return `${date.format('YYYY/MM/DD')}`;
      }
    }

    const weekOfMonth = (date) => {
      // (해당 날짜의 dd + 해당 날짜의 MM의 첫째 날에 해당하는 주의 n번 째 요일) / 7 의 올림값
      return Math.ceil((date.date() + dayjs(date).startOf('month').day()) / 7);
    }

    const drawChart = () => {
      // 기존 차트 인스턴스 제거
      Chart.getChart(chartCanvas.value)?.destroy();

      const dates = state.sales.map(data => formatDate(data.startDate));
      const soldAmount = state.sales.map(data => data.soldAmount);
      const refundAmount = state.sales.map(data => (data.refundAmount === 0) ? 0 : -data.refundAmount);
      const netSales = state.sales.map(data => data.soldAmount - data.refundAmount);

      new Chart(chartCanvas.value.getContext('2d'), {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {type: 'line', label: '매출', data: netSales, borderColor: '#7e7e7e', fill: false, cubicInterpolationMode: 'monotone', tension: 0.4},
            {type: 'bar', label: '판매 금액', data: soldAmount, backgroundColor: 'rgba(255, 0, 0, 0.3)'},
            {type: 'bar', label: '취소 금액', data: refundAmount, backgroundColor: 'rgba(0, 0, 255, 0.3)'}
          ]
        },
        options: {
          scales: {x: {type: 'category', stacked: true, display: true}},
          plugins: {tooltip: {mode: 'index', intersect: false}}
        }
      });
    }

    onMounted(load);

    return {
      lib,
      state, chartCanvas, periodTypes,
      runBatch, showChart,
    }
  }
}
</script>

<style scoped>
.stats-sales {
  padding-inline: 30px;
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title p {
  font-size: 20px;
  font-weight: bold;
}

.content {
  font-size: 12px;
  display: flex;
  flex-direction: column;
}

table {
  border: 1px solid #e3e3e3;
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #e3e3e3;
  padding-left: 5px;
}

thead > tr:first-child {
  background-color: #e3e3e3;
}

.input-area {
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  gap: 10px; /* 요소들 사이의 간격 */
}

.search-btn {
  justify-content: center;
  text-align: center;
  font-size: .75rem;
  font-weight: 700;
  border-radius: 5px;
  border: none;
  border-width: 0.0625rem;
  height: 1.45rem;
  width: 6rem;
  background-color: #545454;
  border-color: #545454;
  color: white;
}

.btn-batch {
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  width: 150px;
  height: 30px;
  background-color: black;
  border-color: black;
  color: white;
}
</style>