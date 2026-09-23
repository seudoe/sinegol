"use client";

import { useMemo, useState } from "react";
import Tree from "react-d3-tree";

type AdminNode = {
  id: string;
  name: string;
  username: string;
  approved_by: string | null;
  admin_depth: number;
};

type TreeNode = {
  name: string;
  attributes: {
    username: string;
    depth: number;
  };
  children?: TreeNode[];
};

export function AdminHierarchyGraph({ admins, currentUserId }: { admins: AdminNode[], currentUserId?: string }) {
  const [zoom, setZoom] = useState(0.8);

  // Convert flat list to tree
  const treeData = useMemo(() => {
    if (!admins || admins.length === 0) return null;

    const nodeMap = new Map<string, TreeNode>();
    
    // Create base nodes
    admins.forEach(admin => {
      const isMe = admin.id === currentUserId;
      nodeMap.set(admin.id, {
        name: isMe ? `${admin.name} (You)` : admin.name,
        attributes: {
          username: "@" + admin.username,
          depth: admin.admin_depth || 0,
        },
        children: []
      });
    });

    const roots: TreeNode[] = [];

    // Assemble tree
    admins.forEach(admin => {
      const node = nodeMap.get(admin.id)!;
      if (admin.approved_by && nodeMap.has(admin.approved_by)) {
        nodeMap.get(admin.approved_by)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    // We can only return a single root for react-d3-tree easily.
    // If there are multiple roots (multiple depth 0s), wrap them in a virtual root.
    if (roots.length === 1) {
      return roots[0];
    } else {
      return {
        name: "Platform Roots",
        attributes: { username: "System", depth: -1 },
        children: roots
      };
    }
  }, [admins]);

  if (!treeData) return <p className="text-muted-foreground text-sm">Not enough data to draw tree.</p>;

  // Custom node rendering for better styling
  const renderCustomNodeElement = ({ nodeDatum }: { nodeDatum: TreeNode | any }) => (
    <g>
      <rect width="180" height="70" x="-90" y="-35" className="fill-card stroke-primary" strokeWidth="2" rx="10" />
      <text className="fill-foreground font-bold text-sm" strokeWidth="0" x="0" y="-5" textAnchor="middle">
        {nodeDatum.name}
      </text>
      <text className="fill-muted-foreground text-xs" strokeWidth="0" x="0" y="15" textAnchor="middle">
        {nodeDatum.attributes?.username}
      </text>
      {nodeDatum.attributes?.depth >= 0 && (
        <text className="fill-primary text-[10px]" strokeWidth="0" x="0" y="30" textAnchor="middle">
          Depth: {nodeDatum.attributes?.depth}
        </text>
      )}
    </g>
  );

  return (
    <div className="w-full h-[500px] border rounded-lg bg-muted/20 relative shadow-inner overflow-hidden mt-8">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="bg-background border rounded px-3 py-1 shadow-sm text-sm hover:bg-muted">+</button>
        <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} className="bg-background border rounded px-3 py-1 shadow-sm text-sm hover:bg-muted">-</button>
      </div>
      <Tree 
        data={treeData} 
        orientation="vertical"
        pathFunc="step"
        zoom={zoom}
        translate={{ x: 400, y: 100 }}
        nodeSize={{ x: 220, y: 150 }}
        renderCustomNodeElement={renderCustomNodeElement}
        separation={{ siblings: 1.2, nonSiblings: 1.5 }}
      />
    </div>
  );
}
