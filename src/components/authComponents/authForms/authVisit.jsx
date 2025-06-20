import CopyrightTxt from '@/components/dashboardComponent/copyrightTxt';
import Image from 'next/image';
import AuhVisitBtn from './auhVisitBtn';
import './authVisit.css';


const AuthVisit = ({ setActiveForm }) => {
    return (
        <div className='authVisit_wrapper'>
            <div className="authVisit_top">

                <div className="logoBox">
                    <Image
                        src={"/images/logo/auth_visit_logo.png"}
                        width={400}
                        height={260}
                        alt="twiq logo"
                        className="authVisitLogo"
                    />
                </div>
                <div className="authVisitTitle">
                    <h2 className='first'>content bots for</h2>
                    <h2 className='second'>thoughts <br /> leaders</h2>
                </div>
            </div>

            <div className="authVisit_center">
                <div className="authButtons">
                    <AuhVisitBtn onClick={() => setActiveForm('signin')} black text="Sign In"  />
                    <AuhVisitBtn onClick={() => setActiveForm('signup')} text="Sign Up"  />
                </div>
                <a href="/help" className="needHelp out">need help?</a>
            </div>
            <CopyrightTxt />
        </div>
    )
}

export default AuthVisit