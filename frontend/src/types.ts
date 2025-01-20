export interface Blog{
    _id:string,
    title:string,
    data:Array<{content:string, type:'text'|'img'}>,
    featuredImage:string|null,
    created_at:string,
    userId?:{
        _id:string,
        fname:string,
        lname:string,
    }
}

export interface featuredImg{
    blob:File|null,
    url:string|null
}