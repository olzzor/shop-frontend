<template>
  <div>
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>

<script>
import {computed, ref, toRefs} from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from "@/scripts/uploadAdapter";

export default {
  name: 'CKEditor',
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    modelValue: {
      type: String, default: ''
    },
    uploadType: {
      type: String, default: 'products'
    }
  },
  setup(props, {emit}) {
    function CustomUploadAdapterPlugin(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, props.uploadType); // Pass the uploadType prop to the adapter
      };
    }

    const editor = ref(ClassicEditor);

    const {modelValue} = toRefs(props);
    const editorData = computed({
      get: () => modelValue.value,
      set: (value) => emit('update:modelValue', value)
    });

    const editorConfig = ref({
      extraPlugins: [CustomUploadAdapterPlugin],
      toolbar: {
        items: [
          'undo', 'redo',
          '|', 'heading', 'fontFamily', 'fontSize',
          '|', 'bold', 'italic', 'underline', 'strikethrough', 'fontColor', 'fontBackgroundColor',
          '|', 'alignment', 'outdent', 'indent', 'bulletedList', 'numberedList',
          '|', 'link', 'uploadImage', 'mediaEmbed', 'blockQuote', 'horizontalLine', 'insertTable',
        ]
      },
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
        ]
      },
      fontSize: {
        options: [9, 11, 13, 15, 17, 19, 21]
      },
      fontColor: {
        colors: [
          {color: 'hsl(0, 0%, 10%)'}, {color: 'hsl(0, 0%, 12.5%)'}, {color: 'hsl(0, 0%, 25%)'}, {color: 'hsl(0, 0%, 37.5%)'},
          {color: 'hsl(0, 0%, 50%)'}, {color: 'hsl(0, 0%, 62.5%)'}, {color: 'hsl(0, 0%, 75%)'}, {color: 'hsl(0, 0%, 87.5%)'}, {color: 'hsl(0, 0%, 100%)'},
          {color: 'hsl(0, 100%, 10%)'}, {color: 'hsl(0, 100%, 20%)'}, {color: 'hsl(0, 100%, 30%)'}, {color: 'hsl(0, 100%, 40%)'},
          {color: 'hsl(0, 100%, 50%)'}, {color: 'hsl(0, 100%, 60%)'}, {color: 'hsl(0, 100%, 70%)'}, {color: 'hsl(0, 100%, 80%)'}, {color: 'hsl(0, 100%, 90%)'},
          {color: 'hsl(30, 100%, 10%)'}, {color: 'hsl(30, 100%, 20%)'}, {color: 'hsl(30, 100%, 30%)'}, {color: 'hsl(30, 100%, 40%)'},
          {color: 'hsl(30, 100%, 50%)'}, {color: 'hsl(30, 100%, 60%)'}, {color: 'hsl(30, 100%, 70%)'}, {color: 'hsl(30, 100%, 80%)'}, {color: 'hsl(30, 100%, 90%)'},
          {color: 'hsl(60, 100%, 10%)'}, {color: 'hsl(60, 100%, 20%)'}, {color: 'hsl(60, 100%, 30%)'}, {color: 'hsl(60, 100%, 40%)'},
          {color: 'hsl(60, 100%, 50%)'}, {color: 'hsl(60, 100%, 60%)'}, {color: 'hsl(60, 100%, 70%)'}, {color: 'hsl(60, 100%, 80%)'}, {color: 'hsl(60, 100%, 90%)'},
          {color: 'hsl(90, 100%, 10%)'}, {color: 'hsl(90, 100%, 20%)'}, {color: 'hsl(90, 100%, 30%)'}, {color: 'hsl(90, 100%, 40%)'},
          {color: 'hsl(90, 100%, 50%)'}, {color: 'hsl(90, 100%, 60%)'}, {color: 'hsl(90, 100%, 70%)'}, {color: 'hsl(90, 100%, 80%)'}, {color: 'hsl(90, 100%, 90%)'},
          {color: 'hsl(120, 100%, 10%)'}, {color: 'hsl(120, 100%, 20%)'}, {color: 'hsl(120, 100%, 30%)'}, {color: 'hsl(120, 100%, 40%)'},
          {color: 'hsl(120, 100%, 50%)'}, {color: 'hsl(120, 100%, 60%)'}, {color: 'hsl(120, 100%, 70%)'}, {color: 'hsl(120, 100%, 80%)'}, {color: 'hsl(120, 100%, 90%)'},
          {color: 'hsl(150, 100%, 10%)'}, {color: 'hsl(150, 100%, 20%)'}, {color: 'hsl(150, 100%, 30%)'}, {color: 'hsl(150, 100%, 40%)'},
          {color: 'hsl(150, 100%, 50%)'}, {color: 'hsl(150, 100%, 60%)'}, {color: 'hsl(150, 100%, 70%)'}, {color: 'hsl(150, 100%, 80%)'}, {color: 'hsl(150, 100%, 90%)'},
          {color: 'hsl(180, 100%, 10%)'}, {color: 'hsl(180, 100%, 20%)'}, {color: 'hsl(180, 100%, 30%)'}, {color: 'hsl(180, 100%, 40%)'},
          {color: 'hsl(180, 100%, 50%)'}, {color: 'hsl(180, 100%, 60%)'}, {color: 'hsl(180, 100%, 70%)'}, {color: 'hsl(180, 100%, 80%)'}, {color: 'hsl(180, 100%, 90%)'},
          {color: 'hsl(210, 100%, 10%)'}, {color: 'hsl(210, 100%, 20%)'}, {color: 'hsl(210, 100%, 30%)'}, {color: 'hsl(210, 100%, 40%)'},
          {color: 'hsl(210, 100%, 50%)'}, {color: 'hsl(210, 100%, 60%)'}, {color: 'hsl(210, 100%, 70%)'}, {color: 'hsl(210, 100%, 80%)'}, {color: 'hsl(210, 100%, 90%)'},
          {color: 'hsl(240, 100%, 10%)'}, {color: 'hsl(240, 100%, 20%)'}, {color: 'hsl(240, 100%, 30%)'}, {color: 'hsl(240, 100%, 40%)'},
          {color: 'hsl(240, 100%, 50%)'}, {color: 'hsl(240, 100%, 60%)'}, {color: 'hsl(240, 100%, 70%)'}, {color: 'hsl(240, 100%, 80%)'}, {color: 'hsl(240, 100%, 90%)'},
          {color: 'hsl(270, 100%, 10%)'}, {color: 'hsl(270, 100%, 20%)'}, {color: 'hsl(270, 100%, 30%)'}, {color: 'hsl(270, 100%, 40%)'},
          {color: 'hsl(270, 100%, 50%)'}, {color: 'hsl(270, 100%, 60%)'}, {color: 'hsl(270, 100%, 70%)'}, {color: 'hsl(270, 100%, 80%)'}, {color: 'hsl(270, 100%, 90%)'},
          {color: 'hsl(300, 100%, 10%)'}, {color: 'hsl(300, 100%, 20%)'}, {color: 'hsl(300, 100%, 30%)'}, {color: 'hsl(300, 100%, 40%)'},
          {color: 'hsl(300, 100%, 50%)'}, {color: 'hsl(300, 100%, 60%)'}, {color: 'hsl(300, 100%, 70%)'}, {color: 'hsl(300, 100%, 80%)'}, {color: 'hsl(300, 100%, 90%)'},
          {color: 'hsl(330, 100%, 10%)'}, {color: 'hsl(330, 100%, 20%)'}, {color: 'hsl(330, 100%, 30%)'}, {color: 'hsl(330, 100%, 40%)'},
          {color: 'hsl(330, 100%, 50%)'}, {color: 'hsl(330, 100%, 60%)'}, {color: 'hsl(330, 100%, 70%)'}, {color: 'hsl(330, 100%, 80%)'}, {color: 'hsl(330, 100%, 90%)'},
        ],
        columns: 9,
        documentColors: 9,
      },
      fontBackgroundColor: {
        colors: [
          {color: 'hsl(0, 0%, 10%)'}, {color: 'hsl(0, 0%, 12.5%)'}, {color: 'hsl(0, 0%, 25%)'}, {color: 'hsl(0, 0%, 37.5%)'},
          {color: 'hsl(0, 0%, 50%)'}, {color: 'hsl(0, 0%, 62.5%)'}, {color: 'hsl(0, 0%, 75%)'}, {color: 'hsl(0, 0%, 87.5%)'}, {color: 'hsl(0, 0%, 100%)'},
          {color: 'hsl(0, 100%, 10%)'}, {color: 'hsl(0, 100%, 20%)'}, {color: 'hsl(0, 100%, 30%)'}, {color: 'hsl(0, 100%, 40%)'},
          {color: 'hsl(0, 100%, 50%)'}, {color: 'hsl(0, 100%, 60%)'}, {color: 'hsl(0, 100%, 70%)'}, {color: 'hsl(0, 100%, 80%)'}, {color: 'hsl(0, 100%, 90%)'},
          {color: 'hsl(30, 100%, 10%)'}, {color: 'hsl(30, 100%, 20%)'}, {color: 'hsl(30, 100%, 30%)'}, {color: 'hsl(30, 100%, 40%)'},
          {color: 'hsl(30, 100%, 50%)'}, {color: 'hsl(30, 100%, 60%)'}, {color: 'hsl(30, 100%, 70%)'}, {color: 'hsl(30, 100%, 80%)'}, {color: 'hsl(30, 100%, 90%)'},
          {color: 'hsl(60, 100%, 10%)'}, {color: 'hsl(60, 100%, 20%)'}, {color: 'hsl(60, 100%, 30%)'}, {color: 'hsl(60, 100%, 40%)'},
          {color: 'hsl(60, 100%, 50%)'}, {color: 'hsl(60, 100%, 60%)'}, {color: 'hsl(60, 100%, 70%)'}, {color: 'hsl(60, 100%, 80%)'}, {color: 'hsl(60, 100%, 90%)'},
          {color: 'hsl(90, 100%, 10%)'}, {color: 'hsl(90, 100%, 20%)'}, {color: 'hsl(90, 100%, 30%)'}, {color: 'hsl(90, 100%, 40%)'},
          {color: 'hsl(90, 100%, 50%)'}, {color: 'hsl(90, 100%, 60%)'}, {color: 'hsl(90, 100%, 70%)'}, {color: 'hsl(90, 100%, 80%)'}, {color: 'hsl(90, 100%, 90%)'},
          {color: 'hsl(120, 100%, 10%)'}, {color: 'hsl(120, 100%, 20%)'}, {color: 'hsl(120, 100%, 30%)'}, {color: 'hsl(120, 100%, 40%)'},
          {color: 'hsl(120, 100%, 50%)'}, {color: 'hsl(120, 100%, 60%)'}, {color: 'hsl(120, 100%, 70%)'}, {color: 'hsl(120, 100%, 80%)'}, {color: 'hsl(120, 100%, 90%)'},
          {color: 'hsl(150, 100%, 10%)'}, {color: 'hsl(150, 100%, 20%)'}, {color: 'hsl(150, 100%, 30%)'}, {color: 'hsl(150, 100%, 40%)'},
          {color: 'hsl(150, 100%, 50%)'}, {color: 'hsl(150, 100%, 60%)'}, {color: 'hsl(150, 100%, 70%)'}, {color: 'hsl(150, 100%, 80%)'}, {color: 'hsl(150, 100%, 90%)'},
          {color: 'hsl(180, 100%, 10%)'}, {color: 'hsl(180, 100%, 20%)'}, {color: 'hsl(180, 100%, 30%)'}, {color: 'hsl(180, 100%, 40%)'},
          {color: 'hsl(180, 100%, 50%)'}, {color: 'hsl(180, 100%, 60%)'}, {color: 'hsl(180, 100%, 70%)'}, {color: 'hsl(180, 100%, 80%)'}, {color: 'hsl(180, 100%, 90%)'},
          {color: 'hsl(210, 100%, 10%)'}, {color: 'hsl(210, 100%, 20%)'}, {color: 'hsl(210, 100%, 30%)'}, {color: 'hsl(210, 100%, 40%)'},
          {color: 'hsl(210, 100%, 50%)'}, {color: 'hsl(210, 100%, 60%)'}, {color: 'hsl(210, 100%, 70%)'}, {color: 'hsl(210, 100%, 80%)'}, {color: 'hsl(210, 100%, 90%)'},
          {color: 'hsl(240, 100%, 10%)'}, {color: 'hsl(240, 100%, 20%)'}, {color: 'hsl(240, 100%, 30%)'}, {color: 'hsl(240, 100%, 40%)'},
          {color: 'hsl(240, 100%, 50%)'}, {color: 'hsl(240, 100%, 60%)'}, {color: 'hsl(240, 100%, 70%)'}, {color: 'hsl(240, 100%, 80%)'}, {color: 'hsl(240, 100%, 90%)'},
          {color: 'hsl(270, 100%, 10%)'}, {color: 'hsl(270, 100%, 20%)'}, {color: 'hsl(270, 100%, 30%)'}, {color: 'hsl(270, 100%, 40%)'},
          {color: 'hsl(270, 100%, 50%)'}, {color: 'hsl(270, 100%, 60%)'}, {color: 'hsl(270, 100%, 70%)'}, {color: 'hsl(270, 100%, 80%)'}, {color: 'hsl(270, 100%, 90%)'},
          {color: 'hsl(300, 100%, 10%)'}, {color: 'hsl(300, 100%, 20%)'}, {color: 'hsl(300, 100%, 30%)'}, {color: 'hsl(300, 100%, 40%)'},
          {color: 'hsl(300, 100%, 50%)'}, {color: 'hsl(300, 100%, 60%)'}, {color: 'hsl(300, 100%, 70%)'}, {color: 'hsl(300, 100%, 80%)'}, {color: 'hsl(300, 100%, 90%)'},
          {color: 'hsl(330, 100%, 10%)'}, {color: 'hsl(330, 100%, 20%)'}, {color: 'hsl(330, 100%, 30%)'}, {color: 'hsl(330, 100%, 40%)'},
          {color: 'hsl(330, 100%, 50%)'}, {color: 'hsl(330, 100%, 60%)'}, {color: 'hsl(330, 100%, 70%)'}, {color: 'hsl(330, 100%, 80%)'}, {color: 'hsl(330, 100%, 90%)'},
        ],
        columns: 9,
        documentColors: 9,
      },
      image: {
        resizeOptions: [
          {
            name: 'resizeImage:original',
            value: null,
            icon: 'original'
          },
          {
            name: 'resizeImage:50',
            value: '50',
            icon: 'medium'
          },
          {
            name: 'resizeImage:75',
            value: '75',
            icon: 'large'
          }
        ]
      },
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
  min-height: 500px;
}
</style>
