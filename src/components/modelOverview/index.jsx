import GlowEffect from "@/components/landingPageComponents/GlowEffect";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import CrownIcon from "../dashboardComponent/crown";
import "./modelOverview.css";

const starterModels = ["LinkedIn Personal", "Headlines", "Storyteller"].map(m => m.toLowerCase());
const proModels = ["LinkedIn Your Business", "Caption", "Video Scripts", "Carousel"].map(m => m.toLowerCase());

const hasAccess = (plan, title) => {
  if (!plan || !title) return false;

  const normalizedPlan = plan.toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedPlan === "none") return false;
  if (normalizedPlan === "starter") return starterModels.includes(normalizedTitle);
  if (normalizedPlan === "pro") return (
    starterModels.includes(normalizedTitle) || proModels.includes(normalizedTitle)
  );
  if (normalizedPlan === "enterprise") return true;

  return false;
};
const ModelOverview = ({ specialModel, onClick, model, organizationName, subscription_plan }) => {
  const title = model?.title;

  if (specialModel) {
    return (
      <GlowEffect blurAmount={6}>
        <div onClick={onClick} className="modelOverview special">
          <h3 className="specialModel_title">What is the T.W.I.Q Method</h3>
          <motion.div
            whileHover={{
              scale: 1.2,
              rotate: 5,
              transition: { duration: 0.3, type: "spring", stiffness: 300 },
            }}
            className="icon_container"
          >
            <Image
              src={`/images/start_here.png`}
              width={300}
              height={300}
              alt="start here icon"
              className="start_here_img"
            />
          </motion.div>
        </div>
      </GlowEffect>
    );
  }

  const userHasAccess = hasAccess(subscription_plan, title);

  const handleClick = (e) => {
    if (!userHasAccess) {
      e.preventDefault();
      toast.error(`Upgrade to access "${title}" model`, {
        style: {
          border: "none",
          color: "red",
        },
      });
    }
  };

  return (
    <GlowEffect blurAmount={6}>
      <a
        href={userHasAccess ? `/platform/${organizationName}/${model?.link}` : "#"}
        className="modelOverview"
        onClick={handleClick}
      >
        {!userHasAccess && (
          <div className="crownBox">
            <CrownIcon fill="gold" stroke="gold" />
          </div>
        )}
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
          <p className="model_title">{title}</p>
          <p className="model_description">
            {model?.description?.map((desc, i) => (
              <span key={i}>{desc}</span>
            ))}
          </p>
        </div>
      </a>
    </GlowEffect>
  );
};

export default ModelOverview;
