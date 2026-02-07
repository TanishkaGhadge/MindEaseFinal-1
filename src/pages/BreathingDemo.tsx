import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Standalone demo page for MediaPipe breathing detection
 * Useful for testing and showcasing the feature
 */
const BreathingDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        
        <MediaPipeBreathingDetector />
      </div>
    </div>
  );
};

export default BreathingDemo;
