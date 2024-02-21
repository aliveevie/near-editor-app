import './loader.css';



export function Loader({source, text}) {
    return (
        <div className="container">
            <img src={source} alt='This is Success' />
            <p>{text}</p>
        </div>
    );
}
