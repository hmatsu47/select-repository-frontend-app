// @vitest-environment jsdom

import { expect, test } from "vitest";
import "vi-fetch/setup";
import { mockGet } from "vi-fetch";
import { ServiceItem } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { fetchServices } from "../../src/api/fetchServices";

describe("fetchImages", () => {
  test(`サービス一覧 API 呼び出し`, async () => {
    const mock = mockGet(`${baseUri}/services`).willResolve([
      {
        name: "hoge",
      },
      {
        name: "fuga",
      },
    ] as ServiceItem[]);
    await fetchServices();
    // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
    expect(mock).toHaveFetched();
    mock.clear();
  });
});
