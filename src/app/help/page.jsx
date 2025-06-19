'use client';

import TwiqBg from "@/components/dashboardComponent/twiqBg";
import { FAQSection } from "@/components/landingPageComponents/FAQSection";
import { Header } from "@/components/landingPageComponents/Header";
import { helpVideos } from "@/constants/model";
import "@/styles/platformStyles.css";
import './help.css';

const Help = () => {

    return ( 
        <div className="page_content">
                <Header />
            <TwiqBg />
            <div className="help_content">
                <div className="helpVideosSection">
                    <h3 className="helpTitle">Help Videos</h3>
                    <div className="helpVideosWrapper">
                        {helpVideos?.map((video, i) => (
                            <div key={i} className="w-full aspect-video">
                                <iframe
                                    className="w-full h-full rounded-md"
                                    src={`https://www.youtube.com/embed/${video}`}
                                    title="YouTube video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="faqSection">
                    {/* <FAQ /> */}
                    <FAQSection />
                </div>
            </div>
        </div>
    )
}

export default Help