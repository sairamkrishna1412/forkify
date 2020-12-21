export default class Likes{
    constructor(){
        this.Likes=[];
    }
    addLike(id,title,publisher,imgUrl){
        const item={
            id,
            title,
            publisher,
            imgUrl
        }
        this.Likes.push(item);
        this.changeStorage();
        return item;
    }
    removeLike(id){
        const index = this.Likes.findIndex(el=>el.id==id);
        this.Likes.splice(index,1);
        this.changeStorage();
    }
    isLiked(id){
        return this.Likes.findIndex(el=>el.id==id)!==-1;
    }
    getNumLikes(){
        return this.Likes.length;
    }
    changeStorage(){
        localStorage.setItem('likes',JSON.stringify(this.Likes));
    }
    retriveStorage(){
        const storage=JSON.parse(localStorage.getItem('likes'));
        if(storage){
            this.Likes=storage;
        }
    }
}   