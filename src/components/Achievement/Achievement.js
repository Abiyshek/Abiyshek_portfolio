import React, { useContext, useRef, useState } from 'react';
import Slider from 'react-slick';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import './Achievement.css';
import { ThemeContext } from '../../contexts/ThemeContext';
import { achievementData } from '../../data/achievementData';

// Import certificates
import cert1 from '../../assets/certificates/IMG_20260410_082639.jpg';
import cert2 from '../../assets/certificates/IMG_20260410_082822.jpg';
import cert3 from '../../assets/certificates/IMG_20260410_083016.jpg';
import cert4 from '../../assets/certificates/IMG_20260410_083058.jpg';
import cert5 from '../../assets/certificates/IMG_20260410_083141.jpg';
import cert6 from '../../assets/certificates/IMG_20260413_211642.jpg';
import cert7 from '../../assets/certificates/IMG_20260413_215110.jpg';
import cert8 from '../../assets/certificates/Screenshot_2026_0410_075459.jpg';
import cert9 from '../../assets/certificates/Screenshot_2026_0410_075530.jpg';
import cert10 from '../../assets/certificates/Screenshot_2026_0410_075550.jpg';

const certificateImages = [
    cert1, cert2, cert3, cert4, cert5,
    cert6, cert7, cert8, cert9, cert10
];

function Achievement() {
    const { theme } = useContext(ThemeContext);
    const sliderRef = useRef();
    const [selectedCert, setSelectedCert] = useState(null);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        arrows: false,
        draggable: true,
        swipeToSlide: true,
        swipe: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    const gotoNext = () => {
        sliderRef.current.slickNext();
    };

    const gotoPrev = () => {
        sliderRef.current.slickPrev();
    };

    return (
        <>
            {certificateImages.length > 0 && (
                <div className="achievement" id="achievement" style={{backgroundColor: theme.secondary}}>
                    <div className="achievement-body">
                        <h1 style={{color: theme.primary}}>Certifications</h1>
                        <h4 style={{color:theme.tertiary}}>{achievementData.bio}</h4>
                    </div>
                    <div className="achievement-slider-container">
                        <div className="achievement-slider">
                            <Slider {...settings} ref={sliderRef}>
                                {certificateImages.map((cert, index) => (
                                    <div className="cert-card-wrapper" key={index}>
                                        <div className="cert-card" onClick={() => setSelectedCert(cert)}>
                                            <img src={cert} alt={`Certificate ${index + 1}`} />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className="achievement-slider-buttons">
                            <button
                                className='prevBtn'
                                onClick={gotoPrev}
                                style={{ backgroundColor: theme.primary, color: theme.secondary }}
                            >
                                <FaArrowLeft aria-label='Previous certificates' />
                            </button>
                            <button
                                className='nextBtn'
                                onClick={gotoNext}
                                style={{ backgroundColor: theme.primary, color: theme.secondary }}
                            >
                                <FaArrowRight aria-label='Next certificates' />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedCert && (
                <div className="cert-modal-overlay" onClick={() => setSelectedCert(null)}>
                    <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedCert} alt="Certificate Full View" />
                        <button 
                            className="close-modal-btn" 
                            onClick={() => setSelectedCert(null)}
                            style={{ color: theme.secondary, backgroundColor: theme.primary }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Achievement;
