import { NextRequest, NextResponse } from "next/server";

function parseTableUrl(url: string): { appToken: string; tableId: string } | null {
  try {
    const urlObj = new URL(url);

    // 从路径中提取 app_token: /base/bascnxxxxxxxxxxxxxx
    const pathParts = urlObj.pathname.split("/");
    const appTokenPart = pathParts.find(part => part.startsWith("bascn"));

    // 从查询参数中提取 table_id
    const tableId = urlObj.searchParams.get("table");

    if (appTokenPart && tableId) {
      return { appToken: appTokenPart, tableId };
    }
    return null;
  } catch (error) {
    console.error("解析飞书表格 URL 失败:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "缺少 jobId 参数" },
        { status: 400 }
      );
    }

    const {
      FEISHU_APP_ID,
      FEISHU_APP_SECRET,
      FEISHU_TABLE_URL,
      FEISHU_FIELD_JOB_ID,
    } = process.env;

    if (!FEISHU_APP_ID || !FEISHU_APP_SECRET || !FEISHU_TABLE_URL) {
      return NextResponse.json(
        { error: "飞书配置信息不完整" },
        { status: 500 }
      );
    }

    // 解析表格 URL 获取 app_token 和 table_id
    const parsedUrl = parseTableUrl(FEISHU_TABLE_URL);
    if (!parsedUrl) {
      return NextResponse.json(
        { error: "飞书表格 URL 格式不正确，请检查配置" },
        { status: 500 }
      );
    }

    const { appToken, tableId } = parsedUrl;

    // 1. 获取飞书访问凭证
    const tokenResponse = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.tenant_access_token) {
      console.error("获取飞书Token失败:", tokenData);
      return NextResponse.json(
        { error: "获取飞书访问凭证失败" },
        { status: 500 }
      );
    }

    const accessToken = tokenData.tenant_access_token;

    // 2. 查询多维表格数据
    // 使用 filter 参数精确匹配 jobId
    const filter = `CurrentValue.['${FEISHU_FIELD_JOB_ID}']="${jobId}"`;
    const tableResponse = await fetch(
      `https://open.feishu.cn/open-apis/bitables/v1/apps/${appToken}/tables/${tableId}/records?filter=${encodeURIComponent(filter)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    const tableData = await tableResponse.json();

    if (!tableData.data || !tableData.data.items) {
      console.error("查询飞书表格失败:", tableData);
      return NextResponse.json(
        { error: "查询飞书表格失败" },
        { status: 500 }
      );
    }

    const records = tableData.data.items;

    if (records.length === 0) {
      return NextResponse.json({
        found: false,
        status: "not_found",
        message: "任务尚未创建，请稍后再试",
      });
    }

    // 3. 返回最新的记录（理论上应该只有一条）
    const record = records[0];
    const fields = record.fields;

    const fieldJobId = fields[FEISHU_FIELD_JOB_ID || "jobId"] || jobId;
    const fieldStatus = fields[process.env.FEISHU_FIELD_STATUS || "status"] || "pending";
    const fieldResult = fields[process.env.FEISHU_FIELD_RESULT || "result"];

    return NextResponse.json({
      found: true,
      recordId: record.record_id,
      status: fieldStatus,
      jobId: fieldJobId,
      result: fieldResult || null,
      createdTime: record.created_time,
      lastModifiedTime: record.last_modified_time,
    });

  } catch (error) {
    console.error("查询任务状态失败:", error);
    return NextResponse.json(
      { error: "查询任务失败" },
      { status: 500 }
    );
  }
}
