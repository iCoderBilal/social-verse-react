import React, {useEffect, useState} from 'react';
import axios from "axios";

export default function useLeftPaneImage(props) {

    const [leftPaneImageURL, setLeftPaneImageURL] = useState(null);

    useEffect(() => {

        const unsplashAxios = axios.create({
            transformRequest: (data, headers) => {
                //Remove all headers for unsplash, preflight fails for custom added headers
                //such as our bearer token
                delete headers.common;
            }
        });

        unsplashAxios.head(
            "https://source.unsplash.com/1138x1390/?mobile,person"
        ).then((response) => {
            setLeftPaneImageURL(response.request.responseURL);
        });
    }, [])

    return {leftPaneImageURL}
}
