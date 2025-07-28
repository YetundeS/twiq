/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: ['api.dicebear.com', "hbdzdybodzljzkolefcj.supabase.co"],
    dangerouslyAllowSVG: true, // ⚠️ USE WITH CAUTION
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/webp', 'image/avif'], // Use modern formats
    minimumCacheTTL: 60, // Cache images for 1 minute
  },

  // Enable compression
  compress: true,

  // Bundle optimization
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu', 
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'framer-motion'
    ],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        // Split chunks for better caching
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for third-party libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              enforce: true,
            },
            // UI components chunk
            ui: {
              test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
              name: 'ui',
              chunks: 'all',
              enforce: true,
            },
            // Common utilities chunk
            utils: {
              test: /[\\/]src[\\/](utils|lib|hooks)[\\/]/,
              name: 'utils',
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };

      // Bundle analyzer in production
      if (process.env.ANALYZE === 'true') {
        config.plugins.push(
          new (require('@next/bundle-analyzer'))({
            enabled: true,
          })
        );
      }
    }

    // Optimize imports
    config.resolve.alias = {
      ...config.resolve.alias,
      // Replace heavy libraries with lighter alternatives if needed
    };

    return config;
  },

  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  generateEtags: true, // Enable ETags for caching
  
  // Production-only optimizations
  ...(process.env.NODE_ENV === 'production' && {
    
    // Headers for better caching and security
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
        {
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  }),

  // Environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'production' ? 'production-value' : 'development-value',
  },
};

export default nextConfig;
