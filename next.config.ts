import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: any = {
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default withNextIntl(nextConfig);
