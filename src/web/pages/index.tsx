import { useState, useRef, useEffect, useCallback } from "react";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseType?: ResponseType;
  visualData?: VisualResponseData;
}

type AppState = "idle" | "thinking" | "planning" | "responding";

interface ThinkingPhase {
  label: string;
  friendlyLabel: string;
  duration: number;
}

type ResponseType = "button" | "form" | "api" | "styling" | "general";

interface VisualResponseData {
  type: ResponseType;
  title: string;
  description: string;
  codeContent: string;
}

// Thinking phases with friendly labels
const THINKING_PHASES: ThinkingPhase[] = [
  { label: "Reading codebase...", friendlyLabel: "Understanding your request", duration: 2500 },
  { label: "Analyzing context...", friendlyLabel: "Designing the solution", duration: 2500 },
  { label: "Planning approach...", friendlyLabel: "Building the components", duration: 2500 },
  { label: "Generating response...", friendlyLabel: "Adding final touches", duration: 4500 },
];

const TOTAL_THINKING_TIME = THINKING_PHASES.reduce((acc, p) => acc + p.duration, 0);

// Determine response type from user message
const getResponseType = (userMessage: string): ResponseType => {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes("button") || lower.includes("component") || lower.includes("react")) {
    return "button";
  }
  if (lower.includes("form") || lower.includes("input") || lower.includes("signup") || lower.includes("login")) {
    return "form";
  }
  if (lower.includes("api") || lower.includes("fetch") || lower.includes("request") || lower.includes("backend")) {
    return "api";
  }
  if (lower.includes("style") || lower.includes("css") || lower.includes("color") || lower.includes("design")) {
    return "styling";
  }
  return "general";
};

// Get friendly description based on response type
const getFriendlyResponse = (type: ResponseType): { title: string; description: string } => {
  switch (type) {
    case "button":
      return {
        title: "Interactive Button Element",
        description: "I created a set of beautiful, clickable buttons with different styles for your project. They respond to clicks and look great on any screen size."
      };
    case "form":
      return {
        title: "Smart Input Form",
        description: "Here's a clean form that collects information from your users. It validates entries and guides people through each field."
      };
    case "api":
      return {
        title: "Data Connection",
        description: "I set up a way for your app to talk to servers and get information. This handles loading states and errors gracefully."
      };
    case "styling":
      return {
        title: "Visual Enhancement",
        description: "I've improved the look and feel with modern styling. Colors, spacing, and animations work together to create a polished experience."
      };
    default:
      return {
        title: "Custom Solution",
        description: "I built something tailored to your needs. Here's what it looks like in action:"
      };
  }
};

// Mock code for technical details
const getMockCode = (type: ResponseType): string => {
  switch (type) {
    case "button":
      return `interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) => {
  const baseStyles = "rounded-lg font-medium transition-all";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-100"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button className={\`\${baseStyles} \${variants[variant]} \${sizes[size]}\`} onClick={onClick}>
      {children}
    </button>
  );
};`;
    case "form":
      return `interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [data, setData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!data.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (data.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Submit form
    } else {
      setErrors(validationErrors);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};`;
    case "api":
      return `async function fetchApi<T>(url: string, options?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    
    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, error };
  }
}`;
    case "styling":
      return `/* Modern color palette */
:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --background: #0f172a;
  --surface: #1e293b;
  --text: #f8fafc;
  --muted: #94a3b8;
}

/* Smooth transitions */
.animated-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive spacing */
.container {
  padding: clamp(1rem, 5vw, 3rem);
}`;
    default:
      return `const solution = async () => {
  interface Config {
    debug: boolean;
    apiUrl: string;
    timeout: number;
  }

  const defaults: Config = {
    debug: process.env.NODE_ENV === 'development',
    apiUrl: 'https://api.example.com',
    timeout: 5000,
  };

  try {
    const result = await executeTask(config);
    return { success: true, data: result };
  } catch (error) {
    console.error('[Error]', error);
    return { success: false, error };
  }
};`;
  }
};

