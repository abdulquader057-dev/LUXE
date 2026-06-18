import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface RealtimeConfig {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema?: string;
  filter?: string;
}

/**
 * React hook for subscribing to Supabase PostgreSQL Realtime changes.
 * Handles automatic cleanup, reconnect, and status tracking.
 */
export function useSupabaseRealtime<T = any>(
  config: RealtimeConfig,
  onCallback: (payload: { eventType: string; new: T; old: T }) => void
) {
  const [status, setStatus] = useState<"SUBSCRIBED" | "TIMED_OUT" | "CLOSED" | "CHANNEL_ERROR">("CLOSED");
  const callbackRef = useRef(onCallback);

  // Keep callback ref updated to avoid websocket resubscription churn
  useEffect(() => {
    callbackRef.current = onCallback;
  }, [onCallback]);

  useEffect(() => {
    const channelName = `realtime:${config.schema || "public"}:${config.table}:${config.event || "*"}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: config.event || "*",
          schema: config.schema || "public",
          table: config.table,
          filter: config.filter,
        },
        (payload) => {
          callbackRef.current({
            eventType: payload.eventType,
            new: payload.new as T,
            old: payload.old as T,
          });
        }
      )
      .subscribe((statusValue) => {
        setStatus(statusValue as any);
        if (statusValue === "CHANNEL_ERROR") {
          console.error(`Supabase Realtime Channel Error on table ${config.table}`);
        }
      });

    return () => {
      supabase.removeChannel(channel).catch(err => {
        console.error("Failed to clean up Supabase Realtime channel:", err);
      });
    };
  }, [config.table, config.event, config.schema, config.filter]);

  return status;
}
