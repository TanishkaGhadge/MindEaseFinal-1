import { GuidedBreathingWithAI } from "./GuidedBreathingWithAI";

/**
 * Unified breathing exercise component
 * Combines guided exercises with AI camera detection
 */
export const CameraBreathingExercise = () => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 border-4 border-teal-200 shadow-2xl">
      <GuidedBreathingWithAI />
    </div>
  );
};