// Video Ad Data
const VIDEO_ADS = [
  {
    id: "vercel",
    name: "Vercel",
    tagline: "Ship faster with zero config deployments",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    logo: "▲",
  },
  {
    id: "supabase", 
    name: "Supabase",
    tagline: "Build in a weekend, scale to millions",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    logo: "⚡",
  },
];

// Terminal colors as CSS variables
const COLORS = {
  bg: "#1e1e2e",
  surface: "#282839",
  border: "#3d3d52",
  text: "#cdd6f4",
  muted: "#6c7086",
  orange: "#e07a5f",
  green: "#6ec07a",
  cyan: "#89dceb",
  yellow: "#f9e2af",
  pink: "#f5c2e7",
  purple: "#cba6f7",
  red: "#f38ba8",
  blue: "#89b4fa",
};

// ASCII Art Mascot
const AsciiMascot = () => (
  <div className="text-xs leading-none select-none font-mono" style={{ color: COLORS.orange }}>
    <div>{"   ▄▄▄▄▄▄▄"}</div>
    <div>{"  █░░░░░░░█"}</div>
    <div>{"  █░▀░░░▀░█"}</div>
    <div>{"  █░░░░░░░█"}</div>
    <div>{"  █░░▀▀▀░░█"}</div>
    <div>{"   ▀▀▀▀▀▀▀"}</div>
  </div>
);

// ASCII Spinner
const AsciiSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const [frame, setFrame] = useState(0);
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frames.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);
  
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };
  
  return <span className={sizeClasses[size]} style={{ color: COLORS.orange }}>{frames[frame]}</span>;
};

// Code syntax highlighting
const highlightCode = (code: string): string => {
  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'class', 'extends', 'interface', 'type'];
  const types = ['string', 'number', 'boolean', 'void', 'null', 'undefined', 'any', 'never', 'Promise', 'Error', 'React'];
  
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\/\/.*$)/gm, `<span style="color: ${COLORS.muted}">$1</span>`)
    .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, `<span style="color: ${COLORS.green}">$1$2$1</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, `<span style="color: ${COLORS.yellow}">$1</span>`);

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${COLORS.pink}">$1</span>`);
  });

  types.forEach(type => {
    const regex = new RegExp(`\\b(${type})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${COLORS.cyan}">$1</span>`);
  });

  return highlighted;
};

