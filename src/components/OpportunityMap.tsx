"use client";

import "reactflow/dist/style.css";

import { Paper, Stack, Text } from "@mantine/core";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap
} from "reactflow";
import type { Edge, Node } from "reactflow";
import type { OpportunityGraph, OpportunityNodeType } from "@/types/analysis";

type OpportunityMapProps = {
  graph: OpportunityGraph;
};

const nodePalette: Record<OpportunityNodeType, string> = {
  research: "#1d4ed8",
  technology: "#0d7a5f",
  product: "#d88b35",
  market: "#7c3aed",
  startup: "#111827"
};

function buildNodes(graph: OpportunityGraph): Node[] {
  const centerX = 360;
  const centerY = 220;
  const radius = 160;

  return graph.nodes.map((node, index) => {
    const angle = (index / Math.max(graph.nodes.length, 1)) * Math.PI * 2;

    return {
      id: node.id,
      position: {
        x: centerX + Math.cos(angle) * radius + (index % 2) * 40,
        y: centerY + Math.sin(angle) * radius + ((index + 1) % 2) * 20
      },
      data: { label: node.label },
      style: {
        padding: 14,
        borderRadius: 18,
        border: `1px solid ${nodePalette[node.type]}`,
        background: "rgba(255, 250, 240, 0.95)",
        color: "#22170d",
        width: 170,
        fontWeight: 600,
        boxShadow: "0 12px 24px rgba(52, 37, 18, 0.10)"
      }
    };
  });
}

function buildEdges(graph: OpportunityGraph): Edge[] {
  return graph.edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: "rgba(72, 53, 29, 0.6)"
    },
    style: {
      stroke: "rgba(72, 53, 29, 0.48)",
      strokeWidth: 1.8
    }
  }));
}

export function OpportunityMap({ graph }: OpportunityMapProps) {
  const hasGraph = graph.nodes.length > 0;

  return (
    <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={700}>Opportunity map</Text>
          <Text c="dimmed">
            The paper&apos;s research insight translated into technologies, markets, and
            startup concepts.
          </Text>
        </Stack>

        {hasGraph ? (
          <div
            style={{
              width: "100%",
              height: 460,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(72, 53, 29, 0.12)"
            }}
          >
            <ReactFlow
              nodes={buildNodes(graph)}
              edges={buildEdges(graph)}
              fitView
              minZoom={0.5}
              maxZoom={1.6}
              nodesDraggable={false}
            >
              <MiniMap
                pannable
                zoomable
                style={{ background: "rgba(255, 250, 240, 0.9)" }}
              />
              <Controls />
              <Background color="rgba(72, 53, 29, 0.12)" gap={24} />
            </ReactFlow>
          </div>
        ) : (
          <Paper radius="lg" p="lg" bg="rgba(255, 250, 240, 0.72)">
            <Text c="dimmed">
              The opportunity graph came back empty, so there is nothing to render
              yet.
            </Text>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
