import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import SocialLinks from '../components/SocialMediaLinks';
import './custom.scss';
import './fonts.css';

const typeBase = `
  font-feature-settings:"kern" 1;
  font-kerning: normal;
  -webkit-font-smoothing: antialiased; /* Chrome, Safari */
  -moz-osx-font-smoothing: grayscale; /* Firefox */
`;

const helvetica = `"Suisse Intl", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif`;
const pressura = `"GT Pressura", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif`;

const theme = {
  white: '#FFFFFF',
  grey: '#F8F7F5',
  black: '#000000',
  blue: '#3E01FF',
  titleFont: helvetica,
};


const GlobalStyle = createGlobalStyle`
  ::selection {
    color: ${(props) => props.theme.black};
    background: ${(props) => props.theme.blue};
  }

  body {
      background: ${(props) => props.theme.grey};
      color: ${(props) => props.theme.black};

      font-feature-settings: 'kern';
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }

  a {
    ${typeBase}
      color: ${(props) => props.theme.black};
      text-decoration: none;
      transition: 0.2s ease-in color;
  }

  a:hover {
    color: ${(props) => props.theme.blue};
      text-decoration: none;
      transition: 0.2s ease color;
  }

  h1 {
    ${typeBase}
    font-family: ${helvetica};
      letter-spacing: -0.05rem;
      line-height: 1;
      font-weight: 800;
      font-size: 5.3125rem;  

      @media (max-width: 768px) { 
        font-size: 2.25rem; 
        line-height: 1.15; 
        letter-spacing: -0.01rem;
       }
  }

  h2 {
    ${typeBase}
    font-family: ${helvetica};
      line-height: 1.2;
      font-size: 4.375rem;
      font-weight: 800;

      @media (max-width: 768px) { 
        font-size: 40px; 
        line-height: 1.3; 
       }
  }

  h3 {
    ${typeBase}
    font-family: ${pressura};
    font-size: 1.875rem;
    font-weight: 300;

    @media (max-width: 768px) { 
        font-size: 1.5rem;  
       }
  }

  h4 {
    ${typeBase}
    font-family: ${helvetica};
    font-weight: 800;
    font-weight: 1.25rem;

    @media (max-width: 768px) { 
      font-size: 1.45rem;  
      line-height: 1.4;
    }
  }

  p {
    ${typeBase}
    font-family: ${helvetica};
    letter-spacing: 0.015em;
    word-spacing: 0.001em;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.45;

    @media (max-width: 768px) { 
      font-size: 1rem;  
    }
  }

  figcaption {
    ${typeBase}
    font-size: 1.2rem;
    padding-top: 0.2rem;
    font-family: ${pressura};
    font-weight: 300;

    @media (max-width: 768px) { 
      padding-top: 0.5rem;
        font-size: 1rem; 
        line-height: 1.25;
       }
  }

  blockquote p {
    ${typeBase}
    font-size: 1.875rem;
    padding-left: 2.5rem;
    font-family: ${helvetica};
    font-weight: 800;

    @media (max-width: 768px) { 
        font-size: 1.2rem;
        padding-left: 1.5rem;  
       }
  }
`;

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div className='mx-2 mx-md-3 my-5 my-md-6'>
      <GlobalStyle />
      <Nav />
      <main>{children}</main>
      <SocialLinks />
    </div>
    <Footer />
  </ThemeProvider>
);

export default Layout;
