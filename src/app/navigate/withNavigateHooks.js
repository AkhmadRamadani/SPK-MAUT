import React from 'react';
import { useNavigate } from 'react-router-dom';

const withNavigateHooks = (Component) => {
    return (props) => {
        const navigation = useNavigate();

        return <Component navigation={navigation} {...props} />
    }
}

export default withNavigateHooks;