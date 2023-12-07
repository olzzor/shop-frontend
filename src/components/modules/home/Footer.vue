<template>
  <footer>
    <div class="left">

      <span>코리아트라이브 유한회사 | </span>
      <span class="label">대표</span><span>BAIK KYUHEE | </span>
      <span class="label">사업자등록번호</span> 561-87-00715 |
      <span class="label">주소</span>서울특별시 강남구 대치동 942 해성빌딩 |
      <span class="label">통신판매신고번호</span> 제 2018 - 서울서초 - 0860 호 [사업자정보<a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=5618700715" target="_blank" rel="noopener noreferrer" style="color: #000000;"><u>확인</u></a>] |
      <span class="label">전화</span> 00-30832-10322 |
      <span class="label">이메일</span> <a href="mailto:support@stussy.co.kr">support@stussy.co.kr</a> |
      <span class="label">개인정보관리책임자</span> KOREA TRIBE, INC. |
      <a href="https://kr.stussy.com/pages/legal" target="_blank" rel="noopener noreferrer" style="color: #000000;"><u>개인정보취급방침</u></a>

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
<style scoped>
footer {
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 10px;
  padding-inline: 30px;
  background-color: #ECECEC;
  color: #000;
  /*z-index: 1000;*/
}

.left {
  display: flex;
  gap: 5px;
  font-size: 10px;
}

.left a {
  color: #000;
  text-decoration: none;
}

.label {
  color: gray;
}

.right {
  display: flex;
  justify-content: flex-end;
}

i.bi.bi-instagram {
  font-size: 18px;
  color: black;
}
</style>
