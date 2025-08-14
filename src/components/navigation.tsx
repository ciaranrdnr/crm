
import React from "react";
import { Menu, Avatar, Badge } from "antd";

interface TopNavigationProps {
  logo: React.ReactNode;
  menuItems: { key: string; label: string }[];
  selectedKey: string[];
  notificationCount?: number;
  avatarSrc?: string;
}

export default function TopNavigation({
  logo,
  menuItems,
  notificationCount = 0,
  selectedKey,
  avatarSrc,
}: TopNavigationProps) {
  return (
    <div className="flex items-center justify-between px-4 border-b bg-white h-14">
      <div>{logo}</div>
      <Menu
        mode="horizontal"
        selectedKeys={selectedKey}
        selectable
        items={menuItems}
        className="min-w-1/2 justify-center"
      />
      <div className="flex items-center gap-4">
        <Badge count={notificationCount}>
          <span className="cursor-pointer">🔔</span>
        </Badge>
        {avatarSrc && <Avatar src={avatarSrc} />}
      </div>
    </div>
  );
}
