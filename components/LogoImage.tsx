"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { withBasePath } from "@/lib/getBasePath";

/**
 * Componente de logo que aplica basePath dinamicamente
 */
export default function LogoImage() {
  const [logoPath, setLogoPath] = useState<string>("/images/logo.png");

  useEffect(() => {
    setLogoPath(withBasePath("/images/logo.png"));
  }, []);

  return (
    <div className="relative w-16 h-16">
      <Image
        src={logoPath}
        alt="Logo do site"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

