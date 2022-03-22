import React, {useEffect, useRef} from 'react';
import Feed from "../../components/Mobile/Feed";
import axios from "axios";
import {useDispatch} from "react-redux";
import {prependPost} from "../../store/ui";
import {useNavigate, useParams} from "react-router";

function SinglePost(props) {
    const isLoading = useRef(true);
    const {identifier, slug} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        axios.get("/posts/" + identifier + "/" + slug).then((response) => {
            dispatch(prependPost(response.data))
        }).catch(() => {
            navigate('/404');
        }).finally(() => {
            isLoading.current = false;
        });
    }, [])

    if(isLoading.current){
        return <></>
    }

    return (
        <>
            <Feed/>
        </>
    );
}

export default SinglePost;