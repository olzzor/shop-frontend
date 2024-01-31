<template>
  <footer>
    <div class="left">
      <div><span class="label">대표 </span><span>BAIK KYUHEE | </span></div>
      <div><span class="label">사업자등록번호 </span>561-87-00715 |</div>
      <div><span class="label">주소 </span>서울특별시 강남구 대치동 942 해성빌딩 |</div>
      <div><span class="label">통신판매신고번호 </span>제 2018 - 서울서초 - 0860 호 [사업자정보<a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=5618700715" target="_blank" rel="noopener noreferrer" style="color: #000000;"><u>확인</u></a>] |</div>
      <div><span class="label">전화 </span>00-30832-10322 |</div>
      <div><span class="label">이메일 </span><a href="mailto:support@bridgeshop.co.kr">support@bridgeshop.co.kr</a> |</div>
      <div><span class="label">개인정보관리책임자 </span>KOREA TRIBE, INC. |</div>
      <div><a href="https://kr.stussy.com/pages/legal" target="_blank" rel="noopener noreferrer" style="color: #000000;"><u>개인정보취급방침</u></a></div>
    </div>

    <div class="right">
      <a :href="instagramLink" target="_blank">
        <i class="bi bi-instagram"></i>
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      instagramLink: "http://www.instagram.com/olzzor"
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/modules/home/footer";
</style>
