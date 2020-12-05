const path = require('path');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const generateFavicons = (sizes) => {
  return sizes.map((size) => {
    return {
      src: `favicons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    };
  });
};

module.exports = {
  siteMetadata: {
    title: `UAL Creative Computing Institute`,
    description: `We are the first creative computing cohort of the UAL Creative Computing Institute.`,
    siteUrl: `https://creativecomputing.cci.arts.ac.uk/`,
    author: `@ual_cci`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/markdown-pages`,
        name: `markdown-pages`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              showCaptions: true,
              backgroundColor: 'transparent',
              quality: 80,
              withWebp: true,
              disableBgImageOnAlpha: true,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ual-cci-graduates-19`,
        short_name: `cci-msc-20`,
        start_url: `/`,
        background_color: `white`,
        theme_color: `white`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
        icons: generateFavicons([48, 72, 96, 144, 192, 256, 384, 512]),
      },
    },
    `gatsby-plugin-offline`,
  ],
};
