import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "http", hostname: "localhost" },
      {
        protocol: "https",
        hostname: "cdnuploads.aa.com.tr",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      }
    ]
  }
};

export default withNextIntl(nextConfig);
