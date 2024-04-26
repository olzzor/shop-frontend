<template>
  <div v-if="show">
    <div class="modal-overlay" @click="closeModal"></div>

    <div class="modal-content">
      <!-- 메인 카테고리와 서브 카테고리를 순회하여 체크박스로 표시 -->
      <div v-for="cat in categories" :key="cat.code">
        <input type="checkbox" :value="{code: cat.code, name: cat.name}" :checked="isSelectedCategory(cat.code)"
               @change="handleCategoryChange('main', {code: cat.code, name: cat.name}, $event.target.checked)" />
        <label>&nbsp;{{ cat.name }}</label>

        <div v-if="cat.subCategories" style="margin-left: 20px;">
          <div v-for="subCat in cat.subCategories" :key="subCat.code">
            <input type="checkbox" :value="{code: subCat.code, name: subCat.name}" :checked="isSelectedCategory(subCat.code)"
                   @change="handleCategoryChange('sub', {code: subCat.code, name: subCat.name}, $event.target.checked)" />
            <label>&nbsp;{{ subCat.name }}</label>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button type="button" class="button btn-select" @click="select">선택</button>
        <button type="button" class="button btn-cancel" @click="cancel">취소 (선택 안함)</button>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import constants from "@/scripts/constants";

export default {
  name: "SearchCategoryModal",
  props: {show: Boolean},
  setup(props, {emit}) {
    const categories = constants.CATEGORIES;
    const selectedCategories = ref([]);

    const isSelectedCategory = (code) => {
      return selectedCategories.value.some(cat => cat.code === code);
    };

    const updateMainCategorySelection = () => {
      categories.forEach(mainCat => {
        const allSubSelected = mainCat.subCategories?.every(subCat =>
            selectedCategories.value.some(cat => cat.code === subCat.code));

        const mainIndex = selectedCategories.value.findIndex(cat => cat.code === mainCat.code);

        if (allSubSelected && mainIndex === -1) {
          // 모든 서브 카테고리가 선택되어 있고, 메인 카테고리가 아직 선택되지 않았다면, 메인 카테고리를 선택합니다.
          selectedCategories.value.push({ code: mainCat.code, name: mainCat.name });
        } else if (!allSubSelected && mainIndex !== -1) {
          // 서브 카테고리 중 하나라도 선택되지 않았고, 메인 카테고리가 선택되어 있다면, 메인 카테고리의 선택을 해제합니다.
          selectedCategories.value.splice(mainIndex, 1);
        }
      });
    };

    const handleCategoryChange = (type, category, isChecked) => {

      if (type === 'main') { // 메인 카테고리 선택/해제 처리
        const categoryIndex = selectedCategories.value.findIndex(cat => cat.code === category.code);

        if (isChecked) { // 체크박스를 선택한 경우
          if (categoryIndex === -1) {
            // 메인 카테고리를 selectedCategories에 추가
            selectedCategories.value.push(category);
          }

          // 해당 메인 카테고리의 모든 서브 카테고리도 추가
          const mainCategory = categories.find(cat => cat.code === category.code);
          if (mainCategory && mainCategory.subCategories) {
            mainCategory.subCategories.forEach(subCat => {
              if (!selectedCategories.value.some(cat => cat.code === subCat.code)) {
                selectedCategories.value.push({ code: subCat.code, name: subCat.name });
              }
            });
          }

        } else { // 체크박스를 선택 해제한 경우
          if (categoryIndex !== -1) {
            // 메인 카테고리를 selectedCategories에서 제거
            selectedCategories.value.splice(categoryIndex, 1);
          }

          // 해당 메인 카테고리의 모든 서브 카테고리도 제거
          const mainCategory = categories.find(cat => cat.code === category.code);
          if (mainCategory && mainCategory.subCategories) {
            mainCategory.subCategories.forEach(subCat => {
              const subCatIndex = selectedCategories.value.findIndex(cat => cat.code === subCat.code);
              if (subCatIndex !== -1) {
                selectedCategories.value.splice(subCatIndex, 1);
              }
            });
          }
        }

      } else { // 서브 카테고리 선택/해제 처리
        const subCategoryIndex = selectedCategories.value.findIndex(cat => cat.code === category.code);

        if (isChecked && subCategoryIndex === -1) {
          selectedCategories.value.push(category);
        } else if (!isChecked && subCategoryIndex !== -1) {
          selectedCategories.value.splice(subCategoryIndex, 1);
        }

        updateMainCategorySelection();
      }
    };

    const select = () => {
      let selected = null;

      if (selectedCategories.value.length > 0) {
        selected = selectedCategories.value.map(category => {
          return {
            code: category.code,
            name: category.name
          };
        });
      }

      emit('category-selected', selected);
      closeModal();
    }

    const cancel = () => {
      emit('category-selected', null);
      closeModal();
    }

    const closeModal = () => {
      emit('close');
    }

    return {
      categories, selectedCategories,
      isSelectedCategory, handleCategoryChange,
      select, cancel, closeModal
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/admin/coupon/search-product-modal";
</style>
