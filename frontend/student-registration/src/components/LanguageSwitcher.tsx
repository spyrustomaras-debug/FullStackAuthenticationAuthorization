// src/components/LanguageSwitcher.tsx
import React from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div>
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <button onClick={() => i18n.changeLanguage("gr")}>GR</button>
    </div>
  );
};

export default LanguageSwitcher;
