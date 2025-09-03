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
                        {helpVideos && helpVideos.length > 0 ? (
                            helpVideos.map((video, i) => (
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
                            ))
                        ) : (
                            <div className="w-full max-w-4xl mx-auto">
                                <div className="rounded-2xl border border-gray-200/50 bg-[#F0D0D0] shadow-lg backdrop-blur-sm dark:border-gray-500/50 dark:bg-[#6C363A] p-8 text-center">
                                    <div className="text-gray-900 dark:text-gray-100">
                                        <h4 className="text-2xl font-semibold mb-4">🎬 Help Videos Coming Soon!</h4>
                                        <div className="space-y-2">
                                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">We're currently updating our help videos with fresh content.</p>
                                            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">Check back soon for detailed tutorials and guides.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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