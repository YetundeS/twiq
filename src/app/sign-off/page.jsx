"use client"


import AuhVisitBtn from '@/components/authComponents/authForms/auhVisitBtn';
import CopyrightTxt from '@/components/dashboardComponent/copyrightTxt';
import Image from 'next/image';

import '@/components/authComponents/authForms/authVisit.css';
import TwiqBg from '@/components/dashboardComponent/twiqBg';
import { Header } from '@/components/landingPageComponents/Header';
import { useRouter } from 'next/navigation';
import '../auth/auth.css';


const SignOffPage = () => {
    const router = useRouter();

    const goToAuth = () => {
        router.push('/');
    };

    return (
        <div className="authPage min-h-screen ">
            <div className="innerauthPage animate-fade-in-up transition-colors duration-300">
                <Header />
                <TwiqBg />
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
                            <h2 className='second'>SEE YOU <br /> SHORTLY</h2>
                        </div>
                    </div>

                    <div className="authVisit_center">
                        <div className="authButtons">
                            <AuhVisitBtn onClick={goToAuth} black text="Sign On" />
                        </div>
                        <a href="/help" className="needHelp out">need help?</a>
                    </div>
                    <CopyrightTxt />
                </div>
            </div>
        </div>
    )
}

export default SignOffPage