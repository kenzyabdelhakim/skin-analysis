import { motion } from 'motion/react';
import { Button } from './Button';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { CircularProgress } from './CircularProgress';
import { ProductRecommendations } from './ProductRecommendations';
import { ArrowLeft, AlertCircle, Droplets, Sparkles, Sun } from 'lucide-react';
import { AnalysisResult } from '../App';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onBackToHome: () => void;
}

const skinTypeIcons: Record<string, typeof Droplets> = {
  Dry: Droplets,
  Normal: Sparkles,
  Oily: Sun
};

const issueIcons: Record<string, typeof AlertCircle> = {
  Acne: AlertCircle,
  'Dark Spots': AlertCircle,
  Wrinkles: AlertCircle,
  Redness: AlertCircle,
  'Large Pores': AlertCircle
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onBackToHome }) => {
  const SkinTypeIcon = skinTypeIcons[result.skinType.type] || Sparkles;
  const detectedIssues = result.issues.filter(issue => issue.detected);

  return (
    <div className="min-h-screen w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={onBackToHome} className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            New Analysis
          </Button>
          <h1 className="text-4xl md:text-5xl mb-4">Your Skin Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Here are your personalized results and recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card glass className="p-6 h-full">
              <img
                src={result.uploadedImage}
                alt="Your skin"
                className="w-full rounded-2xl mb-4 aspect-square object-cover"
              />
              <p className="text-sm text-muted-foreground text-center">
                Analysis completed on {new Date().toLocaleDateString()}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card glass className="p-8 h-full">
              <div className="flex items-start gap-6 mb-8">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <SkinTypeIcon className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl mb-2">Your Skin Type</h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-medium text-primary">
                      {result.skinType.type}
                    </span>
                    <span className="text-2xl text-muted-foreground">
                      {result.skinType.confidence}% confidence
                    </span>
                  </div>
                </div>
                <CircularProgress
                  value={result.skinType.confidence}
                  size={100}
                  strokeWidth={8}
                />
              </div>

              <div className="space-y-4">
                <h3 className="mb-4">Skin Type Probabilities</h3>
                <ProgressBar
                  label="Dry Skin"
                  value={result.skinType.probabilities.dry}
                  color="bg-chart-2"
                />
                <ProgressBar
                  label="Normal Skin"
                  value={result.skinType.probabilities.normal}
                  color="bg-primary"
                />
                <ProgressBar
                  label="Oily Skin"
                  value={result.skinType.probabilities.oily}
                  color="bg-chart-4"
                />
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl mb-6">Detected Skin Concerns</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.issues.map((issue, index) => {
              const IssueIcon = issueIcons[issue.name] || AlertCircle;
              return (
                <motion.div
                  key={issue.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card
                    glass
                    hoverable
                    className={`
                      p-6 transition-all duration-300
                      ${issue.detected ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent' : 'opacity-60'}
                    `}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          p-3 rounded-xl
                          ${issue.detected ? 'bg-primary/10' : 'bg-muted'}
                        `}>
                          <IssueIcon className={`
                            w-6 h-6
                            ${issue.detected ? 'text-primary' : 'text-muted-foreground'}
                          `} />
                        </div>
                        <h3>{issue.name}</h3>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-sm
                        ${issue.detected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                      `}>
                        {issue.detected ? 'Detected' : 'Not Detected'}
                      </span>
                    </div>
                    <ProgressBar
                      label="Severity Score"
                      value={issue.score}
                      color={issue.detected ? 'bg-primary' : 'bg-muted-foreground'}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ProductRecommendations
            skinType={result.skinType.type}
            detectedIssues={detectedIssues.map(i => i.name)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-6 bg-blush/30 border-blush">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary mt-1" />
              <div>
                <h4 className="mb-2">Important Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  This AI-powered analysis is for informational and educational purposes only.
                  It should not be considered a substitute for professional dermatological advice,
                  diagnosis, or treatment. Please consult a qualified dermatologist for any
                  medical concerns about your skin.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
