// import Image from 'next/image';
import './twiqBg.css';

const TwiqBg = () => {
    return (
        // <Image
        //     src={"/images/twiq_background.svg"}
        //     width={2000}
        //     height={2000}
        //     alt="twiq background"
        //     className="twiqBg"
        // />
        <div className="twiqBg">
            <TwiqBackground />
        </div>
    )
}

export default TwiqBg;


const TwiqBackground = () => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 16 1600 896"
    preserveAspectRatio="none"
  >
    <defs>
      <filter
        id="drop-shadow-1"
        x="197.98"
        y="0"
        width="1538.16"
        height="911.76"
        filterUnits="userSpaceOnUse"
      >
        <feOffset dx="-8" dy="8" />
        <feGaussianBlur result="blur" stdDeviation="8" />
        <feFlood floodColor="#0f1119" floodOpacity="0.5" />
        <feComposite in2="blur" operator="in" />
        <feComposite in="SourceGraphic" />
      </filter>
    </defs>
    <path
      d="M1720.06,16.06H166.14c11,55.48,28.74,110.38,53.84,163.49,37.19,78.69,91.3,154.01,166.28,208.55,74.98,54.55,172.54,86.25,261.45,73.19,125.17-18.38,205.94-115.46,301.4-185.09,160.66-117.17,387.04-161.63,603.42-118.52,29.6,5.9,59.01,13.44,88.74,18.43,28.78,4.83,54.97,5.77,78.79,3.41V16.06Z"
      fill="#b76e79"
      opacity="0.5"
    />
    <path
      d="M0,16.06c10.13,79.12,35.86,158.52,85.4,223.83,50.41,66.46,127.6,116.78,210.34,124.02,116.47,10.2,216.8-61.67,322.06-105.08,177.13-73.05,391.1-64.94,570.34,21.63,24.52,11.84,48.39,25.16,73.28,36.19,211.36,93.68,335.46-129.86,368.83-296.52.27-1.36.54-2.72.81-4.07H0Z"
      fill="#7f0000"
      opacity="0.57"
    />
    <path
      d="M230.14,16.06c5.29,0,153.49,1.32,232.88,120.34,79.39,119.02,298.31,118.02,402.25,84.64,148.2-47.61,441.95-5.29,635.13,163.98,193.19,169.27,219.65,494.59,219.65,494.59V16.06H230.14Z"
      fill="#7f0000"
      opacity="0.49"
      filter="url(#drop-shadow-1)"
    />
  </svg>
);


