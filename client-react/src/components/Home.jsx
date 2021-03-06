import React from 'react';
import {Link} from 'react-router-dom';

const Home = ({findMyMatch}) => (
    <div className="home-container">
        <div className="home-left-side">
            <h1>Adopt a local rescue dog who fits your lifestyle!</h1>
            <Link to={'/matchMe'}>
                <button className='findMyMatch'>Find my match</button>
            </Link>
        </div>
        <div className="home-right-side">
            <div className='home-pic'></div>
        </div>
    </div>
); 


export default Home;