import React from 'react'

import logo from '../Media/Logo.svg'
import background from '../Media/HeroIcon-mobile.svg'

import styles from './A_Tagline.module.scss';

import { LinkContainer } from 'react-router-bootstrap'

function Tagline(){

  const handleLogin = ()=>{
    alert("Hi")
  }

  const handleApply = ()=>{
    alert("Please log in first!");
  }

  return(
    <>
      <div className={styles.diagonalBox}>
        <div className={styles.content}>
            <div className={styles.heroImage}>

                <ul className={styles.nav}>
                    <li className={styles.logo}>
                        <img src={logo} alt="Logo"/>
                        <p className={styles.asesText}>ASES</p>
                        <p className={styles.abroadText}>Abroad</p>
                    </li>
                    <li>
                        <LinkContainer to="/login">
                          <div className={styles.signIn}>Sign in</div>
                        </LinkContainer>
                    </li>
                </ul>

                <div className={styles.tagline}>
                    <h1>STANFORD'S GLOBALLY FOCUSED STUDENT ENTRIPRENEURSHIP</h1>
                    <p>Lorem ipsum dolor sit amet. cons adipiscing elit.</p>
                    <div className={styles.buttonWrap}>
                      <button onClick={handleApply}className={styles.mainButton} type="button">
                        APPLY
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </div>

      <div className={`${styles.diagonalBox} ${styles.bgOne}`}> </div>
    </>
  );
}

export default Tagline
