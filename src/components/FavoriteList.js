import React from 'react';
import styled from 'styled-components';
import FavoriteItem from './FavoriteItem';
import PropTypes from 'prop-types';

const Wrapper = styled.div`

    position: relative; 
    display: flex;
    flex-wrap: wrap; 
`;

const FavoriteList = ({contacts}) => {
    const favoriteList = contacts
                        .filter( 
                            contact => contact.favorite
                        ).map(
                            contact => (
                                <FavoriteItem 
                                    key={contact.id} 
                                    contact={contact}
                                />
                            )
                        );

    return (
        <Wrapper>
            {favoriteList}
        </Wrapper>
    );
};

FavoriteList.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object)
};

export default FavoriteList;