// Full Screen Video Ad Overlay
const FullScreenAdOverlay = ({ 
  currentPhase, 
  phaseIndex, 
  secondsRemaining, 
  isVisible,
  onFadeComplete 
}: { 
  currentPhase: string;
  phaseIndex: number;
  secondsRemaining: number;
  isVisible: boolean;
  onFadeComplete: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const currentAd = VIDEO_ADS[currentAdIndex];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % VIDEO_ADS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible, currentAdIndex]);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(onFadeComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onFadeComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ 
        backgroundColor: "rgba(0, 0, 0, 0.92)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div 
        className="absolute top-4 right-4 md:top-6 md:right-6 px-3 py-1.5 rounded text-xs font-mono"
        style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: `1px dashed ${COLORS.border}`,
          color: COLORS.muted,
        }}
      >
        Skip in {secondsRemaining}s
      </div>

      <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-3">
        <span 
          className="px-2 py-1 text-xs uppercase tracking-widest font-mono"
          style={{ 
            backgroundColor: COLORS.orange,
            color: COLORS.bg,
          }}
        >
          Sponsored
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentAd.logo}</span>
          <span className="text-sm font-mono" style={{ color: COLORS.text }}>{currentAd.name}</span>
        </div>
      </div>

      <div 
        className="w-[90vw] max-w-5xl aspect-video rounded-lg overflow-hidden relative"
        style={{ border: `2px dashed ${COLORS.border}` }}
      >
        <video
          ref={videoRef}
          key={currentAd.id}
          src={currentAd.videoUrl}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <p className="text-lg md:text-xl font-mono" style={{ color: COLORS.text }}>
            {currentAd.tagline}
          </p>
        </div>
      </div>

      <div 
        className="absolute bottom-4 left-0 right-0 md:bottom-6"
        style={{ pointerEvents: "none" }}
      >
        <div 
          className="max-w-md mx-auto px-4 py-3 rounded-lg font-mono text-center"
          style={{ 
            backgroundColor: "rgba(30, 30, 46, 0.9)",
            border: `1px dashed ${COLORS.border}`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <AsciiSpinner size="sm" />
            <span className="text-sm" style={{ color: COLORS.orange }}>
              Step {phaseIndex + 1}/{THINKING_PHASES.length}
            </span>
          </div>
          
          <p className="text-xs" style={{ color: COLORS.muted }}>
            {currentPhase}
          </p>
          
          <div 
            className="mt-2 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: COLORS.surface }}
          >
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                backgroundColor: COLORS.orange,
                width: `${((phaseIndex + 1) / THINKING_PHASES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Planning Phase Indicator with steps
const PlanningPhase = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: "🎯", label: "Understanding your request" },
    { icon: "✏️", label: "Designing the solution" },
    { icon: "🔧", label: "Building the components" },
    { icon: "✨", label: "Adding final touches" },
  ];

  return (
    <div className="py-6 animate-fadeIn">
      <div 
        className="rounded-xl p-6"
        style={{ 
          backgroundColor: COLORS.surface,
          border: `1px dashed ${COLORS.border}`,
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl animate-bounce">🎨</div>
          <div>
            <h3 className="text-lg font-medium" style={{ color: COLORS.text }}>
              Creating your plan...
            </h3>
            <p className="text-sm" style={{ color: COLORS.muted }}>
              Building something great for you
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={step.label}
                className="flex items-center gap-3 transition-all duration-300"
                style={{ 
                  opacity: index <= currentStep ? 1 : 0.4,
                  transform: isCurrent ? 'translateX(4px)' : 'none',
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
                  style={{ 
                    backgroundColor: isComplete ? COLORS.green : isCurrent ? COLORS.orange : COLORS.bg,
                    color: isComplete || isCurrent ? COLORS.bg : COLORS.muted,
                  }}
                >
                  {isComplete ? "✓" : step.icon}
                </div>
                <span 
                  className="text-sm"
                  style={{ color: isComplete ? COLORS.green : isCurrent ? COLORS.orange : COLORS.muted }}
                >
                  {step.label}
                </span>
                {isCurrent && <AsciiSpinner size="sm" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Visual Preview Components
const ButtonPreview = () => {
  const [clicked, setClicked] = useState<string | null>(null);
  
  return (
    <div className="flex flex-wrap gap-3 justify-center py-4">
      {/* Primary Buttons */}
      <button
        onClick={() => setClicked("primary")}
        className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.purple} 100%)`,
          color: 'white',
          boxShadow: clicked === "primary" ? `0 0 20px ${COLORS.blue}50` : 'none',
        }}
      >
        Primary Button
      </button>
      
      {/* Secondary Button */}
      <button
        onClick={() => setClicked("secondary")}
        className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ 
          backgroundColor: COLORS.surface,
          color: COLORS.text,
          border: `1px solid ${COLORS.border}`,
          boxShadow: clicked === "secondary" ? `0 0 20px ${COLORS.surface}` : 'none',
        }}
      >
        Secondary Button
      </button>
      
      {/* Ghost Button */}
      <button
        onClick={() => setClicked("ghost")}
        className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-white/5"
        style={{ 
          backgroundColor: 'transparent',
          color: COLORS.muted,
          border: `1px dashed ${COLORS.border}`,
        }}
      >
        Ghost Button
      </button>
      
      {/* Icon Button */}
      <button
        onClick={() => setClicked("icon")}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ 
          backgroundColor: COLORS.orange,
          color: COLORS.bg,
        }}
      >
        ⚡
      </button>
      
      {clicked && (
        <div className="w-full text-center text-xs mt-2" style={{ color: COLORS.green }}>
          ✓ You clicked the {clicked} button!
        </div>
      )}
    </div>
  );
};

