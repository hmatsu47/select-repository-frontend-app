// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { fireEvent, render } from "@solidjs/testing-library";
import { App } from "../../src/components/App";
import { baseUri } from "../../src/api/apiHandler";
import {
  isOpenedConfirm,
  setImageUri,
  setIsOpenedConfirm,
  setReleaseAt,
} from "../../src/signal";

describe("<App />", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  const appList = [
    {
      title: "暗幕状態で [Esc] キー押下",
      beforeKeyUp: true,
      keyString: "Escape",
      afterKeyUp: false,
      testFetch: true,
    },
    {
      title: "暗幕なしで [Esc] キー押下",
      beforeKeyUp: false,
      keyString: "Escape",
      afterKeyUp: false,
      testFetch: false,
    },
    {
      title: "暗幕状態で [Enter] キー押下",
      beforeKeyUp: true,
      keyString: "Enter",
      afterKeyUp: true,
      testFetch: false,
    },
  ];
  appList.forEach((testCase) => {
    test(testCase.title, async () => {
      setImageUri(undefined);
      setReleaseAt(undefined);
      setIsOpenedConfirm(testCase.beforeKeyUp);
      const mock = mockGet(`${baseUri}/services`).willResolve();
      const { container, unmount } = render(() => <App />);
      if (testCase.testFetch) {
        expect(mock).toHaveFetched();
      }
      // キー押下
      fireEvent.keyUp(container, { key: testCase.keyString });
      // モーダルオープン／クローズ
      expect(isOpenedConfirm()).toBe(testCase.afterKeyUp);
      unmount();
    });
  });
});
