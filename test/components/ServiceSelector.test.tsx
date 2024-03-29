// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { render } from "@solidjs/testing-library";
import { formatSnapshot } from "../common/formatSnapshot";
import { ServiceItem } from "../../src/type";
import { ServiceSelector } from "../../src/components/ServiceSelector";
import { baseUri } from "../../src/api/apiHandler";
import { setServices } from "../../src/signal";

describe("<ServiceSelector />", () => {
  const serviceSelectorList = [
    {
      title: "サービス x1",
      services: [{ name: "service1" } as ServiceItem],
    },
    {
      title: "サービス x2",
      services: [
        { name: "service1" } as ServiceItem,
        { name: "service2" } as ServiceItem,
      ],
    },
    {
      title: "サービス x3",
      services: [
        { name: "service1" } as ServiceItem,
        { name: "service2" } as ServiceItem,
        { name: "service3" } as ServiceItem,
      ],
    },
  ];
  beforeEach(() => {
    mockFetch.clearAll();
    // localStorage はモック化すべきかも（うまくいかなかったため一旦モックなしで実装）
    localStorage.removeItem("selectedService");
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  serviceSelectorList.forEach((testCase) => {
    test(testCase.title, async () => {
      setServices(testCase.services);
      const mockServices = mockGet(`${baseUri}/services`).willResolve(
        testCase.services
      );
      const { container, findByText, unmount } = render(() => (
        <ServiceSelector />
      ));
      expect(mockServices).toHaveFetched();
      // css の名前が動的に変わるので固定値に置換
      const html = formatSnapshot(container.innerHTML);
      expect(html).toMatchSnapshot();
      // 各ボタン
      testCase.services.forEach(async (service) => {
        const button = (await findByText(service.name)) as HTMLElement;
        expect(button).toHaveTextContent(service.name);
      });
      unmount();
    });
  });
});