const FormPreview = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  return (
    <div className="max-w-sm mx-auto py-4">
      <form 
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs mb-1.5" style={{ color: COLORS.muted }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all"
            style={{ 
              backgroundColor: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
          />
        </div>
        
        <div>
          <label className="block text-xs mb-1.5" style={{ color: COLORS.muted }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all"
            style={{ 
              backgroundColor: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
          style={{ 
            background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.cyan} 100%)`,
            color: COLORS.bg,
          }}
        >
          {submitted ? "✓ Signed In!" : "Sign In"}
        </button>
      </form>
      
      {submitted && (
        <div 
          className="mt-3 text-center text-xs p-2 rounded"
          style={{ backgroundColor: `${COLORS.green}20`, color: COLORS.green }}
        >
          Form submitted successfully! (This is a demo)
        </div>
      )}
    </div>
  );
};

const ApiFlowPreview = () => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  const steps = [
    { label: "Your App", icon: "📱", color: COLORS.blue },
    { label: "Request", icon: "→", color: COLORS.orange },
    { label: "Server", icon: "🖥️", color: COLORS.purple },
    { label: "Response", icon: "←", color: COLORS.green },
  ];
  
  return (
    <div className="py-6">
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div 
              className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: step === i ? `${s.color}20` : 'transparent',
                transform: step === i ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <div 
                className="text-2xl transition-all"
                style={{ 
                  filter: step === i ? 'none' : 'grayscale(50%)',
                }}
              >
                {s.icon}
              </div>
              <span className="text-xs" style={{ color: step === i ? s.color : COLORS.muted }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && i !== 1 && i !== 3 && (
              <div 
                className="w-8 h-0.5 transition-all"
                style={{ 
                  backgroundColor: step > i ? COLORS.green : COLORS.border,
                }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.surface, color: COLORS.muted }}>
          {step === 0 && "App initiates request"}
          {step === 1 && "Sending data to server..."}
          {step === 2 && "Server processes request"}
          {step === 3 && "Data returned to app"}
        </span>
      </div>
    </div>
  );
};

const StylingPreview = () => {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  
  return (
    <div className="py-4">
      {/* Tab switcher */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("before")}
          className="px-4 py-1.5 rounded-full text-xs transition-all"
          style={{ 
            backgroundColor: activeTab === "before" ? COLORS.orange : COLORS.surface,
            color: activeTab === "before" ? COLORS.bg : COLORS.muted,
          }}
        >
          Before
        </button>
        <button
          onClick={() => setActiveTab("after")}
          className="px-4 py-1.5 rounded-full text-xs transition-all"
          style={{ 
            backgroundColor: activeTab === "after" ? COLORS.green : COLORS.surface,
            color: activeTab === "after" ? COLORS.bg : COLORS.muted,
          }}
        >
          After
        </button>
      </div>
      
      {/* Preview card */}
      <div 
        className="rounded-lg p-4 transition-all duration-500"
        style={{ 
          backgroundColor: activeTab === "before" ? "#374151" : COLORS.surface,
          border: activeTab === "before" ? "1px solid #6b7280" : `1px solid ${COLORS.purple}`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
            style={{ 
              backgroundColor: activeTab === "before" ? "#6b7280" : `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
              background: activeTab === "before" ? "#6b7280" : `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`,
            }}
          >
            {activeTab === "before" ? "👤" : "✨"}
          </div>
          <div>
            <div 
              className="text-sm font-medium transition-all"
              style={{ color: activeTab === "before" ? "#9ca3af" : COLORS.text }}
            >
              Card Title
            </div>
            <div 
              className="text-xs transition-all"
              style={{ color: activeTab === "before" ? "#6b7280" : COLORS.muted }}
            >
              Subtitle text
            </div>
          </div>
        </div>
        <p 
          className="text-xs leading-relaxed transition-all"
          style={{ color: activeTab === "before" ? "#9ca3af" : COLORS.text }}
        >
          {activeTab === "before" 
            ? "This is basic unstyled content with default colors and no visual hierarchy."
            : "Beautiful styled content with proper colors, gradients, and visual polish!"}
        </p>
      </div>
    </div>
  );
};

const GeneralPreview = () => {
  const [status, setStatus] = useState<"idle" | "running" | "success">("idle");
  
  useEffect(() => {
    if (status === "running") {
      const timer = setTimeout(() => setStatus("success"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  return (
    <div className="py-4 text-center">
      <div 
        className="inline-flex flex-col items-center gap-4 p-6 rounded-xl"
        style={{ backgroundColor: COLORS.surface }}
      >
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all"
          style={{ 
            backgroundColor: status === "success" ? `${COLORS.green}20` : `${COLORS.orange}20`,
          }}
        >
          {status === "idle" && "⚡"}
          {status === "running" && <AsciiSpinner size="lg" />}
          {status === "success" && "✅"}
        </div>
        
        <div>
          <div className="text-sm font-medium" style={{ color: COLORS.text }}>
            {status === "idle" && "Ready to execute"}
            {status === "running" && "Processing..."}
            {status === "success" && "Task completed!"}
          </div>
          <div className="text-xs mt-1" style={{ color: COLORS.muted }}>
            {status === "idle" && "Click the button to run"}
            {status === "running" && "Please wait a moment"}
            {status === "success" && "Everything worked perfectly"}
          </div>
        </div>
        
        {status !== "running" && (
          <button
            onClick={() => {
              setStatus("running");
              if (status === "success") setStatus("idle");
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ 
              backgroundColor: COLORS.orange,
              color: COLORS.bg,
            }}
          >
            {status === "success" ? "Run Again" : "Execute"}
          </button>
        )}
      </div>
    </div>
  );
};

// Preview Frame Component
const PreviewFrame = ({ type, children }: { type: ResponseType; children: React.ReactNode }) => {
  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ border: `1px dashed ${COLORS.border}` }}
    >
      {/* Browser header */}
      <div 
        className="flex items-center gap-3 px-4 py-2"
        style={{ backgroundColor: COLORS.surface }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.red }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.green }} />
        </div>
        <div 
          className="flex-1 text-center text-xs"
          style={{ color: COLORS.muted }}
        >
          Live Preview
        </div>
        <div className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.bg, color: COLORS.green }}>
          Interactive
        </div>
      </div>
      
      {/* Preview content */}
      <div 
        className="p-6"
        style={{ backgroundColor: COLORS.bg }}
      >
        {children}
      </div>
    </div>
  );
};

