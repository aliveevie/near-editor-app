import './loader.css';

export function Builder({source, text}) {
    return (
        <div className="container">
            <img src={source}  />
            <p>{text}</p>
        </div>
    );
}

export function Success({source, text}) {
    return (
        <div className="container">
            <img src={source}  />
            <p>{text}</p>
        </div>
    );
}

export function Deploy({source, text}) {
    return (
        <div className="container">
            <img src={source}  />
            <p>{text}</p>
        </div>
    );
}

export function Error({source, text}) {
    return (
        <div className="container">
            <img src={source}  />
            <p>{text}</p>
        </div>
    );
}
