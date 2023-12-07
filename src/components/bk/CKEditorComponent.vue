<template>
  <div>
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>

<script>
import {computed, ref, toRefs} from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload';
// import {Bold, Italic} from '@ckeditor/ckeditor5-basic-styles';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';

export default {
  name: 'CKEditorComponent',
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    modelValue: {
      type: String, default: ''
    },
    uploadType: {
      type: String, default: 'notice'
    }
  },
  setup(props, {emit}) {
    const {modelValue} = toRefs(props);

    const editor = ref(ClassicEditor);
    const editorConfig = ref({
      // plugins: [ImageUpload],
      // toolbar: ['imageUpload'],
      // plugins: [Bold, Italic],
      // toolbar: ['bold', 'italic'],
      // plugins: [SimpleUploadAdapter],
      // toolbar: ['imageUpload'],
      // simpleUpload: {
      //   uploadUrl: 'http://localhost.test:8080/api/file-upload/image',
      //   withCredentials: true,
      //   headers: {
      //     "upload-type": props.uploadType,
      //     // "upload-folder": props.uploadFolder ? props.uploadFolder : "root",
      //     // "upload-editor": props.uploader ? props.uploader : "",
      //   },
      // }
    });

    const editorData = computed({
      get: () => modelValue.value,
      set: (value) => emit('update:modelValue', value)
    });

    return {
      editor,
      editorData,
      editorConfig,
    };
  }
};
</script>

<style>
.ck-editor__editable_inline {
  min-height: 700px;
}
</style>
