import React, { useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layout';
import Wrapper from '../../components/Wrapper';
import Form from '../../components/Form';
import Input from '../../components/Input';
import InputFile from '../../components/InputFile';
import FormButton from '../../components/FormButton';

import userDefault from '../../assets/static/userDefault.svg';

import { Avatar, TextArea, Label } from './styles';

const CreateProfile = () => {
  const [profileImage, setProfileImage] = useState(userDefault);

  const [form, setForm] = useState({
    isHost: false,
  });

  const handleTextInput = (event) => {
    const { target } = event;
    setForm({
      ...form,
      [target.name]: target.value,
    });
  };

  const handleFileInput = (event) => {
    const { target } = event;

    setForm({
      ...form,
      [target.name]: target.files[0],
    });

    const image = URL.createObjectURL(target.files[0]);
    setProfileImage(image);
  };

  const handleCheckInput = (event) => {
    const { target } = event;
    setForm({
      ...form,
      [target.name]: target.checked,
    });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    console.log('submit');
    const myDataForm = new FormData();
    Object.keys(form).forEach((entry) => {
      myDataForm.append(`${entry}`, form[entry]);
    });

    // Ensure this data is not sent when user doesn't want to be host
    if (form.isHost === false) {
      myDataForm.delete('whatsapp');
      myDataForm.delete('contactEmail');
      myDataForm.delete('about');
    }

    const sendDataForm = async () => {
      try {
        const { data } = await axios.post('https://peaceful-bastion-02967.herokuapp.com/api/profile', myDataForm, {});
        alert(data.message);
      } catch (error) {
        const { message } = error.response.data;
        alert(message);
      }

    };

    sendDataForm();

  };

  console.log(form);
  return (
    <Layout>
      <Wrapper>
        <Form title='Create your profile' onSubmit={handleOnSubmit}>
          <Avatar src={profileImage} />
          <InputFile onChange={handleFileInput} name='avatar' text='Upload your avatar' />
          <Input name='firstname' onChange={handleTextInput} text={'What\'s your name?'} />
          <Input name='lastname' onChange={handleTextInput} text={'What\'s your lastname?'} />
          <Label htmlFor='isHost'>
            Do you want to be a host?
            <input name='isHost' type='checkbox' onClick={handleCheckInput} />
          </Label>
          {
            form.isHost && (
              <>
                <Input name='contactEmail' onChange={handleTextInput} text='An email where guests can contact you' type='email' />
                <Input name='whatsapp' onChange={handleTextInput} text='A WhatsApp enabled phone number for guets to contact you' type='number' />
                <Label htmlFor='about'>Tell us about you</Label>
                <TextArea name='about' onChange={handleTextInput} id='' cols='30' rows='10' />
              </>
            )
          }
          <Input name='userId' onChange={handleTextInput} type='text' placeholder='USER ID (TEST)' />
          <FormButton text='Done' />
        </Form>
      </Wrapper>
    </Layout>
  );
};

export default CreateProfile;
