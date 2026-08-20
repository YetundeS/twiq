import GlowEffect from "@/components/landingPageComponents/GlowEffect";
import { canAccessCoach } from "@/hooks/useCoaches";
import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { hasAccess } from "../appSideBar";
import CrownIcon from "../dashboardComponent/crown";
import "./modelOverview.css";


const ModelOverview = ({ specialModel, onClick, model, coach, organizationName, subscription_plan }) => {
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

  // Prefer the backend coach's allowed_plans over the hardcoded
  // starter/proModels arrays. Falls back to hasAccess for the brief
  // window before the coaches SWR hydrates (or on the impossible case
  // of a seed coach missing from the backend response).
  const userHasAccess = coach
    ? canAccessCoach(subscription_plan, coach)
    : hasAccess(subscription_plan, title);

  // Icon precedence: admin-supplied icon_url first (rendered as a plain
  // <img> because arbitrary URLs bypass next/image domain restrictions
  // via `unoptimized`), then the seed coach's static filename convention
  // (/images/model_icons/<name>.png), then a generic MessagesSquare
  // fallback for admin coaches with no icon set yet.
  const iconUrl = coach?.icon_url || null;
  const iconFilename = model?.icon || null;

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
          {iconUrl ? (
            <Image
              src={iconUrl}
              width={300}
              height={300}
              alt={`${title} icon`}
              className="modelImg"
              unoptimized
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : iconFilename ? (
            <Image
              src={`/images/model_icons/${iconFilename}`}
              width={300}
              height={300}
              alt="model icon"
              className="modelImg"
            />
          ) : (
            <div className="modelImg flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
              <MessagesSquare className="text-gray-500 dark:text-gray-400 w-16 h-16" />
            </div>
          )}
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
