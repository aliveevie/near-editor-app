import './loader.css';

import success from '../assets/builder.gif';
import deploy from '../assets/deploy.gif';
import error from '../assets/error.gif';
import builder from '../assets/builder.gif';


export function Loader({source, text}) {
    return (
        <div className="container">
            <img src={success} alt='This is Success' />
            
        </div>
    );
}
