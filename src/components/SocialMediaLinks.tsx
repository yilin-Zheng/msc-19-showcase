import React from 'react';
import { Instagram, Twitter, Youtube, UAL } from './Icons';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;

  svg {
    fill: ${(props) => props.theme.black};
    transition: 0.15s ease-in fill;
  }

  svg:hover {
    fill: ${(props) => props.theme.blue};
    transition: 0.15s ease fill;
  }
`;

const SocialLinks = () => (
  <Wrapper className='d-none d-md-flex m-3 flex-column'>
    <a
      href='https://www.arts.ac.uk/creative-computing-institute'
      className='mb-2 mx-auto'
    >
      <UAL />
    </a>
    <a
      href='https://www.youtube.com/channel/UCtj43Vmw85ghSncJHW1xBVA'
      className='mb-2'
    >
      <Youtube />
    </a>
    <a
      href='https://twitter.com/ual_cci?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor'
      className='mb-2'
    >
      <Twitter />
    </a>
    <a href='https://www.instagram.com/ual_cci/?hl=en'>
      <Instagram />
    </a>
  </Wrapper>
);

export default SocialLinks;
