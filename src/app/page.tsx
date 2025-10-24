'use client'

import { useState, useCallback } from 'react'
import axios from 'axios'
import { 
  Upload, 
  Download, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  FileText,
  Mail,
  User,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AnalysisResult {
  status: string
  message: string
  data: {
    predictions: number[]
    probabilities: number[]
    statistics: {
      total_samples: number
      benign_nodes: number
      malicious_nodes: number
      benign_percentage: number
      malicious_percentage: number
      average_risk_score: number
      high_risk_nodes: number
      low_risk_nodes: number
    }
    feature_importance: Array<{
      feature: string
      importance: number
      rank: number
    }>
  }
}

interface Metrics {
  model_performance: {
    hybrid_ensemble: {
      accuracy: number
      precision: number
      recall: number
      f1_score: number
    }
  }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string>('')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setError('')
      setResults(null)
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError('Please select a CSV file first')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      })

      setResults(response.data)
    } catch (err: any) {
      console.error('Analysis error:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try with a smaller file.')
      } else {
        setError('Failed to analyze file. Please check your internet connection and try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }, [file])

  const loadMetrics = useCallback(async () => {
    setIsLoadingMetrics(true)
    try {
      const response = await axios.get(`${API_URL}/metrics`, {
        timeout: 10000
      })
      setMetrics(response.data)
    } catch (err) {
      console.error('Failed to load metrics:', err)
    } finally {
      setIsLoadingMetrics(false)
    }
  }, [])

  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingContact(true)
    setContactSuccess(false)

    try {
      await axios.post(`${API_URL}/contact`, contactForm, {
        timeout: 10000
      })
      setContactSuccess(true)
      setContactForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Contact form error:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmittingContact(false)
    }
  }, [contactForm])

  const downloadResults = useCallback(() => {
    if (!results) return

    const csvContent = [
      ['Node_Index', 'Prediction', 'Risk_Probability', 'Risk_Level'],
      ...results.data.predictions.map((pred, idx) => [
        idx + 1,
        pred === 1 ? 'Malicious' : 'Benign',
        results.data.probabilities[idx].toFixed(4),
        results.data.probabilities[idx] > 0.7 ? 'High' : 
        results.data.probabilities[idx] > 0.3 ? 'Medium' : 'Low'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'epochguard_analysis_results.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [results])

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="gradient-bg text-white py-16 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6 slide-up">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight">
                Epoch<span className="text-blue-200">Guard</span>
              </h1>
            </div>
            <p className="text-xl opacity-90 mb-8 leading-relaxed fade-in">
              Advanced Blockchain Security Through Hybrid Machine Learning
            </p>
            <p className="text-lg opacity-75 max-w-2xl mx-auto fade-in">
              Detect long-range attacks in Proof-of-Stake blockchain systems using our 
              state-of-the-art ensemble of Decision Trees, Random Forest, and CNN models
            </p>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">93.2%</div>
                <div className="text-sm opacity-80">Model Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-200">99.1%</div>
                <div className="text-sm opacity-80">Precision Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-200">&lt;2s</div>
                <div className="text-sm opacity-80">Analysis Time</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-300/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Upload Section */}
        <div className="card-professional p-8 mb-12 fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg">
                <Upload className="h-6 w-6" />
              </div>
              Dataset Analysis Portal
            </h2>
            <p className="text-gray-600 text-lg">
              Upload your blockchain node data and get real-time security analysis
            </p>
          </div>
          
          <div className="upload-zone p-12 text-center cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-10 w-10 text-blue-600" />
                  </div>
                  {file && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-gray-800">
                    {file ? file.name : 'Drop your CSV file here'}
                  </p>
                  <p className="text-gray-500 text-lg">
                    {file ? `File size: ${(file.size / 1024).toFixed(1)} KB` : 'Or click to browse files'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Supported format: CSV files with blockchain node metrics
                  </p>
                </div>
              </div>
            </label>
          </div>

          {file && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">Ready for analysis • {(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-primary flex items-center gap-3 min-w-48 justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="loading-spinner w-5 h-5"></div>
                    Analyzing Dataset...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-5 w-5" />
                    Start Security Analysis
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="card-professional border-l-4 border-red-500 p-6 mb-8 fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Analysis Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {results && (
          <div className="card-professional p-8 mb-12 slide-up">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Security Analysis Complete</h2>
                  <p className="text-gray-600">Comprehensive blockchain node assessment results</p>
                </div>
              </div>
              <button
                onClick={downloadResults}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export Report
              </button>
            </div>

            {/* Enhanced Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat-card stat-primary">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Nodes Analyzed</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {results.data.statistics.total_samples}
                </p>
                <p className="text-xs text-gray-500">Blockchain nodes processed</p>
              </div>
              
              <div className="stat-card stat-success">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Secure Nodes</h3>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {results.data.statistics.benign_nodes}
                </p>
                <p className="text-xs text-gray-500">{results.data.statistics.benign_percentage}% of total</p>
              </div>
              
              <div className="stat-card stat-danger">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Threat Detected</h3>
                <p className="text-3xl font-bold text-red-600 mb-1">
                  {results.data.statistics.malicious_nodes}
                </p>
                <p className="text-xs text-gray-500">{results.data.statistics.malicious_percentage}% risk nodes</p>
              </div>
              
              <div className="stat-card stat-warning">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Risk Score</h3>
                <p className="text-3xl font-bold text-yellow-600 mb-1">
                  {results.data.statistics.average_risk_score}
                </p>
                <p className="text-xs text-gray-500">Average threat level</p>
              </div>
            </div>

            {/* Feature Importance Analysis */}
            {results.data.feature_importance && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Risk Factor Analysis
                </h3>
                <div className="space-y-4">
                  {results.data.feature_importance.slice(0, 5).map((feature, index) => {
                    const percentage = (feature.importance / results.data.feature_importance[0].importance) * 100;
                    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
                    return (
                      <div key={feature.feature} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-48">
                          <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                          <span className="text-sm font-semibold text-gray-700">
                            {feature.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right min-w-16">
                          <span className="text-sm font-bold text-gray-800">
                            {(feature.importance * 100).toFixed(1)}%
                          </span>
                          <div className="text-xs text-gray-500">Impact</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-4 bg-white/50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    <strong>Analysis:</strong> Higher percentages indicate stronger correlation with attack patterns. 
                    These metrics help identify the most critical security indicators in your blockchain network.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Model Performance Dashboard */}
        <div className="card-professional p-8 mb-12 fade-in">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">ML Model Performance</h2>
                <p className="text-gray-600">Real-time accuracy metrics from our hybrid ensemble</p>
              </div>
            </div>
            <button
              onClick={loadMetrics}
              disabled={isLoadingMetrics}
              className="btn-primary flex items-center gap-2"
            >
              {isLoadingMetrics ? (
                <>
                  <div className="loading-spinner w-5 h-5"></div>
                  Loading Metrics...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  View Performance
                </>
              )}
            </button>
          </div>

          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card stat-primary">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Accuracy</h3>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {(metrics.model_performance.hybrid_ensemble.accuracy * 100).toFixed(1)}%
                </p>
                <div className="progress-bar mb-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${metrics.model_performance.hybrid_ensemble.accuracy * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Overall prediction accuracy</p>
              </div>
              
              <div className="stat-card stat-success">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Precision</h3>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {(metrics.model_performance.hybrid_ensemble.precision * 100).toFixed(1)}%
                </p>
                <div className="progress-bar mb-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${metrics.model_performance.hybrid_ensemble.precision * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">True positive accuracy</p>
              </div>
              
              <div className="stat-card stat-warning">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Recall</h3>
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {(metrics.model_performance.hybrid_ensemble.recall * 100).toFixed(1)}%
                </p>
                <div className="progress-bar mb-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${metrics.model_performance.hybrid_ensemble.recall * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Attack detection rate</p>
              </div>
              
              <div className="stat-card stat-danger">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">F1-Score</h3>
                <p className="text-4xl font-bold text-orange-600 mb-2">
                  {(metrics.model_performance.hybrid_ensemble.f1_score * 100).toFixed(1)}%
                </p>
                <div className="progress-bar mb-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${metrics.model_performance.hybrid_ensemble.f1_score * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Balanced performance</p>
              </div>
            </div>
          )}

          {metrics && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Model Architecture</h3>
              <p className="text-gray-600 mb-4">
                Our hybrid ensemble combines three powerful machine learning approaches for maximum accuracy:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/70 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">🌲 Decision Tree</h4>
                  <p className="text-sm text-gray-600">Interpretable rule-based classification</p>
                </div>
                <div className="bg-white/70 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-2">🌳 Random Forest</h4>
                  <p className="text-sm text-gray-600">Ensemble learning with multiple trees</p>
                </div>
                <div className="bg-white/70 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-700 mb-2">🧠 CNN</h4>
                  <p className="text-sm text-gray-600">Deep learning pattern recognition</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="card-professional p-8 fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Get in Touch</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Have questions about EpochGuard? Need enterprise solutions? Our blockchain security experts are here to help.
            </p>
          </div>

          {contactSuccess ? (
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
              <p className="text-green-600 mb-4">
                Thank you for reaching out. Our team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setContactSuccess(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your blockchain security needs, questions, or feedback..."
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="btn-primary text-lg px-8 py-4"
                >
                  {isSubmittingContact ? (
                    <>
                      <div className="loading-spinner w-5 h-5 mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-3" />
                      Send Secure Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">EpochGuard</h3>
              </div>
              <p className="text-gray-300 text-lg mb-6 max-w-md">
                Advanced blockchain security through cutting-edge hybrid machine learning models. 
                Protecting Proof-of-Stake networks from sophisticated attack vectors.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">93.2%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">99.1%</div>
                  <div className="text-sm text-gray-400">Precision</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">&lt;2s</div>
                  <div className="text-sm text-gray-400">Response</div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-200">Technology</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Machine Learning</li>
                <li>• Decision Trees</li>
                <li>• Random Forest</li>
                <li>• Neural Networks</li>
                <li>• Real-time Analysis</li>
              </ul>
            </div>

            {/* Security Focus */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-200">Security</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Long-range Attacks</li>
                <li>• Nothing-at-stake</li>
                <li>• Grinding Attacks</li>
                <li>• Network Analysis</li>
                <li>• Threat Detection</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 EpochGuard. Pioneering blockchain security through artificial intelligence.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">Powered by</span>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>FastAPI</span>
                <span>•</span>
                <span>Next.js</span>
                <span>•</span>
                <span>TensorFlow</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}