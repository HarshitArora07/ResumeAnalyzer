import { useState, useEffect, useRef } from "react";
import sampleImage from "../assets/sample.jpg";

/* ============================= */
/* COUNT UP HOOK */
/* ============================= */
const useCountUp = (end, duration = 1200, trigger = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let startTime = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easedProgress = easeOutCubic(percentage);
      const currentValue = Math.floor(easedProgress * end);

      setCount(currentValue);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return count;
};

/* ============================= */
/* EXPERIENCE / SKILLS BAR */
/* ============================= */
function ExperienceBar({ label, value, trigger, delay = 0 }) {
  const [start, setStart] = useState(false);
  const [sweep, setSweep] = useState(false);

  const animatedValue = useCountUp(value, 1200, start);

  useEffect(() => {
    if (!trigger) return;

    const timer = setTimeout(() => {
      setStart(true);

      // Trigger sweep after fill completes
      setTimeout(() => {
        setSweep(true);
        setTimeout(() => setSweep(false), 800);
      }, 1200);
    }, delay);

    return () => clearTimeout(timer);
  }, [trigger, delay]);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{label}</span>
        <span>{animatedValue}%</span>
      </div>

      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden relative">
        <div className="bar-wrapper h-full rounded-full">
  <div
    className={`h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1200 ease-out ${
      sweep ? "bar-sweep" : ""
    }`}
    style={{ width: `${animatedValue}%` }}
  />
</div>
      </div>
    </div>
  );
}

/* ============================= */
/* MAIN COMPONENT */
/* ============================= */
function DynamicResumeScanWithInsightsFixed() {
  const containerRef = useRef(null);

  const [scanPosition, setScanPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [shifted, setShifted] = useState(false);
  const [revealedLines, setRevealedLines] = useState(0);
  const [fadeOutScanning, setFadeOutScanning] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const totalLines = 20;
  const textLines = 10;
  const scanSpeed = 2;

  /* ============================= */
  /* SCANNING ANIMATION */
  /* ============================= */
  useEffect(() => {
    let animationFrame;

    const animate = () => {
      if (!containerRef.current) return;

      const containerHeight = containerRef.current.offsetHeight;
      let nextPosition = scanPosition + direction * scanSpeed;

      if (nextPosition >= containerHeight) {
        nextPosition = containerHeight;
        setDirection(-1);

        if (!completed) {
          setCompleted(true);
          setTimeout(() => setShifted(true), 500);
          setTimeout(() => setFadeOutScanning(true), 2000);
          setTimeout(() => setShowInsights(true), 2700);
        }
      } else if (nextPosition <= 0) {
        nextPosition = 0;
        setDirection(1);
      }

      const revealCount = Math.floor(
        (nextPosition / containerHeight) * textLines
      );

      setRevealedLines(revealCount);
      setScanPosition(nextPosition);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [scanPosition, direction, completed]);

  const highlightedLines = Math.floor(
    (scanPosition / (containerRef.current?.offsetHeight || 1)) *
      totalLines
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-900 flex items-center justify-center p-2"
    >
      <div
        className={`flex transition-all duration-1000 ease-in-out w-full h-full ${
          shifted ? "justify-start" : "justify-center"
        }`}
      >
        {/* LEFT SIDE */}
        <div
          className={`relative transition-all duration-1000 ease-in-out ${
            shifted ? "w-1/2 mr-4" : "w-full"
          }`}
        >
          <img
            src={sampleImage}
            alt="Resume"
            className="w-full h-full object-contain rounded-2xl"
          />

          {/* Highlight overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: totalLines }).map((_, i) => (
              <div
                key={i}
                className="w-full transition-colors duration-100 ease-linear"
                style={{
                  height: `${100 / totalLines}%`,
                  background:
                    i < highlightedLines
                      ? "rgba(255,0,0,0.2)"
                      : "transparent",
                }}
              />
            ))}
          </div>

          {!shifted && (
            <div
              className="absolute left-0 w-full h-1 bg-red-500 shadow-xl"
              style={{ top: scanPosition }}
            />
          )}
        </div>

        {/* RIGHT SIDE PANEL */}
        {shifted && (
          <div className="flex-1 relative p-4 bg-gray-800 rounded-lg overflow-hidden min-h-55">

            {/* SCANNING CONTENT */}
            <div
              className={`absolute inset-0 transition-all duration-700 ${
                fadeOutScanning
                  ? "opacity-0 translate-y-3 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="flex flex-col gap-2">
                {Array.from({ length: textLines }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-500 ${
                      i < revealedLines
                        ? "bg-green-500 opacity-100"
                        : "bg-gray-600 opacity-0"
                    }`}
                    style={{
                      height: "clamp(4px, 0.6vw, 8px)",
                      width: `${80 - i * 5}%`,
                    }}
                  />
                ))}

                <p className="text-xs text-gray-400 mt-2">
                  {revealedLines >= textLines
                    ? "Scan complete. Extracting insights..."
                    : "Scanning..."}
                </p>
              </div>
            </div>

            {/* INSIGHTS */}
            {showInsights && (
              <div className="relative flex flex-col gap-6 animate-fadeIn">

                {/* Strengths */}
                <div>
                  <p className="text-sm text-green-400 font-semibold mb-3">
                    ✓ Strengths
                  </p>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`strength-${i}`}
                      className="rounded-full my-2 opacity-0 animate-slideIn overflow-hidden"
                      style={{
                        height: "clamp(4px, 0.7vw, 10px)",
                        width: `${75 - i * 10}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="h-full w-full bar-green rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Weaknesses */}
                <div>
                  <p className="text-sm text-red-400 font-semibold mb-3">
                    ✕ Weaknesses
                  </p>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`weakness-${i}`}
                      className="rounded-full my-2 opacity-0 animate-slideIn overflow-hidden"
                      style={{
                        height: "clamp(4px, 0.7vw, 10px)",
                        width: `${70 - i * 10}%`,
                        animationDelay: `${(i + 3) * 0.3}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="h-full w-full bar-red rounded-full" />
                    </div>
                  ))}
                </div>

                {/* DESKTOP ONLY SECTION BREAKDOWN */}
                <div className="hidden lg:block">
                  <p className="text-sm text-gray-400 font-medium mb-3">
                    Section Breakdown
                  </p>

                  <ExperienceBar
                    label="Experience"
                    value={65}
                    trigger={showInsights}
                    delay={0}
                  />

                  <ExperienceBar
                    label="Skills"
                    value={80}
                    trigger={showInsights}
                    delay={300}
                  />
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DynamicResumeScanWithInsightsFixed;