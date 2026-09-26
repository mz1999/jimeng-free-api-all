// 即梦项目列表按名匹配的纯逻辑——独立成零依赖模块，便于 node:test 密闭测试
// （workspace.ts 的 import 链会拉起 logger 的常驻定时器，测试进程无法退出）。

/**
 * 从项目列表中按名称精确匹配（trim 后比较），命中返回 id 字符串，未命中返回 null。
 * workspace_id 无效（<=0/缺失）的条目（如 id=0 的默认项目）不参与匹配。
 */
export function pickWorkspaceByName(
  workspaces: Array<{ workspace_id?: number | string; name?: string }> | undefined,
  name: string
): string | null {
  const target = String(name ?? "").trim();
  if (!target) return null;
  const hit = (workspaces ?? []).find(
    (item) =>
      Number(item?.workspace_id) > 0 &&
      String(item?.name ?? "").trim() === target
  );
  return hit ? String(hit.workspace_id) : null;
}
