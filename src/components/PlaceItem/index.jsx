import React, { useContext } from 'react';
import axios from 'axios';
import { RiHeartAddLine as Heart } from 'react-icons/ri';
import { FaRegTrashAlt as Trash } from 'react-icons/fa';
import { Context } from '../../Context';
import useNearScreen from '../../hooks/useNearScreen';
import Modal from '../Modal';

import { Item, Details, Button, Title, Image, ImageContainer, Price, Location, Link } from './styles';

const PlaceItem = ({ _id, mainImage, name, location, price, isFavorite = false, modalIsOpen, openModal, closeModal, history, setFavorites }) => {
  const { profileId, userId } = useContext(Context);
  const [show, element] = useNearScreen();

  const addFavorite = async (event) => {
    const { target } = event;
    console.log(target.id);
    try {
      await axios.post('https://peaceful-bastion-02967.herokuapp.com/api/favorites', {
        profileId,
        placeId: target.id,
      });
      openModal();
    } catch (error) {
      console.log(error);
    }

  };
  const deleteFavorite = async (event) => {
    const { target } = event;
    try {
      await axios.delete('https://peaceful-bastion-02967.herokuapp.com/api/favorites', {
        data: {
          profileId: userId,
          placeId: target.id,
        },
      });

      const { data } = await axios.get('https://peaceful-bastion-02967.herokuapp.com/api/favorites', {
        headers: {
          'profileid': profileId,
        },
      });

      const favoritesArray = data.data;
      setFavorites(favoritesArray);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Item ref={element}>
      {
        show && (
          <>
            <ImageContainer>
              <Image src={mainImage} alt='Roomie' />
              {
                isFavorite ?
                  <Button id={_id} onClick={deleteFavorite}><Trash id={_id} color='#e91e63' size='24px' /></Button> :
                  <Button id={_id} onClick={addFavorite}><Heart id={_id} color='#BACD25' size='24px' /></Button>
              }
              <Modal isOpen={modalIsOpen} closeModal={closeModal}>
                Added to favorites!
              </Modal>
            </ImageContainer>
            <Details>
              <Title>{name}</Title>
              <Location>{location}</Location>
              <Price>
                {`$${price} COP `}
                <span>
                  {' per month'}
                </span>
              </Price>
              <Link to={`/places/${_id}`}>
                Learn more
              </Link>
            </Details>
          </>
        )
      }

    </Item>
  );
};

export default PlaceItem;
