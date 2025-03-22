import { createSlice, nanoid } from "@reduxjs/toolkit";

// getting comments from localStorage
const loadComments = () => {
    const data = localStorage.getItem("comments");
    return data ? JSON.parse(data) : {};
  };

  // Saving comments to localStorage
const saveComments = (comments) => {
    localStorage.setItem("comments", JSON.stringify(comments));
  };

const commentsSlice = createSlice({
    name:"comments",
    initialState: loadComments(),
    reducers:{
        addComment:(state, action)=>{
            const {imageId, text, position} = action.payload ;
            const newComment = {
                    id: nanoid(),
                    imageId,
                    text,
                    position,
                    replies: [],
            };

            if(!state[imageId]){
                state[imageId] = [] ;
            }
            state[imageId].push(newComment) ;
            saveComments(state) ;
        },

        addReply:(state, action)=>{
            const{imageId, commentId, text} = action.payload ;
            const comment = state[imageId]?.find((c)=> c.id === commentId) ;

            if(comment){
                comment.replies.push({
                    id:nanoid(),
                    text
                });
                saveComments(state) ;
            }
        },

        editComment: (state,action)=>{
            const {imageId, commentId, newText} = action.payload ;
            const comment = state[imageId].find((c)=> c.id === commentId) ;
            if(comment){
                comment.text = newText ;
                saveComments(state) ;
            }
        },

        deleteComment: (state, action) =>{
            const {imageId, commentId} = action.payload ;
            state[imageId] = state[imageId].filter((comment)=>{
                return comment.id !== commentId ;
            })

            // Removes the key entirely if no comments left
            if (state[imageId].length === 0) {
                delete state[imageId]; 
            }

            saveComments(state) ;
        }
    }
})

export const { addComment, addReply, editComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;