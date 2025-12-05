/** @type {import('next').NextConfig} */
// BASE_PATH é definido automaticamente pelo actions/configure-pages@v5
// NEXT_PUBLIC_BASE_PATH pode ser definido manualmente se necessário
const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    // Desabilitar otimização de imagens para static export (mais seguro)
    formats: ['image/webp', 'image/avif'],
  },
  // Configuração para GitHub Pages
  ...(basePath && { basePath }),
  ...(basePath && { assetPrefix: basePath }),
  trailingSlash: true,
  // Configurações de segurança
  poweredByHeader: false,
  compress: true,
  // Desabilitar features que não funcionam com static export
  reactStrictMode: true,
};

module.exports = nextConfig;
