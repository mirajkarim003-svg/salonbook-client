"use client";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api";

// const { data, loading, error, reload } = useApi("/stats/customer")
// Pass null as the path to skip loading.
export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      setData(await apiFetch(path));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
