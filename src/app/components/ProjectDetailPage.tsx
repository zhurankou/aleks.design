import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import Project31 from "../../imports/Project31";
import svgPathsHome from "../../imports/svg-m8dddxl8st";
import svgPathsHomeFilled from "../../imports/svg-8etomq1n50";
import { useState } from "react";

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [hoveredHomeIcon, setHoveredHomeIcon] = useState(false);

  const handleBackHome = () => {
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-[#fdfcff]"
    >
      {/* Custom navigation overlay */}
      <div className="absolute left-[160px] top-[120px] z-10">
        <div
          className="relative shrink-0 size-[52px] cursor-pointer"
          onClick={handleBackHome}
          onMouseEnter={() => setHoveredHomeIcon(true)}
          onMouseLeave={() => setHoveredHomeIcon(false)}
        >
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g>
              {hoveredHomeIcon ? (
                <path clipRule="evenodd" d={svgPathsHomeFilled.p1422e970} fill="rgba(0,0,0,0.5)" fillRule="evenodd" />
              ) : (
                <path clipRule="evenodd" d={svgPathsHome.p1deead90} fill="rgba(0,0,0,0.3)" fillRule="evenodd" />
              )}
            </g>
          </svg>
        </div>
      </div>
      
      <Project31 onHomeClick={handleBackHome} />
    </motion.div>
  );
}
