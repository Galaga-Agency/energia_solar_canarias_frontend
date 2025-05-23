import { cn } from "@/utils/styles";

const RetroGrid = ({ className, angle = 65 }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        className
      )}
      style={{
        "--grid-angle": `${angle}deg`,
      }}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]",
            // Light Styles
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.7)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_0)]",
            // Dark styles
            "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)]"
          )}
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 20%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 20%, black 100%)",
          }}
        />
      </div>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-custom-dark-blue" />
    </div>
  );
};

export default RetroGrid;
