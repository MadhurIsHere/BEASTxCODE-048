import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, Settings, HelpCircle, Save, Timer, Target, CheckCircle, AlertCircle, Star, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// SA COMPONENT LIBRARY - SETS ADVENTURE MODULE
// Prefix: SA/COMP/ for all components

interface ComponentShowcaseProps {
  className?: string;
}

// SA/COMP/Button Variants
const SAButton: React.FC<{
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ variant, size, children, onClick, disabled = false, className = "" }) => {
  const baseClasses = "sa-button font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "sa-button-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-cyan-500",
    secondary: "sa-button-secondary bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 focus:ring-slate-500",
    ghost: "sa-button-ghost bg-transparent hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent focus:ring-slate-400"
  };
  
  const sizeClasses = {
    small: "px-3 py-2 text-sm rounded-md min-h-[32px]",
    medium: "px-4 py-3 text-base rounded-lg min-h-[44px]",
    large: "px-6 py-4 text-lg rounded-xl min-h-[48px]"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// SA/COMP/IconButton
const SAIconButton: React.FC<{
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
  'aria-label': string;
}> = ({ icon, variant = 'ghost', size = 'medium', onClick, className = "", 'aria-label': ariaLabel }) => {
  const baseClasses = "sa-icon-button inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg hover:shadow-xl hover:scale-110 focus:ring-cyan-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 focus:ring-slate-500",
    ghost: "bg-transparent hover:bg-slate-700/50 text-slate-300 hover:text-white focus:ring-slate-400"
  };
  
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

// SA/COMP/Card
const SACard: React.FC<{
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'highlighted';
  className?: string;
}> = ({ title, children, variant = 'default', className = "" }) => {
  const baseClasses = "sa-card bg-slate-800/50 border-slate-700 backdrop-blur-sm rounded-xl transition-all duration-300";
  
  const variantClasses = {
    default: "",
    interactive: "hover:bg-slate-700/50 hover:border-slate-600 hover:scale-105 cursor-pointer",
    highlighted: "bg-gradient-to-br from-slate-700/70 to-slate-800/70 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
  };
  
  return (
    <Card className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-white font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="text-slate-200">
        {children}
      </CardContent>
    </Card>
  );
};

// SA/COMP/HUD (Top Bar)
const SAHUD: React.FC<{
  title: string;
  onBack?: () => void;
  onSettings?: () => void;
  actions?: React.ReactNode;
  variant?: 'mobile' | 'tablet' | 'desktop';
}> = ({ title, onBack, onSettings, actions, variant = 'desktop' }) => {
  const containerClasses = {
    mobile: "px-3 py-2",
    tablet: "px-4 py-3", 
    desktop: "px-6 py-4"
  };
  
  const titleClasses = {
    mobile: "text-sm font-semibold max-w-[120px]",
    tablet: "text-base font-semibold max-w-[200px]",
    desktop: "text-lg font-semibold max-w-[300px]"
  };
  
  return (
    <div className={`sa-hud fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 ${containerClasses[variant]}`}>
      <div className="flex items-center justify-between">
        {/* Left - Back Button */}
        {onBack && (
          <SAIconButton
            icon={<ArrowLeft className="w-5 h-5" />}
            variant="ghost"
            size={variant === 'mobile' ? 'small' : 'medium'}
            onClick={onBack}
            aria-label="Go back"
          />
        )}
        
        {/* Center - Title */}
        <div className="flex-1 text-center">
          <h2 className={`text-white truncate mx-auto ${titleClasses[variant]}`}>
            {title}
          </h2>
        </div>
        
        {/* Right - Actions */}
        <div className="flex items-center space-x-2">
          {actions}
          {onSettings && (
            <SAIconButton
              icon={<Settings className="w-5 h-5" />}
              variant="ghost"
              size={variant === 'mobile' ? 'small' : 'medium'}
              onClick={onSettings}
              aria-label="Settings"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// SA/COMP/BottomNav
const SABottomNav: React.FC<{
  onPrevious?: () => void;
  onReplay?: () => void;
  onHint?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  variant?: 'mobile' | 'tablet' | 'desktop';
}> = ({ 
  onPrevious, 
  onReplay, 
  onHint, 
  onNext, 
  canGoPrevious = false, 
  canGoNext = false,
  variant = 'desktop'
}) => {
  const containerClasses = {
    mobile: "px-3 py-2",
    tablet: "px-4 py-3",
    desktop: "px-6 py-4"
  };
  
  const buttonSize = variant === 'mobile' ? 'small' : 'medium';
  
  return (
    <div className={`sa-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-t border-slate-700/50 ${containerClasses[variant]}`}>
      <div className="flex items-center justify-center space-x-4">
        <SAIconButton
          icon={<ArrowLeft className="w-5 h-5" />}
          variant={canGoPrevious ? 'secondary' : 'ghost'}
          size={buttonSize}
          onClick={onPrevious}
          aria-label="Previous"
          className={!canGoPrevious ? 'opacity-50 cursor-not-allowed' : ''}
        />
        
        {onReplay && (
          <SAIconButton
            icon={<RotateCcw className="w-5 h-5" />}
            variant="ghost"
            size={buttonSize}
            onClick={onReplay}
            aria-label="Replay"
          />
        )}
        
        {onHint && (
          <SAIconButton
            icon={<HelpCircle className="w-5 h-5" />}
            variant="ghost"
            size={buttonSize}
            onClick={onHint}
            aria-label="Hint"
          />
        )}
        
        <SAIconButton
          icon={<ArrowRight className="w-5 h-5" />}
          variant={canGoNext ? 'primary' : 'ghost'}
          size={buttonSize}
          onClick={onNext}
          aria-label="Next"
          className={!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </div>
    </div>
  );
};

// SA/COMP/Modal
const SAModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'mobile' | 'tablet' | 'desktop';
}> = ({ isOpen, onClose, title, children, variant = 'desktop' }) => {
  if (!isOpen) return null;
  
  const containerClasses = {
    mobile: "max-w-sm mx-4",
    tablet: "max-w-md mx-6",
    desktop: "max-w-lg mx-8"
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl ${containerClasses[variant]}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <SAIconButton
              icon={<ArrowLeft className="w-5 h-5 rotate-45" />}
              variant="ghost"
              size="small"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="text-slate-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// SA/COMP/Toast
const SAToast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose?: () => void;
}> = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  const typeStyles = {
    success: "bg-green-900/90 border-green-500/50 text-green-100",
    error: "bg-red-900/90 border-red-500/50 text-red-100", 
    info: "bg-blue-900/90 border-blue-500/50 text-blue-100"
  };
  
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Star className="w-5 h-5" />
  };
  
  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300 ${typeStyles[type]}`}>
      {icons[type]}
      <span className="font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
};

// SA/COMP/Radio/Options
const SARadioOptions: React.FC<{
  options: { id: string; label: string; value: string }[];
  selectedValue?: string;
  onChange: (value: string) => void;
  variant?: 'mobile' | 'tablet' | 'desktop';
}> = ({ options, selectedValue, onChange, variant = 'desktop' }) => {
  const optionClasses = {
    mobile: "p-3 text-sm",
    tablet: "p-4 text-base",
    desktop: "p-4 text-base"
  };
  
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.value)}
          className={`w-full text-left border rounded-lg transition-all duration-300 ${optionClasses[variant]} ${
            selectedValue === option.value
              ? 'bg-cyan-900/30 border-cyan-500 text-cyan-100'
              : 'bg-slate-800/50 border-slate-600 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedValue === option.value
                ? 'border-cyan-500 bg-cyan-500'
                : 'border-slate-400'
            }`}>
              {selectedValue === option.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span>{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// SA/COMP/NumericKeypad
const SANumericKeypad: React.FC<{
  onNumberClick: (num: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  variant?: 'mobile' | 'tablet' | 'desktop';
}> = ({ onNumberClick, onClear, onSubmit, variant = 'desktop' }) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  const keypadClasses = {
    mobile: "grid-cols-3 gap-2",
    tablet: "grid-cols-3 gap-3",
    desktop: "grid-cols-3 gap-4"
  };
  
  const buttonClasses = {
    mobile: "h-10 text-sm",
    tablet: "h-12 text-base",
    desktop: "h-14 text-lg"
  };
  
  return (
    <div className="sa-numeric-keypad bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className={`grid ${keypadClasses[variant]} mb-4`}>
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className={`${buttonClasses[variant]} bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105`}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClear}
          className={`${buttonClasses[variant]} bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all duration-200`}
        >
          Clear
        </button>
        <button
          onClick={onSubmit}
          className={`${buttonClasses[variant]} bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all duration-200`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// SA/COMP/ProgressShard
const SAProgressShard: React.FC<{
  progress: number;
  isActive: boolean;
  isCompleted: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ progress, isActive, isCompleted, size = 'medium', className = "" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };
  
  const textSizes = {
    small: "text-xs",
    medium: "text-xs",
    large: "text-sm"
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Hexagonal Progress Shard */}
      <svg 
        className={`w-full h-full transition-all duration-300 ${
          isActive ? 'text-cyan-400 scale-110' : isCompleted ? 'text-green-400' : 'text-slate-500'
        }`} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        <path 
          d="M17.5 3.5L22 7.5V16.5L17.5 20.5H6.5L2 16.5V7.5L6.5 3.5H17.5Z" 
          fill={`rgba(6, 182, 212, ${progress / 100})`}
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Progress Text */}
      {progress > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${textSizes[size]} font-semibold text-white`}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      {/* Completion Checkmark */}
      {isCompleted && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

// SA/COMP/Timer Widget
const SATimerWidget: React.FC<{
  timeRemaining: number; // in seconds
  totalTime: number;
  isRunning: boolean;
  onToggle: () => void;
  variant?: 'mobile' | 'tablet' | 'desktop';
  showControls?: boolean;
}> = ({ timeRemaining, totalTime, isRunning, onToggle, variant = 'desktop', showControls = true }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  
  const sizeClasses = {
    mobile: "w-16 h-16",
    tablet: "w-20 h-20", 
    desktop: "w-24 h-24"
  };
  
  const textSizes = {
    mobile: "text-xs",
    tablet: "text-sm",
    desktop: "text-base"
  };
  
  const isWarning = timeRemaining <= 60; // Last minute warning
  
  return (
    <div className="sa-timer-widget flex items-center space-x-3">
      {/* Circular Progress Timer */}
      <div className={`relative ${sizeClasses[variant]}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgb(71, 85, 105)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={isWarning ? "rgb(239, 68, 68)" : "rgb(6, 182, 212)"}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-500"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold ${textSizes[variant]} ${
            isWarning ? 'text-red-400' : 'text-white'
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <Timer className={`w-3 h-3 ${isWarning ? 'text-red-400' : 'text-cyan-400'}`} />
        </div>
      </div>
      
      {/* Timer Controls */}
      {showControls && (
        <div className="flex flex-col space-y-2">
          <SAIconButton
            icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            variant="ghost"
            size="small"
            onClick={onToggle}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          />
          <div className={`text-center ${textSizes[variant]}`}>
            <span className={`font-medium ${isWarning ? 'text-red-400' : 'text-slate-300'}`}>
              {isRunning ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Component Showcase
export const SA_Components: React.FC<ComponentShowcaseProps> = ({ className = "" }) => {
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [numInput, setNumInput] = useState('');
  
  const radioOptions = [
    { id: '1', label: 'Option A', value: 'option1' },
    { id: '2', label: 'Option B', value: 'option2' },
    { id: '3', label: 'Option C', value: 'option3' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SA/COMP/ Component Library
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Complete Sets Adventure component system with responsive variants for mobile, tablet, and desktop devices.
          </p>
        </div>

        {/* Button Variants */}
        <SACard title="SA/COMP/Button Variants" variant="highlighted">
          <div className="space-y-6">
            {/* Primary Buttons */}
            <div>
              <h4 className="text-cyan-400 font-semibold mb-3">Primary Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <SAButton variant="primary" size="small">Small Primary</SAButton>
                <SAButton variant="primary" size="medium">Medium Primary</SAButton>
                <SAButton variant="primary" size="large">Large Primary</SAButton>
                <SAButton variant="primary" size="medium" disabled>Disabled</SAButton>
              </div>
            </div>
            
            {/* Secondary Buttons */}
            <div>
              <h4 className="text-slate-300 font-semibold mb-3">Secondary Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <SAButton variant="secondary" size="small">Small Secondary</SAButton>
                <SAButton variant="secondary" size="medium">Medium Secondary</SAButton>
                <SAButton variant="secondary" size="large">Large Secondary</SAButton>
              </div>
            </div>
            
            {/* Ghost Buttons */}
            <div>
              <h4 className="text-slate-400 font-semibold mb-3">Ghost Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <SAButton variant="ghost" size="small">Small Ghost</SAButton>
                <SAButton variant="ghost" size="medium">Medium Ghost</SAButton>
                <SAButton variant="ghost" size="large">Large Ghost</SAButton>
              </div>
            </div>
          </div>
        </SACard>

        {/* Icon Buttons */}
        <SACard title="SA/COMP/IconButton Variants">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-3">Primary Icons</h4>
              <div className="flex space-x-3">
                <SAIconButton icon={<Play className="w-5 h-5" />} variant="primary" size="small" aria-label="Play" />
                <SAIconButton icon={<Pause className="w-5 h-5" />} variant="primary" size="medium" aria-label="Pause" />
                <SAIconButton icon={<Target className="w-6 h-6" />} variant="primary" size="large" aria-label="Target" />
              </div>
            </div>
            
            <div>
              <h4 className="text-slate-300 font-semibold mb-3">Secondary Icons</h4>
              <div className="flex space-x-3">
                <SAIconButton icon={<Save className="w-4 h-4" />} variant="secondary" size="small" aria-label="Save" />
                <SAIconButton icon={<Settings className="w-5 h-5" />} variant="secondary" size="medium" aria-label="Settings" />
                <SAIconButton icon={<Zap className="w-6 h-6" />} variant="secondary" size="large" aria-label="Zap" />
              </div>
            </div>
            
            <div>
              <h4 className="text-slate-400 font-semibold mb-3">Ghost Icons</h4>
              <div className="flex space-x-3">
                <SAIconButton icon={<HelpCircle className="w-4 h-4" />} variant="ghost" size="small" aria-label="Help" />
                <SAIconButton icon={<RotateCcw className="w-5 h-5" />} variant="ghost" size="medium" aria-label="Reload" />
                <SAIconButton icon={<ArrowRight className="w-6 h-6" />} variant="ghost" size="large" aria-label="Next" />
              </div>
            </div>
          </div>
        </SACard>

        {/* HUD Examples */}
        <SACard title="SA/COMP/HUD Responsive Variants">
          <div className="space-y-6">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-3">Desktop HUD</h4>
              <div className="relative">
                <SAHUD
                  title="Sets Adventure - What is a Set?"
                  onBack={() => {}}
                  onSettings={() => {}}
                  actions={
                    <SAIconButton 
                      icon={<Save className="w-5 h-5" />} 
                      variant="ghost" 
                      size="medium" 
                      aria-label="Save progress" 
                    />
                  }
                  variant="desktop"
                />
                <div className="h-16" />
              </div>
            </div>
            
            <div>
              <h4 className="text-slate-300 font-semibold mb-3">Mobile HUD</h4>
              <div className="relative max-w-sm mx-auto">
                <SAHUD
                  title="What is a Set?"
                  onBack={() => {}}
                  onSettings={() => {}}
                  variant="mobile"
                />
                <div className="h-12" />
              </div>
            </div>
          </div>
        </SACard>

        {/* Interactive Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Shards */}
          <SACard title="SA/COMP/ProgressShard">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <SAProgressShard progress={100} isActive={false} isCompleted={true} size="large" />
                <SAProgressShard progress={75} isActive={true} isCompleted={false} size="large" />
                <SAProgressShard progress={45} isActive={false} isCompleted={false} size="large" />
                <SAProgressShard progress={0} isActive={false} isCompleted={false} size="large" />
              </div>
              <p className="text-sm text-slate-400">Hexagonal progress indicators with completion states</p>
            </div>
          </SACard>

          {/* Timer Widget */}
          <SACard title="SA/COMP/Timer Widget">
            <div className="flex justify-center">
              <SATimerWidget
                timeRemaining={125}
                totalTime={300}
                isRunning={timerRunning}
                onToggle={() => setTimerRunning(!timerRunning)}
                variant="desktop"
                showControls={true}
              />
            </div>
          </SACard>
        </div>

        {/* Radio Options */}
        <SACard title="SA/COMP/Radio Options">
          <div className="max-w-md">
            <SARadioOptions
              options={radioOptions}
              selectedValue={selectedRadio}
              onChange={setSelectedRadio}
              variant="desktop"
            />
          </div>
        </SACard>

        {/* Numeric Keypad */}
        <SACard title="SA/COMP/NumericKeypad">
          <div className="max-w-xs mx-auto">
            <div className="mb-4 p-3 bg-slate-900/50 rounded-lg text-center">
              <span className="text-xl font-mono text-cyan-400">{numInput || '0'}</span>
            </div>
            <SANumericKeypad
              onNumberClick={(num) => setNumInput(prev => prev + num)}
              onClear={() => setNumInput('')}
              onSubmit={() => setShowToast(true)}
              variant="desktop"
            />
          </div>
        </SACard>

        {/* Interactive Elements */}
        <div className="flex flex-wrap gap-4 justify-center">
          <SAButton 
            variant="primary" 
            size="medium"
            onClick={() => setShowModal(true)}
          >
            Show Modal
          </SAButton>
          
          <SAButton 
            variant="secondary" 
            size="medium"
            onClick={() => setShowToast(true)}
          >
            Show Toast
          </SAButton>
        </div>

        {/* Bottom Navigation Example */}
        <div className="relative">
          <h3 className="text-center text-lg font-semibold mb-4 text-cyan-400">SA/COMP/BottomNav</h3>
          <SABottomNav
            onPrevious={() => {}}
            onReplay={() => {}}
            onHint={() => {}}
            onNext={() => {}}
            canGoPrevious={true}
            canGoNext={true}
            variant="desktop"
          />
          <div className="h-20" />
        </div>
      </div>

      {/* Modal Example */}
      <SAModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Sets Adventure Modal"
        variant="desktop"
      >
        <div className="space-y-4">
          <p>This is an example modal component with responsive variants for different screen sizes.</p>
          <div className="flex space-x-3">
            <SAButton variant="primary" size="medium" onClick={() => setShowModal(false)}>
              Confirm
            </SAButton>
            <SAButton variant="ghost" size="medium" onClick={() => setShowModal(false)}>
              Cancel
            </SAButton>
          </div>
        </div>
      </SAModal>

      {/* Toast Example */}
      <SAToast
        message="Progress saved successfully!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default SA_Components;