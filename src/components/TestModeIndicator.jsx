/**
 * Test Mode Indicator Component
 * Shows when the application is running in Stripe test mode
 */

import { getModeInfo } from '../utils/pricingConfig';

export default function TestModeIndicator() {
  const modeInfo = getModeInfo();

  if (!modeInfo.isTest) {
    return null; // Don't show anything in production mode
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">🧪</span>
        <span>STRIPE TEST MODE - Use test cards only</span>
        <span className="text-lg">🧪</span>
      </div>
    </div>
  );
}

/**
 * Test Mode Badge Component
 * Can be used in other components to show test mode status
 */
export function TestModeBadge({ className = "" }) {
  const modeInfo = getModeInfo();

  if (!modeInfo.isTest) {
    return null;
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ${className}`}>
      🧪 TEST MODE
    </span>
  );
}

/**
 * Mode Status Component
 * Shows current mode (test/live) with styling
 */
export function ModeStatus({ showBadge = true, className = "" }) {
  const modeInfo = getModeInfo();

  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
  const modeClasses = modeInfo.isTest
    ? "bg-orange-100 text-orange-800 border border-orange-200"
    : "bg-green-100 text-green-800 border border-green-200";

  return (
    <div className={`${baseClasses} ${modeClasses} ${className}`}>
      <span className="mr-2">{modeInfo.isTest ? '🧪' : '🚀'}</span>
      <span>{modeInfo.label}</span>
    </div>
  );
}