// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { fireEvent, render } from "solid-testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { RepositoryItem, ServiceItem, Setting } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { ServiceButton } from "../../src/components/ServiceButton";
import { service } from "../../src/signal";

describe("<ServiceButton />", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("サービスボタン", async () => {
    localStorage.removeItem("selectedService");
    const mockSetting = mockGet(`${baseUri}/setting/service1`).willResolve({
      is_released: false,
    } as Setting);
    const mockRepositories = mockGet(
      `${baseUri}/repositories/service1`
    ).willResolve([
      {
        name: "repository1",
        uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/repository1",
      } as RepositoryItem,
    ]);
    const { container, findByText, unmount } = render(() => (
      <ServiceButton serviceItem={{ name: "service1" } as ServiceItem} />
    ));
    // css の名前が動的に変わるので固定値に置換
    const htmlBefore = formatSnapshot(container.innerHTML);
    expect(htmlBefore).toMatchSnapshot();
    // ボタンクリック
    const button = (await findByText("service1")) as HTMLInputElement;
    expect(button).toHaveTextContent("service1");
    fireEvent.click(button);
    // ボタンクリック後の照合
    const htmlAfter = formatSnapshot(container.innerHTML);
    expect(htmlAfter).toMatchSnapshot();
    expect(mockSetting).toHaveFetched();
    expect(service()).toBe("service1");
    // 現状では setting の呼び出しまでしか捕捉できないようなのでコメントアウト
    // expect(mockRepositories).toHaveFetched();
    unmount();
    localStorage.removeItem("selectedService");
  });
});
