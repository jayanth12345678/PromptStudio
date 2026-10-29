
import { useState } from 'react'
import './App.css'

const fieldTips = {
  prompt: 'Describe what you want the AI to accomplish. Include the task and any important details.',
  role: 'Tell the AI who it should act as, such as an AI researcher, tutor, editor, or business analyst.',
  context: 'Give background information that helps the AI understand your situation, audience, or goal.',
  outputFormat: 'Specify how the answer should be structured, such as plain text, Markdown, a table, or JSON.',
  constraints: 'Set boundaries such as word limits, tone, things to avoid, or required details.',
  temperature: 'Controls generation randomness. Lower values tend to be more predictable; higher values allow more variation.',
  topP: 'Controls the range of likely next tokens considered through nucleus sampling. Higher values allow a broader range.'
}

function InfoTip({ text }) {
  return (
    <span className="info-wrap">
      <button
        className="info-icon"
        type="button"
        aria-label={`More information: ${text}`}
      >
        i
      </button>
      <span className="tooltip" role="tooltip">
        {text}
      </span>
    </span>
  )
}

function FieldLabel({ htmlFor, children, tip }) {
  return (
    <label className="field-label" htmlFor={htmlFor}>
      <span>{children}</span>
      <InfoTip text={tip} />
    </label>
  )
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [role, setRole] = useState('')
  const [context, setContext] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [constraints, setConstraints] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(1.0)
  const [message, setMessage] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [isAnswerLoading, setIsAnswerLoading] = useState(false)

  async function handleEnhanceClick() {
    if (!prompt.trim()) {
      setMessage('Please enter a prompt first.')
      setEnhancedPrompt('')
      return
    }

    setIsLoading(true)
    setMessage('Enhancing your prompt...')

    try {
      const response = await fetch('http://127.0.0.1:8000/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          role: role.trim() || null,
          context: context.trim() || null,
          output_format: outputFormat.trim() || null,
          constraints: constraints.trim() || null,
          temperature,
          top_p: topP,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance prompt')
      }

      const data = await response.json()
      setEnhancedPrompt(data.enhanced_prompt)
      setMessage('Your prompt has been enhanced successfully.')
    } catch (error) {
      console.error(error)
      setMessage('Could not enhance your prompt. Check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  
async function handleGenerateAnswer() {
  if (!enhancedPrompt.trim()) {
    setMessage('Enhance a prompt first.')
    return
  }

  setIsAnswerLoading(true)
  setMessage('Generating your answer...')

  try {
    const response = await fetch('http://127.0.0.1:8000/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        temperature,
        top_p: topP,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate answer')
    }

    const data = await response.json()

    setAnswer(data.answer)
    setMessage('Answer generated successfully!')
    } catch (error) {
      console.error(error)
      setMessage('Could not generate the answer. Please try again.')
    } finally {
      setIsAnswerLoading(false)
    }
  }


  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(enhancedPrompt)
      setMessage('Enhanced prompt copied to clipboard.')
    } catch (error) {
      console.error(error)
      setMessage('Could not copy automatically. Please select and copy the result.')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Prompt Enhancer Studio home">
          <span className="brand-mark">✳</span>
          <span>prompt<span className="brand-light">studio</span></span>
        </a>
        <span className="topbar-tag">YOUR AI WORKSPACE</span>
      </header>

      <section className="intro">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          PROMPT ENGINEERING, MADE SIMPLE
        </span>
        <h1>Make every prompt <span>count.</span></h1>
        <p>Turn your ideas into clear, structured instructions that get better results.</p>
      </section>

      <section className="workspace">
        <div className="panel builder-panel">
          <div className="panel-heading">
            <div className="heading-icon">✎</div>
            <div>
              <h2>Build your prompt</h2>
              <p>Start with an idea. Refine the details.</p>
            </div>
          </div>

          <div className="field">
            <FieldLabel htmlFor="prompt" tip={fieldTips.prompt}>
              Your prompt <span className="required-mark">*</span>
            </FieldLabel>
            <textarea
              id="prompt"
              className="text-control prompt-control"
              placeholder="What would you like the AI to help you with?"
              value={prompt}
              maxLength={5000}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <div className="field-footer">
              <span>Be specific about your goal</span>
              <span>{prompt.length} / 5000</span>
            </div>
          </div>

          <div className="field">
            <FieldLabel htmlFor="role" tip={fieldTips.role}>Role</FieldLabel>
            <input
              id="role"
              className="text-control"
              type="text"
              placeholder="e.g. Expert AI researcher"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </div>

          <div className="field">
            <FieldLabel htmlFor="context" tip={fieldTips.context}>Context</FieldLabel>
            <textarea
              id="context"
              className="text-control"
              rows={3}
              placeholder="Add background, audience, or relevant details..."
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
          </div>

          <div className="field">
            <FieldLabel htmlFor="output-format" tip={fieldTips.outputFormat}>
              Output format
            </FieldLabel>
            <input
              id="output-format"
              className="text-control"
              type="text"
              placeholder="e.g. Plain text, Markdown, JSON"
              value={outputFormat}
              onChange={(event) => setOutputFormat(event.target.value)}
            />
          </div>

          <div className="field">
            <FieldLabel htmlFor="constraints" tip={fieldTips.constraints}>
              Constraints
            </FieldLabel>
            <textarea
              id="constraints"
              className="text-control"
              rows={3}
              placeholder="e.g. Under 100 words, avoid technical jargon..."
              value={constraints}
              onChange={(event) => setConstraints(event.target.value)}
            />
          </div>

          <div className="settings-panel">
            <div className="settings-heading">
              <div>
                <h3>Model settings</h3>
                <p>Fine-tune how the AI generates text.</p>
              </div>
              <span className="settings-symbol">⌘</span>
            </div>

            <div className="slider-field">
              <div className="slider-heading">
                <FieldLabel htmlFor="temperature" tip={fieldTips.temperature}>
                  Temperature
                </FieldLabel>
                <span className="value-pill">{Number(temperature).toFixed(1)}</span>
              </div>
              <input
                id="temperature"
                className="range-control"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(event) => setTemperature(Number(event.target.value))}
              />
              <div className="range-caption">
                <span>More focused</span>
                <span>More creative</span>
              </div>
            </div>

            <div className="slider-field">
              <div className="slider-heading">
                <FieldLabel htmlFor="top-p" tip={fieldTips.topP}>Top-P</FieldLabel>
                <span className="value-pill">{Number(topP).toFixed(2)}</span>
              </div>
              <input
                id="top-p"
                className="range-control"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={topP}
                onChange={(event) => setTopP(Number(event.target.value))}
              />
              <div className="range-caption">
                <span>Narrower selection</span>
                <span>Broader selection</span>
              </div>
            </div>
          </div>

          
          <div className="result-actions">
            
            <button
              className="primary-button"
              type="button"
              onClick={handleEnhanceClick}
              disabled={isLoading}
            >
              {isLoading ? 'Enhancing prompt...' : 'Enhance prompt'}
            </button>

            <p className="privacy-note">✦ Your idea, made clearer.</p>

          </div>

        </div>

        <div className="result-column">
          <section className="panel result-panel">
            <div className="panel-heading result-heading">
              <div className="heading-icon result-icon">✧</div>
              <div>
                <h2>Enhanced prompt</h2>
                <p>Your idea, structured for better results.</p>
              </div>
              <span className="ai-badge">AI GENERATED</span>
            </div>

            {enhancedPrompt ? (
              <div className="result-content">
                <pre className="result-text">{enhancedPrompt}</pre>
                <div className="result-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={handleCopy}
                  >
                    Copy enhanced prompt
                  </button>

                  <button
                    className="primary-button generate-answer-button"
                    type="button"
                    onClick={handleGenerateAnswer}
                    disabled={isAnswerLoading || !enhancedPrompt}
                  >
                    {isAnswerLoading ? 'Generating answer...' : 'Generate answer'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-art">
                  <span className="empty-art-back" />
                  <span className="empty-art-front">✧</span>
                  <span className="empty-art-spark">✳</span>
                </div>
                <h3>Your refined prompt starts here</h3>
                <p>Fill in your idea and any helpful details, then select <strong>Enhance prompt</strong>. Your structured result will appear here.</p>
              </div>
            )}
          </section>


          <section className="panel answer-panel">
            <div className="panel-heading">
              <div className="heading-icon answer-icon">✦</div>
              <div>
                <h2>Generated answer</h2>
                <p>The response produced from your enhanced prompt.</p>
              </div>
            </div>

            {answer ? (
              <div className="answer-content">
                <div className="answer-text">{answer}</div>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(answer)
                      setMessage('Answer copied to clipboard.')
                    } catch (error) {
                      console.error(error)
                      setMessage('Could not copy the answer automatically.')
                    }
                  }}
                >
                  Copy answer
                </button>
              </div>
            ) : (
              <div className="answer-empty">
                <h3>Your answer will appear here</h3>
                <p>Enhance your prompt first, then generate an answer when you're ready.</p>
              </div>
            )}
          </section>


          <section className="benefits-card">
            <p className="benefits-eyebrow">A LITTLE MORE CLARITY</p>
            <h3>Good ideas deserve great prompts.</h3>
            <div className="benefit-row">
              <span className="benefit-check">✓</span>
              <span>Clearer, more specific instructions</span>
            </div>
            <div className="benefit-row">
              <span className="benefit-check">✓</span>
              <span>Structure that is easy to reuse</span>
            </div>
            <div className="benefit-row">
              <span className="benefit-check">✓</span>
              <span>More control over your output</span>
            </div>
          </section>

          {message && (
            <p
              className={`status-message ${
                message.toLowerCase().includes('could not') ||
                message.toLowerCase().includes('please enter')
                  ? 'status-error'
                  : ''
              }`}
              role="status"
            >
              <span className="status-dot" />
              {message}
            </p>
          )}
        </div>
      </section>

      <footer className="page-footer">
        <span>Prompt Studio</span>
        <span>Thoughtfully built for better AI conversations.</span>
      </footer>
    </main>
  )
}

export default App
