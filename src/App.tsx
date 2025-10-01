import React, { useState } from 'react'
import parseLLMJson from './utils/jsonParser'

interface QuoteResponse {
  quote_response: {
    quote: string
    emotion: string
    metadata: {
      theme: string
      tone: string
      generation_time: string
    }
  }
}

const emotions = [
  { emoji: '😊', label: 'Happy', text: 'Happy' },
  { emoji: '😢', label: 'Sad', text: 'Sad' },
  { emoji: '😡', label: 'Angry', text: 'Angry' },
  { emoji: '😌', label: 'Calm', text: 'Calm' },
  { emoji: '😔', label: 'Anxious', text: 'Anxious' }
]

function App() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [quote, setQuote] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showQuote, setShowQuote] = useState<boolean>(false)

  const generateRandomId = () => `user${Math.random().toString(36).substr(2, 9)}@test.com`
  const generateSessionId = () => `68dd84485b275bbbc1f208a4-${Math.random().toString(36).substr(2, 9)}`

  const handleEmotionSelect = async (emotion: string) => {
    setSelectedEmotion(emotion)
    setLoading(true)
    setShowQuote(false)

    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-obhGvAo6gG9YT9tu6ChjyXLqnw7TxSGY'
        },
        body: JSON.stringify({
          user_id: generateRandomId(),
          agent_id: '68dd84485b275bbbc1f208a4',
          session_id: generateSessionId(),
          message: emotion
        })
      })

      const data = await response.json()
      console.log('Raw response:', data)

      if (data.response) {
        const parsedData = parseLLMJson(data.response) as QuoteResponse
        if (parsedData.quote_response?.quote) {
          setQuote(parsedData.quote_response.quote)
          setShowQuote(true)
        } else {
          setQuote(`Stay strong and remember that every ${emotion.toLowerCase()} moment is temporary. You have the strength to overcome any challenge that comes your way.`)
          setShowQuote(true)
        }
      } else {
        setQuote(`Stay strong and remember that every ${emotion.toLowerCase()} moment is temporary. You have the strength to overcome any challenge that comes your way.`)
        setShowQuote(true)
      }
    } catch (error) {
      console.error('Error generating quote:', error)
      setQuote(`Stay strong and remember that every ${emotion.toLowerCase()} moment is temporary. You have the strength to overcome any challenge that comes your way.`)
      setShowQuote(true)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedEmotion(null)
    setQuote('')
    setShowQuote(false)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-red-500 p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-4">
          Emotion to Quote
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your current emotion and receive a personalized motivational quote to brighten your day
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {!selectedEmotion && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6 text-center">
              How are you feeling?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {emotions.map((emotion) => (
                <button
                  key={emotion.text}
                  onClick={() => handleEmotionSelect(emotion.text)}
                  className="group relative p-6 rounded-xl bg-white border-2 border-gray-100 hover:border-[#6C63FF] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {emotion.emoji}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {emotion.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF] mb-4"></div>
            <p className="text-gray-600 text-lg">Generating your personalized quote...</p>
          </div>
        )}

        {showQuote && quote && (
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6C63FF] bg-opacity-10 mb-4">
                <span className="text-2xl">
                  {emotions.find(e => e.text === selectedEmotion)?.emoji}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {selectedEmotion} Mood
              </h3>
            </div>

            <div className="bg-gradient-to-r from-[#6C63FF] to-[#F9A826] rounded-xl p-1 mb-6">
              <div className="bg-white rounded-lg p-6">
                <p className="text-lg text-[#2E2E2E] leading-relaxed font-medium">
                  "{quote}"
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-6 bg-[#6C63FF] hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Try another emotion
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default App