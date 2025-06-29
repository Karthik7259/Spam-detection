"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InfoIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
  MonitorStopIcon as StopIcon,
  SunIcon,
  MoonIcon,
  PaletteIcon,
  HelpCircleIcon,
} from "lucide-react"

// Add these CSS utility classes
const styles = `
.perspective-[1000px] {
  perspective: 1000px;
}
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
.rotate-x-10 {
  transform: rotateX(10deg);
}

/* Theme classes */
.theme-light {
  --bg-gradient-from: #f8fafc;
  --bg-gradient-to: #f1f5f9;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-muted: #f1f5f9;
  --bg-accent: #dbeafe;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --accent-primary: #3b82f6;
  --accent-secondary: #60a5fa;
  --match-color: #16a34a;
  --current-color: #eab308;
  --mismatch-color: #ef4444;
  --border-color: #e2e8f0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --card-highlight: rgba(59, 130, 246, 0.05);
}

.theme-dark {
  --bg-gradient-from: #0f172a;
  --bg-gradient-to: #1e293b;
  --bg-primary: #1e293b;
  --bg-secondary: #0f172a;
  --bg-muted: #334155;
  --bg-accent: #1e3a8a;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --accent-primary: #60a5fa;
  --accent-secondary: #93c5fd;
  --match-color: #4ade80;
  --current-color: #facc15;
  --mismatch-color: #f87171;
  --border-color: #334155;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --card-highlight: rgba(96, 165, 250, 0.05);
}

.theme-colorful {
  --bg-gradient-from: #dbeafe;
  --bg-gradient-to: #e0f2fe;
  --bg-primary: #f0f9ff;
  --bg-secondary: #e0f2fe;
  --bg-muted: #bae6fd;
  --bg-accent: #dbeafe;
  --text-primary: #0c4a6e;
  --text-secondary: #0369a1;
  --accent-primary: #8b5cf6;
  --accent-secondary: #a78bfa;
  --match-color: #059669;
  --current-color: #d97706;
  --mismatch-color: #dc2626;
  --border-color: #7dd3fc;
  --shadow-color: rgba(56, 189, 248, 0.2);
  --card-highlight: rgba(139, 92, 246, 0.05);
}

.char-box {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(8px);
  box-shadow: 
    0 4px 6px rgba(255, 255, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: var(--text-primary);
  border-radius: 8px;
}

.char-box-current {
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.95), rgba(234, 179, 8, 0.8));
  box-shadow: 
    0 8px 16px rgba(250, 204, 21, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.char-box-match {
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.95), rgba(21, 128, 61, 0.8));
  box-shadow: 
    0 8px 16px rgba(22, 163, 74, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.char-box-window {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.95), rgba(59, 130, 246, 0.8));
  box-shadow: 
    0 6px 12px rgba(96, 165, 250, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
    inset 0 0 25px rgba(255, 255, 255, 0.3);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.explanation-container {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

.explanation-match {
  color: var(--match-color);
}

.explanation-mismatch {
  color: var(--mismatch-color);
}

.explanation-position {
  color: var(--accent-primary);
}

.explanation-comparing {
  color: var(--current-color);
}

.explanation-shift {
  color: var(--accent-secondary);
}

.card-highlight {
  background-color: var(--card-highlight);
  border-color: var(--accent-primary);
}
`

// Types for our application
type Step = {
  textIndex: number
  patternIndex: number
  matches?: number[]
  badCharTable?: Record<string, number>
  failureFunction?: number[]
  explanation: string
  result?: { found: boolean; position: number }
}

type Theme = "light" | "dark" | "colorful"

