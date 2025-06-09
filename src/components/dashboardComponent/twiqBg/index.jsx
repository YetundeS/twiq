import Image from 'next/image'
import './twiqBg.css'

const TwiqBg = () => {
    return (
        <Image
            src={"/images/twiq_background.png"}
            width={1400}
            height={700}
            alt="twiq background"
            className="twiqBg"
        />
    )
}

export default TwiqBg