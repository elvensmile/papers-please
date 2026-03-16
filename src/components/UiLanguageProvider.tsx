"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  uiCopy,
  type TranslationKey,
  type TranslationParams,
  type UiLanguage
} from "@/i18n/ui";

type UiLanguageContextValue = {
  language: UiLanguage;
  setLanguage: (language: UiLanguage) => void;
};

const UiLanguageContext = createContext<UiLanguageContextValue | null>(null);
const STORAGE_KEY = "papers-please-ui-language";

export function UiLanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<UiLanguage>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "ja") {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return (
    <UiLanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </UiLanguageContext.Provider>
  );
}

export function useUiLanguage() {
  const context = useContext(UiLanguageContext);

  if (context == null) {
    throw new Error("useUiLanguage must be used within UiLanguageProvider.");
  }

  return context;
}

function getNestedValue(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, source);
}

function interpolate(template: string, params?: TranslationParams) {
  if (params == null) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const value = params[token];
    return value == null ? `{{${token}}}` : String(value);
  });
}

export function useTranslation() {
  const { language } = useUiLanguage();

  return (key: TranslationKey, params?: TranslationParams) => {
    const localized = getNestedValue(uiCopy[language], key);
    const fallback = getNestedValue(uiCopy.en, key);
    const resolved =
      typeof localized === "string"
        ? localized
        : typeof fallback === "string"
          ? fallback
          : key;

    return interpolate(resolved, params);
  };
}

export function useTranslations(keys: TranslationKey[], params?: TranslationParams) {
  const t = useTranslation();
  return keys.map((key) => t(key, params));
}
