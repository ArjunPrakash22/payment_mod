// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='footer_section'>
        <div className='location'>
          <b>LOCATION</b>
          <p>Mecode, Kaliakkavilai, Vilavancode Taluk. KanyaKumari District, Tamil Nadu 629-153</p>
        </div>
        <div className='Contact'>
          <b>CONTACT US</b>
          <p>04651-216674</p>
          <p>9042228199</p>
        </div>
        <div className='Email'>
        <b>EMAIL</b>
        <p><a href={`mailto:${encodeURIComponent('saseendraninstitute@gmail.com')}`}>saseendraninstitute@gmail.com</a></p>
        </div>
        <div className='WebsiteLinks'>
          <b>WEBSITE LINKS</b>
          <a target="_blank" href='https://nischennai.org/main/'>www.nischennai.org</a>
          <a target="_blank" href='https://www.ncismindia.org/'>www.ncismindia.org</a>
          <a target="_blank" href='https://ayush.gov.in/'>www.ayush.gov.in</a>
          <a target="_blank" href='https://www.tnmgrmu.ac.in/'>www.tnmgrmu.ac.in</a>
        </div>
      </div>
      <p style={{ color: 'black', fontWeight: 'bold' }}>
  © 2024 SSS MEDICAL COLLEGE & HOSPITAL. All rights reserved.
</p>
    </footer>
  );
};

export default Footer;
