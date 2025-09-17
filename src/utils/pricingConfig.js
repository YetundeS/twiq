/**
 * Pricing Configuration Utility
 * Switches between test and production pricing based on environment
 */

import { SITE_CONTENT } from '../constants/landingPageContent';
import { TEST_PRICING_PLANS, TEST_CREDIT_OPTIONS } from '../constants/testPricing';

/**
 * Determines if we're in test mode
 * @returns {boolean} - True if in test mode
 */
export function isTestMode() {
  return process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === 'true';
}

/**
 * Gets the appropriate pricing plans based on the current mode
 * @returns {Array} - Pricing plans for current mode
 */
export function getPricingPlans() {
  if (isTestMode()) {
    console.log('🧪 Using TEST mode pricing plans');
    return TEST_PRICING_PLANS;
  } else {
    console.log('🚀 Using PRODUCTION mode pricing plans');
    return SITE_CONTENT.pricingPlans;
  }
}

/**
 * Gets the appropriate credit options based on the current mode
 * @returns {Array} - Credit options for current mode
 */
export function getCreditOptions() {
  if (isTestMode()) {
    console.log('🧪 Using TEST mode credit options');
    return TEST_CREDIT_OPTIONS;
  } else {
    console.log('🚀 Using PRODUCTION mode credit options');
    // Return the production credit options (from BuyCreditDialog component)
    return [
      { label: "$25", price: 2500, input_tokens: 37500, output_tokens: 7500, cached_tokens: 15000 },
      { label: "$50", price: 5000, input_tokens: 75500, output_tokens: 15000, cached_tokens: 30000, recommended: true },
      { label: "$75", price: 7500, input_tokens: 112500, output_tokens: 22500, cached_tokens: 45000 },
      { label: "$100", price: 10000, input_tokens: 150000, output_tokens: 30500, cached_tokens: 60000 }
    ];
  }
}

/**
 * Gets the mode indicator for UI display
 * @returns {object} - Mode info for display
 */
export function getModeInfo() {
  const testMode = isTestMode();
  return {
    isTest: testMode,
    label: testMode ? 'TEST MODE' : 'LIVE MODE',
    badge: testMode ? '🧪 TEST' : '🚀 LIVE',
    className: testMode ? 'test-mode' : 'live-mode'
  };
}

/**
 * Validates test mode configuration
 * @returns {object} - Validation result
 */
export function validateTestConfiguration() {
  if (!isTestMode()) {
    return { valid: true, message: 'Production mode - no validation needed' };
  }

  const missingPrices = TEST_PRICING_PLANS.filter(plan =>
    plan.priceId.includes('TEST') && plan.priceId === 'price_TEST_STARTER_399_YEAR'
  );

  if (missingPrices.length > 0) {
    return {
      valid: false,
      message: 'Test mode detected but test price IDs not configured. Please update testPricing.js with actual Stripe test price IDs.'
    };
  }

  return { valid: true, message: 'Test configuration valid' };
}