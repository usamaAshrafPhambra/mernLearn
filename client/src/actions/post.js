import axios from 'axios'
import { setAlert }  from './alter'
import {
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types'

//get posts
export const getPosts = ()=> async dispatch =>{
    try {
        const res = await axios.get('/api/post');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};

//add like
export const addLike = id => async dispatch =>{
    try {
        const res = await axios.put(`/api/post/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};


//remove likes
export const removeLike = id => async dispatch =>{
    try {
        const res = await axios.put(`/api/post/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        });
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};


//delete post
export const deletePost = id => async dispatch =>{
    try {
        await axios.delete(`/api/post/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id
        });

        dispatch(setAlert('Post deleted!', 'success'))
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};


//add post
export const addPost = formData => async dispatch =>{
    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/post`, formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(setAlert('Post Created!', 'success'));
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};

//get post
export const getPost = id => async dispatch =>{
    try {
        const res = await axios.get(`/api/post/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        });
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};


//add comment
export const addComment = (postId,formData) => async dispatch =>{
    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/post/comments/${postId}`, formData, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });

        dispatch(setAlert('Comment added!', 'success'));
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};


//delete comment
export const deleteComment = (postId,commentId) => async dispatch =>{
    
    try {
        await axios.delete(`/api/post/comments/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });

        dispatch(setAlert('Comment removed!', 'success'));
        
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText , status:  err.response.status }
        });
    }
};
