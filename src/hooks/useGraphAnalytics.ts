"use client";

import { useCallback, useRef } from "react";
import { isAnalyticsConfigured } from "@/lib/analytics/config";

/**
 * Event types tracked by the graph analytics system.
 *
 * Time-to-understanding flow:
 *   graph.explore.start → graph.explore.drill_down → graph.explore.navigate_to_code
 *   (duration = navigate_to_code.timestamp - start.timestamp)
 */
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Send an analytics event.
 * Uses navigator.sendBeacon for fire-and-forget delivery.
 * Falls back to console.debug when analytics is not configured.
 */
function sendEvent(evt: AnalyticsEvent) {
  if (!isAnalyticsConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", evt.event, evt.properties);
    }
    return;
  }

  // PostHog capture via REST API (no SDK dependency needed)
  const { posthogKey, posthogHost } = require("@/lib/analytics/config").analyticsConfig;
  const payload = JSON.stringify({
    api_key: posthogKey,
    event: evt.event,
    properties: {
      ...evt.properties,
      $lib: "myceliums-web",
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });

  try {
    navigator.sendBeacon(`${posthogHost}/capture/`, payload);
  } catch {
    // Beacon API not available — best-effort
  }
}

/**
 * React hook for graph exploration analytics.
 *
 * Tracks:
 * - graph.explore.start: user opens the graph
 * - graph.explore.drill_down: user clicks into a cluster
 * - graph.explore.search: user performs semantic search
 * - graph.explore.navigate_to_code: user clicks through to source code
 * - graph.explore.node_detail: user opens node detail panel
 *
 * Time-to-understanding is calculated as the delta between start and navigate_to_code.
 */
export function useGraphAnalytics() {
  const startTime = useRef<number | null>(null);

  const trackExploreStart = useCallback(() => {
    startTime.current = Date.now();
    sendEvent({ event: "graph.explore.start" });
  }, []);

  const trackDrillDown = useCallback(
    (clusterId: string, clusterLabel: string) => {
      sendEvent({
        event: "graph.explore.drill_down",
        properties: {
          cluster_id: clusterId,
          cluster_label: clusterLabel,
          time_since_start_ms: startTime.current
            ? Date.now() - startTime.current
            : 0,
        },
      });
    },
    []
  );

  const trackSearch = useCallback((query: string, resultCount: number) => {
    sendEvent({
      event: "graph.explore.search",
      properties: {
        query_length: query.length,
        result_count: resultCount,
        time_since_start_ms: startTime.current
          ? Date.now() - startTime.current
          : 0,
      },
    });
  }, []);

  const trackNavigateToCode = useCallback(
    (symbolId: string, file: string) => {
      const timeToUnderstanding = startTime.current
        ? Date.now() - startTime.current
        : 0;
      sendEvent({
        event: "graph.explore.navigate_to_code",
        properties: {
          symbol_id: symbolId,
          file,
          time_to_understanding_ms: timeToUnderstanding,
        },
      });
    },
    []
  );

  const trackNodeDetail = useCallback((nodeId: string, nodeName: string) => {
    sendEvent({
      event: "graph.explore.node_detail",
      properties: {
        node_id: nodeId,
        node_name: nodeName,
      },
    });
  }, []);

  return {
    trackExploreStart,
    trackDrillDown,
    trackSearch,
    trackNavigateToCode,
    trackNodeDetail,
  };
}
