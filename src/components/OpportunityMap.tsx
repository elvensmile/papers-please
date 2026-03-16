"use client";

import "reactflow/dist/style.css";

import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap
} from "reactflow";
import type { Edge, Node } from "reactflow";
import { useTranslation } from "@/components/UiLanguageProvider";
import type {
  OpportunityGraph,
  OpportunityNode,
  OpportunityNodeType
} from "@/types/analysis";

type OpportunityMapProps = {
  graph: OpportunityGraph;
};

const nodePalette: Record<OpportunityNodeType, string> = {
  research: "#2563eb",
  technology: "#0f766e",
  product: "#d97706",
  market: "#7c3aed",
  startup: "#111827"
};

const columnOrder: OpportunityNodeType[] = [
  "research",
  "technology",
  "product",
  "market",
  "startup"
];

const columnLabels: Record<OpportunityNodeType, string> = {
  research: "Research",
  technology: "Technology",
  product: "Product",
  market: "Market",
  startup: "Startup"
};

function groupNodesByType(nodes: OpportunityNode[]) {
  const grouped = new Map<OpportunityNodeType, OpportunityNode[]>();

  for (const type of columnOrder) {
    grouped.set(type, []);
  }

  for (const node of nodes) {
    grouped.get(node.type)?.push(node);
  }

  return grouped;
}

function buildNodes(graph: OpportunityGraph): Node[] {
  const grouped = groupNodesByType(graph.nodes);
  const columnWidth = 230;
  const startX = 40;
  const startY = 44;
  const rowGap = 104;

  return columnOrder.flatMap((type, columnIndex) => {
    const nodes = grouped.get(type) ?? [];

    return nodes.map((node, rowIndex) => ({
      id: node.id,
      position: {
        x: startX + columnIndex * columnWidth,
        y: startY + rowIndex * rowGap
      },
      data: {
        label: node.label,
        typeLabel: columnLabels[node.type],
        typeColor: nodePalette[node.type]
      },
      style: {
        padding: "10px 12px",
        borderRadius: 14,
        border: `1px solid ${nodePalette[node.type]}22`,
        background: "#ffffff",
        color: "#111827",
        width: 184,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.25,
        boxShadow: "0 6px 18px rgba(17, 24, 39, 0.06)"
      }
    }));
  });
}

function buildEdges(graph: OpportunityGraph): Edge[] {
  return graph.edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: "rgba(17, 24, 39, 0.24)"
    },
    style: {
      stroke: "rgba(17, 24, 39, 0.18)",
      strokeWidth: 1.5
    }
  }));
}

export function OpportunityMap({ graph }: OpportunityMapProps) {
  const t = useTranslation();
  const hasGraph = graph.nodes.length > 0;
  const visibleTypes = columnOrder.filter((type) =>
    graph.nodes.some((node) => node.type === type)
  );

  return (
    <Paper className="section-card" p={{ base: "lg", md: "xl" }} radius={20}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600} fz="sm">
            {t("map.title")}
          </Text>
          <Text c="dimmed" fz="sm">
            {t("map.description")}
          </Text>
        </Stack>

        {hasGraph ? (
          <>
            <Group gap="xs" wrap="wrap">
              {visibleTypes.map((type) => (
                <Badge
                  key={type}
                  variant="light"
                  radius="xl"
                  style={{
                    background: `${nodePalette[type]}12`,
                    color: nodePalette[type],
                    border: `1px solid ${nodePalette[type]}22`
                  }}
                >
                  {columnLabels[type]}
                </Badge>
              ))}
            </Group>

            <div className="flow-frame">
              <ReactFlow
                nodes={buildNodes(graph)}
                edges={buildEdges(graph)}
                fitView
                minZoom={0.5}
                maxZoom={1.35}
                nodesDraggable={false}
                nodeTypes={{
                  default: ({ data }) => (
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: `${String(data.typeColor)}12`,
                          color: String(data.typeColor),
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 8
                        }}
                      >
                        {String(data.typeLabel)}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          lineHeight: 1.35,
                          color: "#111827"
                        }}
                      >
                        {String(data.label)}
                      </div>
                    </div>
                  )
                }}
              >
                <MiniMap
                  pannable
                  zoomable
                  style={{ background: "rgba(244, 246, 248, 0.95)" }}
                />
                <Controls />
                <Background color="rgba(0, 0, 0, 0.04)" gap={24} />
              </ReactFlow>
            </div>
          </>
        ) : (
          <Paper
            radius="md"
            p="lg"
            style={{
              background: "var(--surface-soft)",
              border: "1px solid var(--surface-border)"
            }}
          >
            <Text c="dimmed" fz="sm">
              {t("map.empty")}
            </Text>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