// Visual Response Component
const VisualResponse = ({ data, isStreaming }: { data: VisualResponseData; isStreaming: boolean }) => {
  const [showCode, setShowCode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const renderPreview = () => {
    switch (data.type) {
      case "button":
        return <ButtonPreview />;
      case "form":
        return <FormPreview />;
      case "api":
        return <ApiFlowPreview />;
      case "styling":
        return <StylingPreview />;
      default:
        return <GeneralPreview />;
    }
  };
  
  return (
    <div 
      className="mt-4 mb-6 transition-all duration-500"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      {/* Success indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: COLORS.green }}>✓</span>
        <span className="text-sm" style={{ color: COLORS.muted }}>Here's what I made for you</span>
        {isStreaming && <AsciiSpinner size="sm" />}
      </div>
      
      {/* Title and description */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-1" style={{ color: COLORS.text }}>
          {data.title}
        </h3>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {data.description}
        </p>
      </div>
      
      {/* Visual Preview Frame */}
      <PreviewFrame type={data.type}>
        {renderPreview()}
      </PreviewFrame>
      
      {/* Technical details toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-2 text-xs transition-all hover:opacity-80"
          style={{ color: COLORS.muted }}
        >
          <span>{showCode ? "▼" : "▶"}</span>
          <span>Technical details</span>
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: COLORS.surface }}>
            Optional
          </span>
        </button>
        
        {showCode && (
          <div 
            className="mt-3 rounded-lg overflow-hidden animate-fadeIn"
            style={{ border: `1px dashed ${COLORS.border}` }}
          >
            <div 
              className="flex items-center justify-between px-3 py-2"
              style={{ backgroundColor: COLORS.surface }}
            >
              <span className="text-xs" style={{ color: COLORS.muted }}>Code</span>
              <button 
                className="text-xs transition-colors hover:opacity-80"
                style={{ color: COLORS.muted }}
                onClick={() => navigator.clipboard.writeText(data.codeContent)}
              >
                [copy]
              </button>
            </div>
            <pre 
              className="p-4 overflow-x-auto text-xs leading-relaxed"
              style={{ backgroundColor: "#161622" }}
            >
              <code dangerouslySetInnerHTML={{ __html: highlightCode(data.codeContent) }} />
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// User Message Component
const UserMessage = ({ content }: { content: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className="transition-all duration-200"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(4px)',
      }}
    >
      <div className="flex items-start gap-2">
        <span className="select-none" style={{ color: COLORS.green }}>{'>'}</span>
        <span style={{ color: COLORS.text }}>{content}</span>
      </div>
    </div>
  );
};

// Header Component
const TerminalHeader = () => (
  <div 
    className="rounded-lg p-4 mb-6"
    style={{ border: `1px dashed ${COLORS.border}` }}
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <AsciiMascot />
        <div>
          <h1 className="text-lg font-medium">
            <span style={{ color: COLORS.orange }}>Claude Code</span>
            <span style={{ color: COLORS.muted }}> + Ads</span>
            <span className="text-xs ml-2" style={{ color: COLORS.muted }}>v2.0.0</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
            Sonnet 4 • Visual Mode • Hackathon Demo
          </p>
        </div>
      </div>
      <div className="text-xs space-y-1" style={{ color: COLORS.muted }}>
        <div className="flex items-center gap-2">
          <span style={{ color: COLORS.green }}>✓</span>
          <span>Visual previews enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: COLORS.green }}>✓</span>
          <span>Non-technical mode active</span>
        </div>
      </div>
    </div>
  </div>
);

// Welcome Section
const WelcomeSection = ({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const suggestions = [
    { text: "Create a beautiful button", icon: "🔘" },
    { text: "Build a login form", icon: "📝" },
    { text: "Connect to an API", icon: "🔗" },
    { text: "Style my page", icon: "🎨" },
  ];

  return (
    <div 
      className="py-8 transition-all duration-300"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      <div className="text-center mb-8">
        <h2 className="text-xl mb-2" style={{ color: COLORS.text }}>
          What would you like to create?
        </h2>
        <p className="text-sm" style={{ color: COLORS.muted }}>
          I'll show you a live preview of what I build — no code required
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {suggestions.map((suggestion, i) => (
          <button
            key={suggestion.text}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-center gap-3 p-4 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] group"
            style={{ 
              border: `1px dashed ${COLORS.border}`,
              backgroundColor: COLORS.surface,
            }}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              {suggestion.icon}
            </span>
            <span className="text-sm" style={{ color: COLORS.text }}>
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.ceil(TOTAL_THINKING_TIME / 1000));
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [pendingResponse, setPendingResponse] = useState<VisualResponseData | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  useEffect(() => {
    if (state !== "thinking") return;

    let phaseIdx = 0;
    
    const countdownInterval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    const progressPhases = () => {
      if (phaseIdx < THINKING_PHASES.length) {
        setCurrentPhaseIndex(phaseIdx);
        const duration = THINKING_PHASES[phaseIdx].duration;
        phaseIdx++;
        
        if (phaseIdx < THINKING_PHASES.length) {
          setTimeout(progressPhases, duration);
        }
      }
    };

    progressPhases();

    return () => {
      clearInterval(countdownInterval);
    };
  }, [state]);

  const startResponse = useCallback(() => {
    if (!pendingResponse) return;
    
    setState("planning");
    setShowAdOverlay(false);
    
    // Show planning phase for a bit, then show response
    setTimeout(() => {
      setIsStreaming(true);
      setState("responding");
      
      // Simulate streaming completion
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
          responseType: pendingResponse.type,
          visualData: pendingResponse,
        }]);
        setIsStreaming(false);
        setState("idle");
        setPendingResponse(null);
        inputRef.current?.focus();
      }, 1500);
    }, 3000);
  }, [pendingResponse]);

  const handleAdFadeComplete = useCallback(() => {
    startResponse();
  }, [startResponse]);

  const handleSend = useCallback(() => {
    if (!input.trim() || state !== "idle") return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setState("thinking");
    setCurrentPhaseIndex(0);
    setSecondsRemaining(Math.ceil(TOTAL_THINKING_TIME / 1000));
    setShowAdOverlay(true);

    // Generate visual response data
    const responseType = getResponseType(userMessage.content);
    const { title, description } = getFriendlyResponse(responseType);
    const codeContent = getMockCode(responseType);
    
    setPendingResponse({
      type: responseType,
      title,
      description,
      codeContent,
    });

    setTimeout(() => {
      setShowAdOverlay(false);
    }, TOTAL_THINKING_TIME);
  }, [input, state]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const currentPhaseName = THINKING_PHASES[currentPhaseIndex]?.label || "Processing...";

  return (
    <div 
      className="min-h-screen flex flex-col p-4 md:p-6 font-mono"
      style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
    >
      {/* Fade animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Full Screen Ad Overlay */}
      {state === "thinking" && (
        <FullScreenAdOverlay
          currentPhase={currentPhaseName}
          phaseIndex={currentPhaseIndex}
          secondsRemaining={secondsRemaining}
          isVisible={showAdOverlay}
          onFadeComplete={handleAdFadeComplete}
        />
      )}

      <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
        {/* Header */}
        <TerminalHeader />

        {/* Main Chat Area */}
        <main className="flex-1 overflow-y-auto mb-4 space-y-2">
          {/* Welcome message */}
          {messages.length === 0 && state === "idle" && (
            <WelcomeSection onSuggestionClick={handleSuggestionClick} />
          )}

          {/* Messages */}
          {messages.map(message => (
            message.role === "user" ? (
              <UserMessage key={message.id} content={message.content} />
            ) : message.visualData ? (
              <VisualResponse key={message.id} data={message.visualData} isStreaming={false} />
            ) : null
          ))}

          {/* Planning phase indicator */}
          {state === "planning" && (
            <PlanningPhase currentStep={currentPhaseIndex} />
          )}

          {/* Streaming response */}
          {state === "responding" && pendingResponse && (
            <VisualResponse data={pendingResponse} isStreaming={isStreaming} />
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input Bar */}
        <footer 
          className="rounded-lg p-3"
          style={{ border: `1px dashed ${COLORS.border}` }}
        >
          <div className="flex items-center gap-2">
            <span className="select-none font-bold" style={{ color: COLORS.orange }}>{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={state === "idle" ? "Describe what you want to create..." : "Creating..."}
              disabled={state !== "idle"}
              className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50"
              style={{ color: COLORS.text }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || state !== "idle"}
              className="px-3 py-1 text-sm rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ 
                border: `1px dashed ${COLORS.border}`,
                color: COLORS.muted,
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.color = COLORS.orange;
                  e.currentTarget.style.borderColor = COLORS.orange;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = COLORS.muted;
                e.currentTarget.style.borderColor = COLORS.border;
              }}
            >
              [create]
            </button>
          </div>
        </footer>

        {/* Footer Note */}
        <p className="text-center text-xs mt-4" style={{ color: COLORS.muted }}>
          Ads shown only during processing • Visual previews enabled • Hackathon Demo
        </p>
      </div>
    </div>
  );
}
