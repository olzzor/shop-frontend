<template>
  <div class="stats-sales-category">
    <div class="title">
      <p>매출 분석 (카테고리)</p>
      <button type="button" class="btn-batch" @click="runBatch">batch</button>
    </div>

    <div class="content">
      <p>
        <span>
          <b>카테고리별</b><br>
          <i class="bi bi-emoji-smile"></i> 데이터 추출 방법: 확인하고자 하는 매출의 기간 입력 <i class="bi bi-arrow-right"></i> '검색' 버튼 클릭<br>
          <i class="bi bi-emoji-smile"></i> 화면 초기 출력값은 최근 일주일간의 데이터입니다.<br>
        </span>
      </p>

      <div class="input-area">
        <input type="date" class="input-field date" v-model="state.form.startDate">
        ~
        <input type="date" class="input-field date" v-model="state.form.endDate">
        <button type="button" class="search-btn" @click="showChart">검색</button>
      </div>

    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import axios from "axios";
import Chart from "chart.js/auto";
import lib from "@/scripts/lib";
import 'chartjs-adapter-date-fns';

export default {
  name: 'StatsSalesCategory',
  components: {},
  setup() {
    const chartCanvas = ref(null);
    const state = reactive({
      sales: [],
      form: {startDate: null, endDate: null}
    });

    const runBatch = () => {
      axios.get("/api/batch/stats-sales-category").then(({data}) => {
        console.log(data);
      });
    };

    const initPeriod = () => {
      const startDate = new Date();
      const endDate = new Date();

      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() - 1);

      state.form.startDate = startDate;
      state.form.endDate = endDate;
    }

    const load = () => {
      initPeriod();
      showChart();
    }

    const showChart = () => {
      axios.post("/api/stats/sales-category", state.form).then(({data}) => {
        state.sales = data;
        drawChart();
      });
    }

    const drawChart = () => {
      // 기존 차트 인스턴스 제거
      Chart.getChart(chartCanvas.value)?.destroy();

      const sortedSales = state.sales.sort((a, b) => (b.soldAmount - a.refundAmount) - (a.soldAmount - a.refundAmount));
      const categories = sortedSales.map(data => lib.getCategoryName(data.category.code));
      const netSales = sortedSales.map(data => data.soldAmount - data.refundAmount);

      const colors = []; // 카테고리별 색상을 저장하는 배열
      for (let i = 0; i < state.sales.length; i++) {
        // 각 카테고리에 대한 색상을 무작위로 생성합니다.
        colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.3)`);
      }

      new Chart(chartCanvas.value.getContext('2d'), {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [
            {data: netSales, backgroundColor: colors, borderColor: colors, borderWidth: 1},
          ]
        },
        options: {
          responsive: true,
          legend: {position: 'left'},
          animation: {animateScale: true, animateRotate: true},
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const value = tooltipItem.parsed;
                  const soldAmount = state.sales[tooltipItem.dataIndex].soldAmount;
                  const refundAmount = state.sales[tooltipItem.dataIndex].refundAmount;

                  return [
                    `매출: ${value}`,
                    `판매 금액: ${soldAmount}`,
                    `취소 금액: ${refundAmount}`
                  ];
                }
              }
            }
          },
        }
      });
    }

    load();

    return {
      lib,
      state, chartCanvas,
      runBatch, showChart
    }
  }
}
</script>

<style scoped>
.stats-sales-category {
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

.chart-container {
  width: 300px;
  height: 300px;
}

.btn-batch {
  border-width: 0.0625rem;
  font-size: .75rem;
  font-weight: 700;
  width: 150px;
  height: 30px;
  background-color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  transition-property: color, background-color;
}
</style>