import { CircularProgress } from '@mui/material';
import './authVisit.css';

const AuhVisitBtn = ({ text = "Sign In", black, red, onClick, loading }) => {
    return (
        <div onClick={onClick} className={`authVisitBtn ${black ? 'black' : ''} ${red ? 'red' : ''}`}>
            {!loading ? (
                <p>{text}</p>
            ) : (
                <CircularProgress color="white" size="17px" />
            )}</div>
    )
}

export default AuhVisitBtn