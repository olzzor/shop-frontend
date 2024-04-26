
export default {
    categoryCodes: ['tops', 'shirts', 'sweats', 'knits', 'pants', 'jeans', 'skirts', 'outer', 'headwear', 'footwear', 'accessories'],

    getCategoryName(key) {
        switch (key) {
            case 'all':
                return 'ALL';
            case 'tops':
                return 'TOPS';
            case 'shirts':
                return 'SHIRTS';
            case 'sweats':
                return 'SWEATS';
            case 'knits':
                return 'KNITS';
            case 'pants':
                return 'PANTS';
            case 'jeans':
                return 'JEANS';
            case 'skirts':
                return 'SKIRTS';
            case 'outer':
                return 'OUTER';
            case 'headwear':
                return 'HEADWEAR';
            case 'footwear':
                return 'FOOTWEAR';
            case 'accessories':
                return 'ACCESSORIES';
            default:
                return key;
        }
    },
}