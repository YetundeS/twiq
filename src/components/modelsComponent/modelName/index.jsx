import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import "./mn.css";

const ModelName = ({ name, content }) => {
  return (
    <div className="modelName_wrapper">
      <HoverCard>
        <HoverCardTrigger>
          <div className="modelName_box">
            <p>{name}</p>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="hoverCard_content">
            
          {content?.map((desc, i) => (
            <span key={i}>{desc}</span>
          ))}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default ModelName;
