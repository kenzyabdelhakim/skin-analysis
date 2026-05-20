import { motion } from 'motion/react';
import { Card } from '../Card';
import { ProgressBar } from '../ProgressBar';
import { CircularProgress } from '../CircularProgress';
import { Droplets, Sun, Sparkles, AlertCircle, Eye, Frown, Circle } from 'lucide-react';
import { AnalysisData } from '../DermaStationWebsite';

interface ResultsSectionProps {
  data: AnalysisData;
}

const skinTypeIcons: Record<string, typeof Droplets> = {
  Dry: Droplets,
  Normal: Sparkles,
  Oily: Sun
};

const issueIconMap: Record<string, typeof AlertCircle> = {
  acne: AlertCircle,
  spots: Circle,
  wrinkles: Frown,
  redness: AlertCircle,
  pores: Eye
};

export const ResultsSection: React.FC<ResultsSectionProps> = ({ data }) => {
  const SkinTypeIcon = skinTypeIcons[data.skinType.type] || Sparkles;

  return (
    <section className="py-20 px-6 section-charcoal">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Skin Analysis Results
          </h2>
          <p className="text-xl text-muted-foreground">
            AI-powered insights tailored to your unique skin
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-pink-light/10 border-primary/20 h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl mb-2">Your Skin Type</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary to-pink-dark bg-clip-text text-transparent">
                      {data.skinType.type}
                    </span>
                    <span className="text-xl text-muted-foreground">
                      {data.skinType.confidence}%
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <CircularProgress
                    value={data.skinType.confidence}
                    size={120}
                    strokeWidth={10}
                    color="#FFB3D9"
                    showPercentage={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SkinTypeIcon className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium mb-4">Probability Breakdown</h4>
                <ProgressBar
                  label="Dry Skin"
                  value={data.skinType.probabilities.dry}
                  color="bg-chart-2"
                  height="h-4"
                />
                <ProgressBar
                  label="Normal Skin"
                  value={data.skinType.probabilities.normal}
                  color="bg-primary"
                  height="h-4"
                />
                <ProgressBar
                  label="Oily Skin"
                  value={data.skinType.probabilities.oily}
                  color="bg-chart-4"
                  height="h-4"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-glass-bg backdrop-blur-xl border-glass-border h-full">
              <h3 className="text-2xl mb-6">Your Analysis Photo</h3>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={data.uploadedImage}
                  alt="Analysis"
                  className="w-full h-auto aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl p-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm">Analyzed on {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-6">Detected Skin Concerns</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.issues.map((issue, index) => {
              const IssueIcon = issueIconMap[issue.icon] || AlertCircle;
              return (
                <motion.div
                  key={issue.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card
                    className={`p-6 transition-all duration-300 ${
                      issue.detected
                        ? 'bg-gradient-to-br from-primary/10 to-pink-light/30 border-primary/30'
                        : 'bg-muted/30 border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-xl ${
                            issue.detected
                              ? 'bg-primary/20'
                              : 'bg-muted'
                          }`}
                        >
                          <IssueIcon
                            className={`w-6 h-6 ${
                              issue.detected ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        <h4>{issue.name}</h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          issue.detected
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {issue.detected ? 'Detected' : 'Clear'}
                      </span>
                    </div>

                    <ProgressBar
                      label="Severity Level"
                      value={issue.score}
                      color={issue.detected ? 'bg-gradient-to-r from-primary to-pink-dark' : 'bg-muted-foreground'}
                      height="h-3"
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-pink-light/10 border-primary/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Medical Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  This AI analysis is for informational purposes only and should not replace
                  professional dermatological advice. Please consult a qualified dermatologist
                  for medical concerns.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
