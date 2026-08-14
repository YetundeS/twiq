import SpinnerLoader from '@/components/dashboardComponent/spinnerLoader';
import './authVisit.css';

const AuhVisitBtn = ({ text = "Sign In", black, red, onClick, loading }) => {
    return (
        <div onClick={onClick} className={`authVisitBtn ${black ? 'black' : ''} ${red ? 'red' : ''}`}>
            {!loading ? (
                <p>{text}</p>
            ) : (
                <SpinnerLoader inline />
            )}</div>
    )
}

export default AuhVisitBtn