import config from '../config.js'

function calculateOffset(numberPage) {
    let offset = 0
    if (numberPage && !isNaN(numberPage) && numberPage > 0) {
        offset = (numberPage - 1) * config.rows_per_page
    }
    return offset
}

const general_utils = { calculateOffset }

export default general_utils