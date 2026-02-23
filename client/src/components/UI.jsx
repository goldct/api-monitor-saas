import { useState } from 'react';

// Toast notification component
function Toast({ message, type, onClose }) {
  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${types[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="hover:opacity-75 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Error message component
function ErrorMessage({ error, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">⚠️</span>
        <div>
          <p className="font-medium">Error occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Success message component
function SuccessMessage({ message, onDismiss }) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">✅</span>
        <div>
          <p className="font-medium">Success</p>
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto hover:opacity-75 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}

// Card component
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  );
}

// Badge component
function Badge({ children, type = 'default' }) {
  const types = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${types[type]}`}>
      {children}
    </span>
  );
}

// Stats card component
function StatsCard({ icon, label, value, change, positive = true }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-gray-600 font-medium">{label}</span>
        </div>
        {change && (
          <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

// Progress bar component
function ProgressBar({ value, max, label, color = 'blue' }) {
  const percentage = Math.round((value / max) * 100);
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colors[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export {
  Toast,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
  EmptyState,
  Card,
  Badge,
  StatsCard,
  ProgressBar
};
