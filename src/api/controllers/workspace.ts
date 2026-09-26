import { request } from "./core.ts";
import logger from "@/lib/logger.ts";
import { pickWorkspaceByName } from "./workspace-pick.ts";

export { pickWorkspaceByName };

// 即梦「项目」（workspace）解析与创建
// 端点族 /mweb/v1/workspace/* 与生成接口同族，纯 sessionid 可直调（2026-09-26 生产 session
// 实测 create/list/delete round-trip 通过；网关对 id 的数字/字符串形态均接受）。
// 解析或创建失败一律降级返回 undefined——归档是锦上添花，出图优先。

const WORKSPACE_LIST_URI = "/mweb/v1/workspace/list";
const WORKSPACE_CREATE_URI = "/mweb/v1/workspace/create";

/**
 * 按名称解析即梦项目 id：已存在则复用，不存在则创建（幂等）。
 * 任何失败只记警告并返回 undefined，调用方据此跳过归档，不阻断生成。
 */
export async function ensureWorkspaceId(
  name: string,
  refreshToken: string
): Promise<string | undefined> {
  const target = String(name ?? "").trim();
  if (!target) return undefined;
  try {
    const listData: any = await request("post", WORKSPACE_LIST_URI, refreshToken, {
      data: {},
    });
    const existing = pickWorkspaceByName(listData?.workspaces, target);
    if (existing) {
      logger.info(`[Workspace] 项目「${target}」已存在: ${existing}`);
      return existing;
    }
    const createData: any = await request(
      "post",
      WORKSPACE_CREATE_URI,
      refreshToken,
      { data: { name: target } }
    );
    if (!createData?.workspace_id) {
      logger.warn(`[Workspace] 创建项目「${target}」未返回 id，本次生成不归档`);
      return undefined;
    }
    logger.info(`[Workspace] 已创建项目「${target}」: ${createData.workspace_id}`);
    return String(createData.workspace_id);
  } catch (error) {
    logger.warn(
      `[Workspace] 解析/创建项目「${target}」失败，本次生成不归档: ${
        error instanceof Error ? error.message : error
      }`
    );
    return undefined;
  }
}
