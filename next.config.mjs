/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.dicebear.com', "hbdzdybodzljzkolefcj.supabase.co"],
    dangerouslyAllowSVG: true, // ⚠️ USE WITH CAUTION
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
