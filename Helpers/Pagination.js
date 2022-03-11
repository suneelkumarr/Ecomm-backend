//pagination query 
const PaginateQueryParams =data =>{
    let limit = 10
    let page =1

    if(data.page) page = parseInt(data.page)
    if(data.page && parseInt(data.page) <= 0) page = 1

    if(data.limit) limit = parseInt(data.limit)
    if(data.limit && parseInt(data.limit) <= 0) limit = 10

    return {limit, page}
}

//Next page
const NextPage = (page, totalpages) => {
    if(page && page >= totalpages){
        return null
    }
    return page + 1
}

// prev page 
const PrevPage = (page) => {
    if(page && page === 1){
        return null
    }
    return page - 1
}

//pagination
const Paginate = data => {
    const page = parseInt(data.page)
    const limit = parseInt(data.limit)
    const totalItems = parseInt(data.totalItems)

    if(!totalItems) return null

    const pageTotal = Math.ceil(totalItems / limit)
    return {
        items:totalItems,
        limit:limit,
        page:page,
        totalPage: pageTotal,
        prev: PrevPage(page),
        next: NextPage(page, pageTotal)
    }
}


module.exports = {
    PaginateQueryParams,
    Paginate
}