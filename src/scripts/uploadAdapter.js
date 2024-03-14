import axios from "axios";

export default class UploadAdapter {
    constructor(loader, uploadType) {
        this.loader = loader;
        this.uploadType = uploadType;
    }

    /** 파일을 서버로 업로드하는 메소드 */
    upload() {
        // resolve: 프로미스가 성공적으로 완료되었음을 알리는 함수. 성공한 결과를 전달
        // reject: 프로미스가 실패했음을 알리는 함수. 오류 메시지나 오류 객체를 전달
        return this.loader.file.then(file => new Promise(((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);

            axios.post('/api/toast-ui/image-upload', formData, {
                headers: {'upload-type': this.uploadType}

            }).then(({data}) => {
                resolve({default: data.url});

            }).catch(error => {
                const errorMessage = error.response && error.response.data.message
                    ? error.response.data.message
                    : '업로드에 실패했습니다. 다시 시도해주세요.';
                window.alert(errorMessage);
                reject(errorMessage);
            });
        })));
    }

    /** 파일 업로드를 중단하는 메소드 */
    abort() {
    }
}