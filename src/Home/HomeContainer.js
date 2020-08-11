import React from 'react'

import Tagline from './Tagline.js'
import How from './How.js'
import About from './About.js'
import Testimonials from './Testimonials.js'

import styles from './HomeContainer.module.scss';

/**
 * A wrapper class for the entire home page. Components include
 * Tagline, How, About, Testimonials, FAQ.
 */
function HomeContainer(){
  return(
    <div className={styles.body}>
      <Tagline />
      <How />
      <About />
      <Testimonials />
    </div>
  );
}

export default HomeContainer
