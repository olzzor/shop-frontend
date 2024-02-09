import axios from 'axios';
import {onMounted} from "vue";

let categories = [];

onMounted(async () => {
    const response = await axios.get("/api/categories/get");
    categories = response.data;
});

export default {
    getCategories() {
        return categories;
    }
};