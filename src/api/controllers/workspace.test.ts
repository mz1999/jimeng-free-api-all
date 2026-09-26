import { test } from "node:test";
import assert from "node:assert/strict";

import { pickWorkspaceByName } from "./workspace-pick.ts";

test("pickWorkspaceByName: 命中同名项目返回 id 字符串", () => {
  const list = [
    { workspace_id: 0, name: "" },
    { workspace_id: 18777804437772, name: "言画人物" },
  ];
  assert.equal(pickWorkspaceByName(list, "言画人物"), "18777804437772");
});

test("pickWorkspaceByName: 名称比较前做 trim", () => {
  const list = [{ workspace_id: 22420677980684, name: " 纺织城的细纱 EP12 " }];
  assert.equal(pickWorkspaceByName(list, "纺织城的细纱 EP12"), "22420677980684");
});

test("pickWorkspaceByName: 未命中返回 null", () => {
  const list = [{ workspace_id: 1, name: "别的项目" }];
  assert.equal(pickWorkspaceByName(list, "不存在"), null);
});

test("pickWorkspaceByName: 空列表返回 null", () => {
  assert.equal(pickWorkspaceByName([], "任意"), null);
  assert.equal(pickWorkspaceByName(undefined as any, "任意"), null);
});

test("pickWorkspaceByName: 目标名为空/空白直接返回 null", () => {
  const list = [{ workspace_id: 1, name: "" }];
  assert.equal(pickWorkspaceByName(list, ""), null);
  assert.equal(pickWorkspaceByName(list, "   "), null);
  assert.equal(pickWorkspaceByName(list, undefined as any), null);
});

test("pickWorkspaceByName: 忽略 workspace_id 无效的条目", () => {
  const list = [
    { workspace_id: 0, name: "纺织城的细纱 EP12" },
    { workspace_id: 22420677980684, name: "纺织城的细纱 EP12" },
  ];
  assert.equal(pickWorkspaceByName(list, "纺织城的细纱 EP12"), "22420677980684");
});
