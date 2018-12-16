import React from 'react';
import styled from 'styled-components';
import { media } from '../lib/style-utils';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
    width: 700px;
    margin: 0 auto; 
    padding: 1rem;

    ${media.mobile`
        width: 100%;    
    `}
`;

const Container = ({visible, children}) => visible ? (
    <Wrapper>
        {children}
    </Wrapper>
) : null;

Container.propTypes = {
    visible: PropTypes.bool
};

export default Container;