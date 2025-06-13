import Image from 'next/image'
import './twiqBg.css'

const TwiqBg = () => {
    return (
        <Image
            src={"/images/twiq_background.svg"}
            width={2000}
            height={2000}
            alt="twiq background"
            className="twiqBg"
        />
    )
}

export default TwiqBg