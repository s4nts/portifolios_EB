/** @type {import('next').NextConfig} */
// O GitHub Actions com static_site_generator: next configura automaticamente
// output: 'export' e basePath, então não definimos aqui

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [],
  },
  // Garantir que assets estáticos sejam copiados corretamente
  // O Next.js copia automaticamente a pasta public/ para out/ quando usa output: 'export'
  // Configurações de segurança
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
