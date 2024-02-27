<template>
  <div>
    <div ref="editorRef"/>
  </div>
</template>

<script>
import {onMounted, ref, watch} from 'vue';
import axios from "axios";
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

export default {
  name: 'ToastUIEditorComponent',
  props: {
    modelValue: {type: String, required: false, default: '',},
    uploadType: {type: String, required: true, default: '',},
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const editorRef = ref(null);
    let editorInstance = null;
    let isInternalChange = false; // 에디터 내부 변경 여부를 추적하는 플래그

    const onUploadImage = async (blob, callback) => {
      const formData = new FormData();
      formData.append('image', blob);

      axios.post('/api/toast-ui/image-upload', formData, {
        headers: {'upload-type': props.uploadType}

      }).then((data) => {
        callback(data.url, 'image');

      }).catch((error) => {
        console.error('Error uploading image:', error);
      });
    };

    onMounted(() => {
      editorInstance = new Editor({
        el: editorRef.value, // 컨테이너 요소 선택자
        height: '100%', // 에디터 높이
        width: '100%', // 에디터 너비
        initialEditType: 'wysiwyg', // 에디터의 초기 입력 값을 지정
        previewStyle: 'vertical', // 에디터의 세로의 크기를 지정
        language: 'ko-KR',
        plugins: [colorSyntax],
        // TODO: align 기능...............?
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote', 'ul', 'ol', 'task'],
          ['indent', 'outdent',],
          ['image', 'link', 'code', 'codeblock'],
        ],
        events: {
          change: () => {
            if (!isInternalChange) {
              emit('update:modelValue', editorInstance.getMarkdown());
            }
            isInternalChange = false;
          },
          // change: () => emit('update:modelValue', editorInstance.getMarkdown()),
        },
        hooks: {
          addImageBlobHook: onUploadImage
        },
      });
    });

    watch(() => props.modelValue, (newValue) => {
      if (editorInstance && editorInstance.getMarkdown() !== newValue) {
        isInternalChange = true; // 외부 변경으로 인한 업데이트임을 표시
        editorInstance.setMarkdown(newValue);
      }
    });

    return {
      editorRef
    };
  }
};
</script>

<style scoped>

</style>
