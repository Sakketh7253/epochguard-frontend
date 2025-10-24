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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">EpochGuard</h1>
          </div>
          <p className="text-lg opacity-90">
            A Hybrid ML Model for Detecting Long-Range Attacks in Proof-of-Stake Blockchain Systems
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Dataset for Analysis
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">
                    {file ? file.name : 'Choose a CSV file'}
                  </p>
                  <p className="text-gray-500">
                    Upload blockchain node data for attack detection analysis
                  </p>
                </div>
              </div>
            </label>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                File selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Analyze Dataset
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Analysis Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Analysis Results
              </h2>
              <button
                onClick={downloadResults}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Results
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Total Nodes</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {results.data.statistics.total_samples}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Benign Nodes</h3>
                <p className="text-2xl font-bold text-green-600">
                  {results.data.statistics.benign_nodes} ({results.data.statistics.benign_percentage}%)
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-medium text-red-800">Malicious Nodes</h3>
                <p className="text-2xl font-bold text-red-600">
                  {results.data.statistics.malicious_nodes} ({results.data.statistics.malicious_percentage}%)
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800">Avg Risk Score</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {results.data.statistics.average_risk_score}
                </p>
              </div>
            </div>

            {/* Feature Importance */}
            {results.data.feature_importance && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Top Risk Factors</h3>
                <div className="space-y-2">
                  {results.data.feature_importance.slice(0, 5).map((feature, index) => (
                    <div key={feature.feature} className="flex items-center">
                      <span className="w-32 text-sm font-medium">
                        {feature.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(feature.importance / results.data.feature_importance[0].importance) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {(feature.importance * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Model Metrics Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Model Performance</h2>
            <button
              onClick={loadMetrics}
              disabled={isLoadingMetrics}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
            >
              {isLoadingMetrics ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Metrics'
              )}
            </button>
          </div>

          {metrics && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Accuracy</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {(metrics.model_performance.hybrid_ensemble.accuracy * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Precision</h3>
                <p className="text-2xl font-bold text-green-600">
                  {(metrics.model_performance.hybrid_ensemble.precision * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Recall</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {(metrics.model_performance.hybrid_ensemble.recall * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">F1-Score</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {(metrics.model_performance.hybrid_ensemble.f1_score * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Us
          </h2>

          {contactSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700">Thank you! Your message has been sent successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingContact}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
              >
                {isSubmittingContact ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 EpochGuard. Advanced blockchain security through hybrid ML models.</p>
        </div>
      </footer>
    </div>
  )
}