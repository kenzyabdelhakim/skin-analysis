import { useState } from 'react';
import { Navbar } from './dermastation/Navbar';
import { HeroSection } from './dermastation/HeroSection';
import { SkinAnalysisSection } from './dermastation/SkinAnalysisSection';
import { ResultsSection } from './dermastation/ResultsSection';
import { PersonalizedRoutineSection } from './dermastation/PersonalizedRoutineSection';
import { FeaturedProductsSection } from './dermastation/FeaturedProductsSection';
import { VendingMachineSection } from './dermastation/VendingMachineSection';
import { Footer } from './dermastation/Footer';
import { CursorGlow } from './CursorGlow';
import { AnalysisHistory } from './AnalysisHistory';
import { CartDrawer } from './CartDrawer';
import { analyzeSkin, checkBackendHealth, generateMockAnalysis, saveAnalysisData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export interface AnalysisData {
  skinType: {
    type: string;
    confidence: number;
    probabilities: { dry: number; normal: number; oily: number };
  };
  issues: { name: string; score: number; detected: boolean; icon: string }[];
  uploadedImage: string;
}

export const DermaStationWebsite: React.FC = () => {
  const { accessToken } = useAuth();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  // increments each time a save completes — AnalysisHistory watches this to reload
  const [historyVersion, setHistoryVersion] = useState(0);

  const handleStartAnalysis = () => {
    setShowAnalysis(true);
    setError(null);
    document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageUpload = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);

    try {
      const isBackendHealthy = await checkBackendHealth();
      let data: AnalysisData;

      if (isBackendHealthy) {
        const { data: analysed } = await analyzeSkin(imageDataUrl);
        data = analysed;
      } else {
        // FastAPI not running — use mock data but still save to DB
        await new Promise((resolve) => setTimeout(resolve, 2000));
        data = generateMockAnalysis(imageDataUrl);
      }

      setAnalysisData(data);
      setShowResults(true);
      setIsAnalyzing(false);

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Save to DB for EVERY analysis (real or mock) — fire and forget
      if (accessToken) {
        saveAnalysisData(imageDataUrl, data, accessToken)
          .then(() => setHistoryVersion((v) => v + 1))
          .catch((e) => console.error('DB save failed:', e));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CursorGlow />
      <Navbar
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      <AnalysisHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        version={historyVersion}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <HeroSection onStartAnalysis={handleStartAnalysis} />

      {showAnalysis && (
        <div id="analysis-section">
          <SkinAnalysisSection onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} error={error} />
        </div>
      )}

      {showResults && analysisData && (
        <>
          <div id="results-section">
            <ResultsSection data={analysisData} />
          </div>
          <PersonalizedRoutineSection
            skinType={analysisData.skinType.type}
            concerns={analysisData.issues.filter((i) => i.detected).map((i) => i.name)}
          />
        </>
      )}

      <FeaturedProductsSection />
      <VendingMachineSection />
      <Footer />
    </div>
  );
};
