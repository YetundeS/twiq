import GlowEffect from "@/components/landingPageComponents/GlowEffect";
import { motion } from "framer-motion";
import Image from "next/image";
import "./modelOverview.css";


const ModelOverview = ({ model, organizationName }) => {
  return (
    <GlowEffect  blurAmount={6}>
      <a
        href={`/platform/${organizationName}/${model?.link}`}
        className="modelOverview"
      >
        <motion.div
          whileHover={{
            scale: 1.2,
            rotate: 5,
            transition: { duration: 0.3, type: "spring", stiffness: 300 },
          }}
          className="icon_container"
        >
          <Image
            src={`/images/model_icons/${model?.icon}`}
            width={300}
            height={300}
            alt="model icon"
            className="modelImg"
          />
        </motion.div>
        <div className={`info_container`}>
          <p className="model_title">{model?.title}</p>
          <p className="model_description">
            {model?.description?.map((desc, i) => (
              <span key={i}>{desc}</span>
            ))}
          </p>
        </div>
      </a></GlowEffect>
  );
};

export default ModelOverview;

export const AdminAction = ({ action }) => {
  return (
    <div onClick={action?.function} className="modelOverview action">
      <motion.div
        whileHover={{
          scale: 1.2,
          rotate: 5,
          transition: { duration: 0.3, type: "spring", stiffness: 300 },
        }}
        className="icon_container"
      >
        <action.Icon className="modelIcon" size={46} />
      </motion.div>
      <div
        className={`info_container ${action?.title == "soon" && "noBorder"}`}
      >
        <p className="model_title">{action?.title}</p>
        <p className="model_description">{action?.description}</p>
      </div>
    </div>
  );
};
