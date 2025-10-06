// src/components/CalmBlobsBG.tsx
import Orb from "../components/OrbForPanicPage";
export default function CalmBlobsBG() {
  return (

    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <Orb
        hoverIntensity={0}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />
    </div>
  );
}
