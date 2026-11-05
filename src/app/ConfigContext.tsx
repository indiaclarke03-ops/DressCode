import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CONFIG_PARAM, decodeConfig, encodeConfig } from '@/lib/urlState';
import { createDefaultConfig } from '@/tokens/defaults';
import { deriveTokens, type DesignTokens } from '@/tokens/deriveTokens';
import type { DesignConfig } from '@/tokens/types';
import { configReducer, type ConfigAction } from './configReducer';

interface ConfigContextValue {
  config: DesignConfig;
  tokens: DesignTokens;
  dispatch: Dispatch<ConfigAction>;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

/** Only pages that edit a config carry it in the URL. Redirect routes must not: a write
 * while the next page loads would overwrite the redirect and strand the visitor. */
const CONFIG_PAGES = /^\/((fresh|restyle)\/[^/]+|kit)$/;

/** Browsers rate-limit history writes, so wait for a pause in editing. */
const URL_WRITE_DELAY_MS = 250;

export function ConfigProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const encodedInUrl = searchParams.get(CONFIG_PARAM);

  const [config, dispatch] = useReducer(
    configReducer,
    encodedInUrl,
    (encoded) => (encoded && decodeConfig(encoded)) || createDefaultConfig(),
  );

  // The last value this provider read or wrote, so its own writes aren't re-read.
  const knownEncoded = useRef(encodedInUrl);

  useEffect(() => {
    if (!encodedInUrl || encodedInUrl === knownEncoded.current) return;
    knownEncoded.current = encodedInUrl;
    const incoming = decodeConfig(encodedInUrl);
    if (incoming) dispatch({ type: 'load', config: incoming });
  }, [encodedInUrl]);

  useEffect(() => {
    if (!CONFIG_PAGES.test(pathname)) return;
    const encoded = encodeConfig(config);
    if (encoded === encodedInUrl) return;

    const timer = window.setTimeout(() => {
      knownEncoded.current = encoded;
      setSearchParams(
        (params) => {
          params.set(CONFIG_PARAM, encoded);
          return params;
        },
        { replace: true, preventScrollReset: true },
      );
    }, URL_WRITE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [config, pathname, encodedInUrl, setSearchParams]);

  const value = useMemo(
    () => ({ config, tokens: deriveTokens(config), dispatch }),
    [config],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const value = useContext(ConfigContext);
  if (!value) throw new Error('useConfig must be used inside ConfigProvider');
  return value;
}
