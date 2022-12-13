import React from 'react';
import { Image } from 'react-bootstrap';

class Home extends React.Component {
    submitInvoice =() =>{
        console.log("invoice submitted")
    }
    render() {
        return (
            <div>
                <div className='home-container'>
                    <Image className='home-image' src="cracker.jpg"/>
                    <h1 className="centered">Mitra Mandal</h1>
                </div>
            </div>
        );
    }
}

export default Home