function PatternMatcher() {
  // Theme state
  const [theme, setTheme] = useState<Theme>("light")

  // Add this at the beginning of the component
  useEffect(() => {
    // Add the custom styles to the document
    const styleElement = document.createElement("style")
    styleElement.textContent = styles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const [text, setText] = useState(
    "This is a sample text to search for patterns like special offer or free money within.",
  )
  const [pattern, setPattern] = useState("special offer")
  const [algorithm, setAlgorithm] = useState("horspool")
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(500) // milliseconds per step
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Step[]>([])
  const [explanation, setExplanation] = useState("")
  const [result, setResult] = useState<{ found: boolean; position: number } | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)
  const [showHelp, setShowHelp] = useState(false)

  // Reset visualization when text or pattern changes
  useEffect(() => {
    resetVisualization()
  }, [text, pattern, algorithm])

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = (timestamp: number) => {
        if (!lastStepTimeRef.current) lastStepTimeRef.current = timestamp

        const elapsed = timestamp - lastStepTimeRef.current

        if (elapsed > speed) {
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1)
            lastStepTimeRef.current = timestamp
          } else {
            setIsRunning(false)
          }
        }

        if (isRunning) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isRunning, currentStep, steps.length, speed])

  // Update explanation based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setExplanation(step.explanation)

      if (step.result) {
        setResult(step.result)
      }
    }
  }, [currentStep, steps])

  const resetVisualization = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setSteps([])
    setExplanation("")
    setResult(null)

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    lastStepTimeRef.current = 0
  }

  const startVisualization = () => {
    resetVisualization()

    // Generate steps based on selected algorithm
    const generatedSteps =
      algorithm === "horspool" 
        ? generateHorspoolSteps(text, pattern) 
        : algorithm === "kmp"
        ? generateKMPSteps(text, pattern)
        : generateBruteForceSteps(text, pattern)

    setSteps(generatedSteps)
    setIsRunning(true)
  }

  const pauseVisualization = () => {
    setIsRunning(false)
  }

  const resumeVisualization = () => {
    if (currentStep < steps.length - 1) {
      setIsRunning(true)
      lastStepTimeRef.current = 0
    }
  }

  const stopVisualization = () => {
    setIsRunning(false)
    setCurrentStep(0)
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className={`space-y-6 theme-${theme}`}>
      <div className="flex justify-between mb-4 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <HelpCircleIcon className="h-4 w-4 mr-2" />
          {showHelp ? "Hide Help" : "Show Help"}
        </Button>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("light")}
            className={theme === "light" ? "card-highlight" : ""}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <SunIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "card-highlight" : ""}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <MoonIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("colorful")}
            className={theme === "colorful" ? "card-highlight" : ""}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <PaletteIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showHelp && (
        <Card
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-primary)",
            boxShadow: "0 4px 12px var(--shadow-color)",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "var(--text-primary)" }}>How to Use This Visualizer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" style={{ color: "var(--text-primary)" }}>
              <div>
                <h3 className="font-semibold mb-1">1. Enter Text and Pattern</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Input the text to search within and the pattern (spam keyword) to search for.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">2. Select an Algorithm</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Choose between Horspool (more efficient), KMP (linear time), or Brute Force algorithm.
                </p>
                <ul className="text-xs list-disc pl-5 mt-1" style={{ color: "var(--text-secondary)" }}>
                  <li><strong>Horspool:</strong> Uses bad character heuristic for efficient skipping</li>
                  <li><strong>KMP:</strong> Uses failure function to avoid re-examining text characters</li>
                  <li><strong>Brute Force:</strong> Simple character-by-character comparison</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">3. Control the Animation</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Use the play, pause, step forward/backward buttons to control the visualization.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">4. Understand the Visualization</h3>
                <ul className="text-sm list-disc pl-5" style={{ color: "var(--text-secondary)" }}>
                  <li>
                    <span style={{ color: "var(--current-color)" }}>Yellow</span> boxes show characters being compared
                  </li>
                  <li>
                    <span style={{ color: "var(--match-color)" }}>Green</span> boxes show matched characters
                  </li>
                  <li>
                    <span style={{ color: "var(--accent-secondary)" }}>Blue</span> boxes show the current window
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            boxShadow: "0 4px 6px var(--shadow-color)",
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle style={{ color: "var(--text-primary)" }}>Text Input</CardTitle>
            <CardDescription style={{ color: "var(--text-secondary)" }}>
              Enter the text to search within
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter text to search within..."
              disabled={isRunning}
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </CardContent>
        </Card>

        <Card
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            boxShadow: "0 4px 6px var(--shadow-color)",
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle style={{ color: "var(--text-primary)" }}>Pattern Input</CardTitle>
            <CardDescription style={{ color: "var(--text-secondary)" }}>
              Enter the spam keyword pattern to search for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter pattern to search for..."
              disabled={isRunning}
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          boxShadow: "0 4px 6px var(--shadow-color)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle style={{ color: "var(--text-primary)" }}>Algorithm Settings</CardTitle>
          <CardDescription style={{ color: "var(--text-secondary)" }}>
            Configure the pattern matching algorithm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                  Select Algorithm
                </h3>
                <RadioGroup
                  value={algorithm}
                  onValueChange={setAlgorithm}
                  className="flex flex-col space-y-2"
                  disabled={isRunning}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="horspool" id="horspool" />
                    <Label htmlFor="horspool" style={{ color: "var(--text-primary)" }}>
                      Horspool Algorithm
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kmp" id="kmp" />
                    <Label htmlFor="kmp" style={{ color: "var(--text-primary)" }}>
                      KMP Algorithm
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bruteforce" id="bruteforce" />
                    <Label htmlFor="bruteforce" style={{ color: "var(--text-primary)" }}>
                      Brute Force Algorithm
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                  Animation Speed
                </h3>
                <div className="flex items-center space-x-4">
                  <Input
                    id="speed"
                    type="range"
                    min="100"
                    max="1000"
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full"
                    disabled={isRunning}
                  />
                  <span style={{ color: "var(--text-primary)" }}>{speed}ms</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isRunning ? (
                  <>
                    <Button
                      onClick={startVisualization}
                      disabled={!text || !pattern || currentStep > 0}
                      style={{
                        backgroundColor: "var(--accent-primary)",
                        color: "white",
                      }}
                    >
                      <PlayIcon className="mr-2 h-4 w-4" /> Start
                    </Button>
                    {currentStep > 0 && currentStep < steps.length && (
                      <Button
                        onClick={resumeVisualization}
                        style={{
                          backgroundColor: "var(--accent-primary)",
                          color: "white",
                        }}
                      >
                        <PlayIcon className="mr-2 h-4 w-4" /> Resume
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={pauseVisualization}
                    style={{
                      backgroundColor: "var(--accent-secondary)",
                      color: "white",
                    }}
                  >
                    <PauseIcon className="mr-2 h-4 w-4" /> Pause
                  </Button>
                )}
                <Button onClick={stopVisualization} variant="destructive" disabled={currentStep === 0 && !isRunning}>
                  <StopIcon className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button
                  onClick={stepBackward}
                  variant="outline"
                  disabled={currentStep === 0 || isRunning}
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  <SkipBackIcon className="h-4 w-4" />
                </Button>
                <Button
                  onClick={stepForward}
                  variant="outline"
                  disabled={currentStep >= steps.length - 1 || isRunning}
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  <SkipForwardIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          boxShadow: "0 4px 6px var(--shadow-color)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle style={{ color: "var(--text-primary)" }}>Visualization</CardTitle>
          <CardDescription style={{ color: "var(--text-secondary)" }}>
            {algorithm === "horspool" ? "Horspool" : algorithm === "kmp" ? "KMP" : "Brute Force"} algorithm in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border rounded-md p-4 min-h-[300px] overflow-hidden"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderColor: "var(--border-color)",
              boxShadow: "inset 0 2px 4px var(--shadow-color)",
            }}
          >
            {steps.length > 0 && currentStep < steps.length ? (
              <VisualizationDisplay text={text} pattern={pattern} step={steps[currentStep]} />
            ) : (
              <div className="flex items-center justify-center h-[300px]" style={{ color: "var(--text-secondary)" }}>
                <InfoIcon className="mr-2 h-5 w-5" />
                <span>Start the visualization to see the pattern matching process</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          boxShadow: "0 4px 6px var(--shadow-color)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle style={{ color: "var(--text-primary)" }}>Explanation</CardTitle>
          <CardDescription style={{ color: "var(--text-secondary)" }}>
            Step-by-step explanation of the matching process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {explanation ? (
              <div
                className="p-4 rounded-md border explanation-container"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  boxShadow: `0 4px 6px var(--shadow-color)`,
                }}
              >
                <EnhancedExplanation explanation={explanation} pattern={pattern} />
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Start the visualization to see the explanation.
              </p>
            )}

            {result !== null && (
              <Alert
                className={result.found ? "border-green-200" : "border-red-200"}
                style={{
                  backgroundColor: result.found ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)",
                  borderColor: result.found ? "var(--match-color)" : "var(--mismatch-color)",
                }}
              >
                <AlertDescription style={{ color: "var(--text-primary)" }}>
                  {result.found
                    ? `Pattern "${pattern}" found at position ${result.position}!`
                    : `Pattern "${pattern}" not found in the text.`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EnhancedExplanation({ explanation, pattern }: { explanation: string; pattern: string }) {
  // Highlight pattern occurrences in the explanation
  const parts = explanation.split(
    new RegExp(`(${pattern}|position \\d+|match|mismatch|comparing|shift by \\d+ positions)`, "gi"),
  )

  return (
    <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
      {parts.map((part, index) => {
        if (part.toLowerCase() === pattern.toLowerCase()) {
          return (
            <span key={index} className="font-bold explanation-match">
              {part}
            </span>
          )
        } else if (/position \d+/i.test(part)) {
          return (
            <span key={index} className="font-mono explanation-position">
              {part}
            </span>
          )
        } else if (/match/i.test(part)) {
          return (
            <span key={index} className="font-semibold explanation-match">
              {part}
            </span>
          )
        } else if (/mismatch/i.test(part)) {
          return (
            <span key={index} className="font-semibold explanation-mismatch">
              {part}
            </span>
          )
        } else if (/comparing/i.test(part)) {
          return (
            <span key={index} className="explanation-comparing">
              {part}
            </span>
          )
        } else if (/shift by \d+ positions/i.test(part)) {
          return (
            <span key={index} className="font-semibold explanation-shift">
              {part}
            </span>
          )
        } else {
          return <span key={index}>{part}</span>
        }
      })}
    </p>
  )
}

function VisualizationDisplay({ text, pattern, step }: { text: string; pattern: string; step: Step }) {
  const { textIndex, patternIndex, matches } = step
  const containerRef = useRef<HTMLDivElement>(null)

  // Split text and pattern into characters
  const textChars = text.split("")
  const patternChars = pattern.split("")

  return (
    <div className="space-y-8 perspective-[1000px] relative" ref={containerRef}>
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Text:
        </p>
        <div className="flex flex-wrap transform-style-preserve-3d">
          {textChars.map((char, index) => {
            let className = "char-box"
            let transform = ""
            let zIndex = 10
            let shadow = ""

            // Current text position being compared
            if (index === textIndex + patternIndex) {
              className = "char-box char-box-current"
              transform = "translateZ(20px) rotateX(-5deg)"
              zIndex = 30
              shadow = "0 8px 16px var(--shadow-color)"
            }

            // Matched characters
            else if (matches && matches.includes(index)) {
              className = "char-box char-box-match"
              transform = "translateZ(15px) rotateX(-3deg)"
              zIndex = 20
              shadow = "0 6px 12px var(--shadow-color)"
            }

            // Current window
            else if (index >= textIndex && index < textIndex + patternChars.length) {
              className = "char-box char-box-window"
              transform = "translateZ(10px)"
              shadow = "0 4px 8px var(--shadow-color)"
            }

            return (
              <div
                key={index}
                className={`inline-flex items-center justify-center w-10 h-10 m-0.5 border ${className} transition-all duration-300 ease-in-out`}
                style={{
                  transform,
                  zIndex,
                  boxShadow: shadow,
                }}
                data-index={index}
              >
                <span className="text-lg font-medium">{char}</span>
                <div className="absolute bottom-0 w-full text-[10px] text-center opacity-50">{index}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2 mt-16 transform rotate-x-10 perspective-[1000px]">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Pattern:
        </p>
        <div className="flex flex-wrap transform-style-preserve-3d">
          {patternChars.map((char, index) => {
            let className = "char-box"
            let transform = "translateZ(5px)"
            let shadow = "0 2px 4px var(--shadow-color)"

            // Current pattern position being compared
            if (index === patternIndex) {
              className = "char-box char-box-current"
              transform = "translateZ(25px) rotateY(-5deg)"
              shadow = "0 8px 16px var(--shadow-color)"
            }

            return (
              <div
                key={index}
                className={`inline-flex items-center justify-center w-10 h-10 m-0.5 border ${className} transition-all duration-300 ease-in-out`}
                style={{
                  transform,
                  zIndex: index === patternIndex ? 30 : 10,
                  boxShadow: shadow,
                }}
                data-pattern-index={index}
              >
                <span className="text-lg font-medium">{char}</span>
                <div className="absolute bottom-0 w-full text-[10px] text-center opacity-50">{index}</div>
              </div>
            )
          })}
        </div>
      </div>

      {step.badCharTable && (
        <div className="space-y-2 mt-8 transform perspective-[1000px]">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Bad Character Table (Horspool):
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse transform-style-preserve-3d">
              <thead>
                <tr>
                  {Object.keys(step.badCharTable).map((char) => (
                    <th
                      key={char}
                      className="border px-3 py-2 text-center"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                        transform: "translateZ(5px)",
                      }}
                    >
                      {char === " " ? "space" : char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.values(step.badCharTable).map((value, index) => (
                    <td
                      key={index}
                      className="border px-3 py-2 text-center"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                        transform: "translateZ(10px)",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {step.failureFunction && (
        <div className="space-y-2 mt-8 transform perspective-[1000px]">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Failure Function / LPS Array (KMP):
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse transform-style-preserve-3d">
              <thead>
                <tr>
                  <th
                    className="border px-3 py-2 text-center"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                      transform: "translateZ(5px)",
                    }}
                  >
                    Index
                  </th>
                  {pattern.split("").map((char, index) => (
                    <th
                      key={index}
                      className="border px-3 py-2 text-center"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                        transform: "translateZ(5px)",
                      }}
                    >
                      {index}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th
                    className="border px-3 py-2 text-center"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                      transform: "translateZ(5px)",
                    }}
                  >
                    Char
                  </th>
                  {pattern.split("").map((char, index) => (
                    <th
                      key={index}
                      className="border px-3 py-2 text-center"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                        transform: "translateZ(5px)",
                      }}
                    >
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="border px-3 py-2 text-center font-semibold"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                      transform: "translateZ(10px)",
                    }}
                  >
                    LPS
                  </td>
                  {step.failureFunction.map((value, index) => (
                    <td
                      key={index}
                      className="border px-3 py-2 text-center"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                        transform: "translateZ(10px)",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Generate steps for Horspool algorithm
function generateHorspoolSteps(text: string, pattern: string): Step[] {
  const steps: Step[] = []

  // Split text and pattern into characters
  const textChars = text.split("")
  const patternChars = pattern.split("")

  if (!text || !pattern || patternChars.length > textChars.length) {
    return [
      {
        textIndex: 0,
        patternIndex: 0,
        explanation: "Cannot perform pattern matching: text or pattern is empty, or pattern is longer than text.",
        result: { found: false, position: -1 },
      },
    ]
  }

  // Preprocess: build bad character table
  const badCharTable: Record<string, number> = {}

  // Default value for all characters is pattern length
  for (let i = 0; i < textChars.length; i++) {
    badCharTable[textChars[i]] = patternChars.length
  }

  // Update values for characters in pattern
  for (let i = 0; i < patternChars.length - 1; i++) {
    badCharTable[patternChars[i]] = patternChars.length - 1 - i
  }

  steps.push({
    textIndex: 0,
    patternIndex: 0,
    badCharTable: { ...badCharTable },
    explanation: `Initialized the Horspool algorithm. Created the bad character table which helps us skip unnecessary comparisons.`,
  })

  let textIndex = 0
  const matches: number[] = []

  while (textIndex <= textChars.length - patternChars.length) {
    let patternIndex = patternChars.length - 1

    // Compare pattern with text from right to left
    while (patternIndex >= 0 && patternChars[patternIndex] === textChars[textIndex + patternIndex]) {
      steps.push({
        textIndex,
        patternIndex,
        badCharTable: { ...badCharTable },
        matches: [...matches],
        explanation: `Comparing pattern[${patternIndex}] = '${patternChars[patternIndex]}' with text[${
          textIndex + patternIndex
        }] = '${textChars[textIndex + patternIndex]}'. They match!`,
      })

      patternIndex--
    }

    // If we matched the entire pattern
    if (patternIndex < 0) {
      // Add all matched positions to the matches array
      for (let i = 0; i < patternChars.length; i++) {
        matches.push(textIndex + i)
      }

      steps.push({
        textIndex,
        patternIndex: 0,
        badCharTable: { ...badCharTable },
        matches: [...matches],
        explanation: `Found a match at position ${textIndex}! The pattern "${pattern}" was found in the text.`,
        result: { found: true, position: textIndex },
      })

      // Early termination - we found a match
      break
    } else {
      // Mismatch occurred
      const mismatchChar = textChars[textIndex + patternIndex]
      const shift = badCharTable[mismatchChar] || patternChars.length

      steps.push({
        textIndex,
        patternIndex,
        badCharTable: { ...badCharTable },
        matches: [...matches],
        explanation: `Mismatch at pattern[${patternIndex}] = '${patternChars[patternIndex]}' and text[${
          textIndex + patternIndex
        }] = '${mismatchChar}'. Using bad character rule to shift by ${shift} positions.`,
      })

      textIndex += shift
    }
  }

  // If we didn't find any matches
  if (matches.length === 0) {
    steps.push({
      textIndex: Math.min(textChars.length - patternChars.length, textIndex),
      patternIndex: 0,
      badCharTable: { ...badCharTable },
      matches: [],
      explanation: `Completed search. No matches found for the pattern "${pattern}" in the text.`,
      result: { found: false, position: -1 },
    })
  }

  return steps
}

// Generate steps for KMP algorithm
function generateKMPSteps(text: string, pattern: string): Step[] {
  const steps: Step[] = []

  // Split text and pattern into characters
  const textChars = text.split("")
  const patternChars = pattern.split("")

  if (!text || !pattern || patternChars.length > textChars.length) {
    return [
      {
        textIndex: 0,
        patternIndex: 0,
        explanation: "Cannot perform pattern matching: text or pattern is empty, or pattern is longer than text.",
        result: { found: false, position: -1 },
      },
    ]
  }

  // Build failure function (LPS array)
  const failureFunction = buildFailureFunction(pattern)

  steps.push({
    textIndex: 0,
    patternIndex: 0,
    failureFunction: [...failureFunction],
    explanation: `Initialized the KMP algorithm. Created the failure function (LPS array) which helps us avoid unnecessary character comparisons.`,
  })

  let textIndex = 0
  let patternIndex = 0
  const matches: number[] = []

  while (textIndex < textChars.length) {
    steps.push({
      textIndex,
      patternIndex,
      failureFunction: [...failureFunction],
      matches: [...matches],
      explanation: `Comparing pattern[${patternIndex}] = '${patternChars[patternIndex]}' with text[${textIndex}] = '${textChars[textIndex]}'.`,
    })

    if (patternChars[patternIndex] === textChars[textIndex]) {
      // Match found
      textIndex++
      patternIndex++

      if (patternIndex === patternChars.length) {
        // Complete pattern match found
        const matchStart = textIndex - patternChars.length
        for (let i = 0; i < patternChars.length; i++) {
          matches.push(matchStart + i)
        }

        steps.push({
          textIndex: textIndex - 1,
          patternIndex: patternIndex - 1,
          failureFunction: [...failureFunction],
          matches: [...matches],
          explanation: `Found a match at position ${matchStart}! The pattern "${pattern}" was found in the text.`,
          result: { found: true, position: matchStart },
        })

        // Early termination - we found a match
        break
      }
    } else {
      // Mismatch
      if (patternIndex !== 0) {
        steps.push({
          textIndex,
          patternIndex,
          failureFunction: [...failureFunction],
          matches: [...matches],
          explanation: `Mismatch! Using failure function: pattern[${patternIndex}] doesn't match text[${textIndex}]. Moving pattern index from ${patternIndex} to ${failureFunction[patternIndex - 1]}.`,
        })
        patternIndex = failureFunction[patternIndex - 1]
      } else {
        steps.push({
          textIndex,
          patternIndex,
          failureFunction: [...failureFunction],
          matches: [...matches],
          explanation: `Mismatch at the beginning of pattern. Moving to next character in text.`,
        })
        textIndex++
      }
    }
  }

  // If we didn't find any matches
  if (matches.length === 0) {
    steps.push({
      textIndex: Math.min(textChars.length - 1, textIndex),
      patternIndex: 0,
      failureFunction: [...failureFunction],
      matches: [],
      explanation: `Completed search. No matches found for the pattern "${pattern}" in the text.`,
      result: { found: false, position: -1 },
    })
  }

  return steps
}

// Generate steps for Brute Force algorithm
function generateBruteForceSteps(text: string, pattern: string): Step[] {
  const steps: Step[] = []

  // Split text and pattern into characters
  const textChars = text.split("")
  const patternChars = pattern.split("")

  if (!text || !pattern || patternChars.length > textChars.length) {
    return [
      {
        textIndex: 0,
        patternIndex: 0,
        explanation: "Cannot perform pattern matching: text or pattern is empty, or pattern is longer than text.",
        result: { found: false, position: -1 },
      },
    ]
  }

  steps.push({
    textIndex: 0,
    patternIndex: 0,
    explanation: "Initialized the Brute Force algorithm. We'll check each possible position in the text.",
  })

  const matches: number[] = []

  for (let textIndex = 0; textIndex <= textChars.length - patternChars.length; textIndex++) {
    let patternIndex = 0
    let matched = true

    while (patternIndex < patternChars.length) {
      steps.push({
        textIndex,
        patternIndex,
        matches: [...matches],
        explanation: `Comparing pattern[${patternIndex}] = '${patternChars[patternIndex]}' with text[${
          textIndex + patternIndex
        }] = '${textChars[textIndex + patternIndex]}'.`,
      })

      if (patternChars[patternIndex] !== textChars[textIndex + patternIndex]) {
        matched = false

        steps.push({
          textIndex,
          patternIndex,
          matches: [...matches],
          explanation: `Mismatch found! Moving to the next position in text.`,
        })

        break
      }

      patternIndex++
    }

    if (matched) {
      // Add all matched positions to the matches array
      for (let i = 0; i < patternChars.length; i++) {
        matches.push(textIndex + i)
      }

      steps.push({
        textIndex,
        patternIndex: 0,
        matches: [...matches],
        explanation: `Found a match at position ${textIndex}! The pattern "${pattern}" was found in the text.`,
        result: { found: true, position: textIndex },
      })

      // Early termination - we found a match
      break
    }
  }

  // If we didn't find any matches
  if (matches.length === 0) {
    steps.push({
      textIndex: textChars.length - patternChars.length,
      patternIndex: 0,
      matches: [],
      explanation: `Completed search. No matches found for the pattern "${pattern}" in the text.`,
      result: { found: false, position: -1 },
    })
  }

  return steps
}

// Build failure function for KMP algorithm
function buildFailureFunction(pattern: string): number[] {
  const patternChars = pattern.split("")
  const failureFunction = new Array(patternChars.length).fill(0)
  
  let j = 0
  for (let i = 1; i < patternChars.length; i++) {
    while (j > 0 && patternChars[i] !== patternChars[j]) {
      j = failureFunction[j - 1]
    }
    if (patternChars[i] === patternChars[j]) {
      j++
    }
    failureFunction[i] = j
  }
  
  return failureFunction
}

export default PatternMatcher
